// src/components/ForecastDayCard.tsx
import React from 'react';
import Image from 'next/image';
import { ForecastDayData } from '@/types/weather'; // Using direct import
import { formatDisplayTempRange, convertTemperature } from '@/utils/formatting'; // Import formatting helpers

interface ForecastDayCardProps {
  dayData: ForecastDayData; // Expects data for a single forecast day
  displayUnit: 'C' | 'F';   // Current unit for display
  getWeatherIconUrl: (iconCode: string) => string; // Function to get icon URL
  assignRef: (el: HTMLDivElement | null) => void; // Callback to assign this card's ref to the parent
}

const ForecastDayCard: React.FC<ForecastDayCardProps> = ({
  dayData,
  displayUnit,
  getWeatherIconUrl,
  assignRef,
}) => {
  // If dayData is somehow not provided, render nothing to prevent errors
  if (!dayData) {
    return null;
  }

  // Determine the temperature range string based on the display unit.
  // The backend sends `dayData.temp_range` pre-formatted for Celsius.
  // If the display unit is Fahrenheit, we re-calculate and format using the raw Celsius min/max values.
  const tempRangeString =
    displayUnit === 'C'
      ? dayData.temp_range // Use pre-formatted Celsius string from API/backend
      : formatDisplayTempRange(dayData.temp_min, dayData.temp_max, 'F'); // Convert and format for Fahrenheit

  return (
    <div
      ref={assignRef} // Assign the ref for potential GSAP animations controlled by the parent
      className="p-4 rounded-xl shadow-lg bg-white/10 backdrop-blur-md border border-white/10 text-center flex flex-col items-center transform hover:scale-105 transition-transform duration-200 ease-in-out"
    >
      <p className="font-medium text-lg">{dayData.date}</p>
      <Image
        // Using a combination of icon, date, and displayUnit for a robust key.
        // This helps React efficiently update or re-render if these critical pieces of data change.
        key={dayData.icon + dayData.date + displayUnit}
        src={getWeatherIconUrl(dayData.icon)}
        alt={`${dayData.date} weather icon`}
        width={80}
        height={80}
        className="my-1 drop-shadow-sm"
      />
      <p className="text-lg">{tempRangeString}</p>
    </div>
  );
};

export default ForecastDayCard; // Default export for the component