// src/components/CurrentWeatherDisplay.tsx
import React from 'react';
import Image from 'next/image';
import { WeatherData } from '@/types/weather';
// No need to import formatDisplayTemp if you use convertTemperature directly for this specific styling
// import { formatDisplayTemp } from '@/utils/formatting'; // Or keep it if you use it elsewhere

// If you want to keep the convertTemperature logic local to this component or import it:
// Option 1: Define/Import convertTemperature
const convertTemperature = (tempCelsius: number, unit: 'C' | 'F'): number => {
  if (unit === 'F') {
    return Math.round((tempCelsius * 9/5) + 32);
  }
  return Math.round(tempCelsius);
};


interface CurrentWeatherDisplayProps {
  currentWeather: WeatherData['current'];
  locationData: WeatherData['location'];
  displayUnit: 'C' | 'F';
  getWeatherIconUrl: (iconCode: string) => string;
  cityForIconKey: string;
  iconRef: React.RefObject<HTMLImageElement | null>;
  temperatureRef: React.RefObject<HTMLParagraphElement | null>;
  descriptionRef: React.RefObject<HTMLParagraphElement | null>;
  locationRef: React.RefObject<HTMLDivElement | null>;
}

const CurrentWeatherDisplay: React.FC<CurrentWeatherDisplayProps> = ({
  currentWeather,
  locationData,
  displayUnit,
  getWeatherIconUrl,
  cityForIconKey,
  iconRef,
  temperatureRef,
  descriptionRef,
  locationRef,
}) => {
  return (
    <div className="lg:col-span-1 p-6 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-lg border border-white/20 flex flex-col items-center text-center">
      <Image
        ref={iconRef}
        key={currentWeather.icon + cityForIconKey}
        src={getWeatherIconUrl(currentWeather.icon)}
        alt={currentWeather.description}
        width={160}
        height={160}
        priority
        className="drop-shadow-lg -mt-12 mb-0"
      />
      <p ref={temperatureRef} className="text-7xl font-bold tracking-tight drop-shadow-md">
        {/* Reverted to using convertTemperature directly for the original styling */}
        {convertTemperature(currentWeather.temp, displayUnit)}°
        <span className="text-5xl align-top">{displayUnit.charAt(0)}</span>
      </p>
      <p ref={descriptionRef} className="text-2xl font-light mt-2 mb-5 capitalize drop-shadow-sm">
        {currentWeather.description}
      </p>
      <hr className="border-white/20 my-3 w-3/4" />
      <div ref={locationRef}>
        <p className="text-lg">{locationData.date_full}</p>
        <p className="text-3xl font-semibold">{locationData.name}</p>
      </div>
    </div>
  );
};

export default CurrentWeatherDisplay;