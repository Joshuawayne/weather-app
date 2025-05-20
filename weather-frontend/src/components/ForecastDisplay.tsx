// src/components/ForecastDisplay.tsx
import React from 'react';
import { ForecastDayData } from '@/types/weather'; // Using direct import
import ForecastDayCard from './ForecastDayCard';   // Importing the child card component

interface ForecastDisplayProps {
  forecastDays: ForecastDayData[]; // Expects an array of ForecastDayData objects
  displayUnit: 'C' | 'F';
  getWeatherIconUrl: (iconCode: string) => string;
  assignForecastCardRef: (el: HTMLDivElement | null, index: number) => void; // Callback to assign refs of child cards
}

const ForecastDisplay: React.FC<ForecastDisplayProps> = ({
  forecastDays,
  displayUnit,
  getWeatherIconUrl,
  assignForecastCardRef,
}) => {
  // If there's no forecast data or the array is empty, display a message.
  if (!forecastDays || forecastDays.length === 0) {
    return <p className="text-center text-sky-200 my-4">No forecast data available at the moment.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Map over the forecastDays array to render a ForecastDayCard for each day */}
      {forecastDays.map((day: ForecastDayData, index: number) => (
        <ForecastDayCard
          // Provide a unique key for each card for React's rendering efficiency.
          // Including displayUnit in key ensures re-render if unit changes, which might affect displayed text.
          key={day.date + index + displayUnit}
          dayData={day}
          displayUnit={displayUnit}
          getWeatherIconUrl={getWeatherIconUrl}
          // Pass down the ref assignment function, binding the current index.
          // This allows the parent (HomePage) to collect refs to each ForecastDayCard's DOM element.
          assignRef={(el: HTMLDivElement | null) => assignForecastCardRef(el, index)}
        />
      ))}
    </div>
  );
};

export default ForecastDisplay; // Default export for the component