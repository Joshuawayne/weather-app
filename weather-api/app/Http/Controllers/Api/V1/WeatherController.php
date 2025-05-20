<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request; // Though not used directly in 'show', good to keep for future
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WeatherController extends Controller
{
    protected ?string $apiKey;
    protected string $openWeatherMapBaseUrl = 'https://api.openweathermap.org/data/2.5';

    public function __construct()
    {
        $this->apiKey = env('OPENWEATHERMAP_API_KEY');
        if (empty($this->apiKey)) {
            // Log this critical issue during instantiation
            Log::error('CRITICAL: OpenWeatherMap API Key is not configured in .env file or is empty.');
        }
    }

    /**
     * Display the weather data for a specified city.
     */
    public function show(string $city)
    {
        Log::info("--- WeatherController@show initiated for city: {$city} ---");

        if (empty($this->apiKey)) {
            // This check is redundant if constructor logs, but good for explicit return
            return response()->json(['error' => 'API service configuration error on server. API key missing.'], 503);
        }
        Log::info("API Key found, proceeding to fetch weather for {$city}.");

        // Fetch Current Weather
        $currentWeatherResponse = Http::timeout(10)->get("{$this->openWeatherMapBaseUrl}/weather", [
            'q' => $city,
            'appid' => $this->apiKey,
            'units' => 'metric'
        ]);

        // Fetch Forecast
        $forecastResponse = Http::timeout(10)->get("{$this->openWeatherMapBaseUrl}/forecast", [
            'q' => $city,
            'appid' => $this->apiKey,
            'units' => 'metric',
            'cnt' => 40 // Fetch enough data points
        ]);

        // Handle API Call Failures for Current Weather
        if ($currentWeatherResponse->failed()) {
            $statusCode = $currentWeatherResponse->status();
            $responseBody = $currentWeatherResponse->body();
            Log::error("OpenWeatherMap API error (current weather for {$city}): Status {$statusCode} - {$responseBody}");
            $errorMessage = $this->getOpenWeatherMapErrorMessage($statusCode, $city, 'current weather');
            return response()->json(['error' => $errorMessage, 'details' => "OWM_CURRENT_FAIL:{$statusCode}"], $statusCode === 401 ? 503 : $statusCode);
        }

        // Handle API Call Failures for Forecast
        if ($forecastResponse->failed()) {
            $statusCode = $forecastResponse->status();
            $responseBody = $forecastResponse->body();
            Log::error("OpenWeatherMap API error (forecast for {$city}): Status {$statusCode} - {$responseBody}");
            $errorMessage = $this->getOpenWeatherMapErrorMessage($statusCode, $city, 'forecast');
            return response()->json(['error' => $errorMessage, 'details' => "OWM_FORECAST_FAIL:{$statusCode}"], $statusCode === 401 ? 503 : $statusCode);
        }

        // Process and Format Data
        try {
            Log::info("Successfully fetched data from OpenWeatherMap for {$city}. Formatting...");
            $formattedData = $this->formatWeatherData($currentWeatherResponse->json(), $forecastResponse->json());
            Log::info("Data formatted successfully for {$city}. Sending response.");
            return response()->json($formattedData);
        } catch (\Throwable $e) { // Catch any throwable, including ParseError, TypeError
            Log::critical("Error processing weather data for {$city}: " . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'An internal error occurred while processing weather data.'], 500);
        }
    }

    private function getOpenWeatherMapErrorMessage(int $statusCode, string $city, string $dataType): string
    {
        if ($statusCode === 401) return "Weather service authentication failed. Please contact support.";
        if ($statusCode === 404) return "The {$dataType} for city '{$city}' could not be found by the weather service.";
        if ($statusCode === 429) return "Weather service request limit reached. Please try again later.";
        return "Could not fetch {$dataType} data (Service Status: {$statusCode}).";
    }

    private function formatWeatherData(array $current, array $forecastInput): array
    {
        $dailyAggregatedForecast = [];
        if (isset($forecastInput['list']) && is_array($forecastInput['list'])) {
            foreach ($forecastInput['list'] as $item) {
                if (!isset($item['dt'], $item['main']['temp'], $item['weather'][0]['icon'])) continue;
                $date = date('Y-m-d', $item['dt']);
                if (!isset($dailyAggregatedForecast[$date])) {
                    $dailyAggregatedForecast[$date] = ['temps' => [], 'icons' => [], 'dt' => $item['dt']];
                }
                $dailyAggregatedForecast[$date]['temps'][] = $item['main']['temp'];
                $dailyAggregatedForecast[$date]['icons'][] = $item['weather'][0]['icon'];
            }
        }
        ksort($dailyAggregatedForecast);

        $processedForecastDays = [];
        $daysCounted = 0;
        foreach ($dailyAggregatedForecast as $date => $dayData) {
            if ($daysCounted >= 3) break;
            if (empty($dayData['temps']) || empty($dayData['icons'])) continue;
            $iconCounts = array_count_values($dayData['icons']);
            arsort($iconCounts);
            $representativeIcon = key($iconCounts);
            $minTemp = round(min($dayData['temps']));
            $maxTemp = round(max($dayData['temps']));
            $processedForecastDays[] = [
                'date' => date('j M', strtotime($date)), 'icon' => $representativeIcon,
                'temp_min' => $minTemp, 'temp_max' => $maxTemp,
                'temp_range' => "{$minTemp}-{$maxTemp}°C",
            ];
            $daysCounted++;
        }

        return [
            'location' => [
                'name' => $current['name'] ?? 'N/A',
                'country' => $current['sys']['country'] ?? '',
                'date_full' => isset($current['dt']) ? date('jS M Y', $current['dt']) : date('jS M Y'),
            ],
            'current' => [
                'temp' => round($current['main']['temp'] ?? 0),
                'description' => ucfirst($current['weather'][0]['description'] ?? 'N/A'),
                'icon' => $current['weather'][0]['icon'] ?? '01d',
            ],
            'details' => [
                'humidity' => $current['main']['humidity'] ?? 0,
                'wind' => [
                    'speed_kmh' => round(($current['wind']['speed'] ?? 0) * 3.6),
                    'speed_mph' => round(($current['wind']['speed'] ?? 0) * 2.23694),
                    'direction' => $this->getWindDirectionString($current['wind']['deg'] ?? 0),
                ],
            ],
            'forecast' => $processedForecastDays,
            'source_units' => 'metric',
        ];
    }

    private function getWindDirectionString(float $degrees): string
    {
        $directions = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
        $degrees = fmod($degrees, 360);
        if ($degrees < 0) { $degrees += 360; }
        return $directions[round($degrees / 22.5) % 16];
    }
}