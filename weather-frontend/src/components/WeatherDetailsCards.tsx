// src/components/WeatherDetailsCards.tsx
import React from 'react';
import { WeatherData } from '@/types/weather';

interface WeatherDetailsCardsProps {
  details: WeatherData['details'];
  displayUnit: 'C' | 'F'; // Added to decide which wind speed to show
  windCardRef: React.RefObject<HTMLDivElement | null>;
  humidityCardRef: React.RefObject<HTMLDivElement | null>;
}

const WeatherDetailsCards: React.FC<WeatherDetailsCardsProps> = ({
  details,
  displayUnit,
  windCardRef,
  humidityCardRef,
}) => {
  const windSpeedToDisplay =
    displayUnit === 'F' && details.wind.speed_mph !== undefined // Check if speed_mph exists
      ? details.wind.speed_mph
      : details.wind.speed_kmh;
  const windSpeedUnit = displayUnit === 'F' && details.wind.speed_mph !== undefined ? 'mph' : 'km/h';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div ref={windCardRef} className="p-5 rounded-xl shadow-lg bg-white/10 backdrop-blur-md border border-white/10 text-center">
        <h3 className="font-semibold text-lg mb-1">Wind Status</h3>
        <p className="text-4xl font-bold">
          {windSpeedToDisplay}
          <span className="text-xl font-normal"> {windSpeedUnit}</span>
        </p>
        <p className="text-md mt-1">{details.wind.direction}</p>
      </div>
      <div ref={humidityCardRef} className="p-5 rounded-xl shadow-lg bg-white/10 backdrop-blur-md border border-white/10 text-center">
        <h3 className="font-semibold text-lg mb-1">Humidity</h3>
        <p className="text-4xl font-bold">{details.humidity}%</p>
        <progress
          className="progress progress-info w-full mt-2 bg-white/30 [&::-webkit-progress-bar]:rounded-lg [&::-webkit-progress-value]:rounded-lg [&::-moz-progress-bar]:rounded-lg"
          value={details.humidity}
          max="100"
          aria-label={`Humidity: ${details.humidity}%`}
        ></progress>
      </div>
    </div>
  );
};

export default WeatherDetailsCards;