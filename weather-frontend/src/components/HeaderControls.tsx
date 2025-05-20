// src/components/HeaderControls.tsx
import React, { FormEvent } from 'react';

interface HeaderControlsProps {
  searchInput: string;
  onSearchInputChange: (value: string) => void;
  onSearchSubmit: (e: FormEvent) => void;
  isLoading: boolean;
  // To show spinner in button if current search input matches the city being loaded
  isSearchingThisCity: boolean;
  currentUnit: 'C' | 'F';
  onUnitChange: (unit: 'C' | 'F') => void;
}

const HeaderControls: React.FC<HeaderControlsProps> = ({
  searchInput,
  onSearchInputChange,
  onSearchSubmit,
  isLoading,
  isSearchingThisCity,
  currentUnit,
  onUnitChange,
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
      <form onSubmit={onSearchSubmit} className="w-full sm:max-w-sm">
        <div className="join w-full shadow-md">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => onSearchInputChange(e.target.value)}
            placeholder="Enter city name..."
            className="input join-item input-bordered w-full text-gray-800 focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
            aria-label="Search city"
            disabled={isLoading} // Disable input while loading overall
          />
          <button
            type="submit"
            className="btn btn-primary join-item hover:bg-sky-500 disabled:opacity-70" // More visual cue for disabled
            disabled={isLoading} // Disable button while loading overall
          >
            {isLoading && isSearchingThisCity ? ( // Show spinner if loading *this specific* search
              <span className="loading loading-spinner loading-xs"></span>
            ) : (
              'GO'
            )}
          </button>
        </div>
      </form>
      <div className="flex gap-2 shadow-md rounded-btn">
        <button
          onClick={() => onUnitChange('C')}
          aria-pressed={currentUnit === 'C'}
          className={`btn btn-sm ${
            currentUnit === 'C' ? 'btn-active btn-neutral text-white' : 'btn-ghost hover:bg-white/20'
          }`}
        >
          °C
        </button>
        <button
          onClick={() => onUnitChange('F')}
          aria-pressed={currentUnit === 'F'}
          className={`btn btn-sm ${
            currentUnit === 'F' ? 'btn-active btn-neutral text-white' : 'btn-ghost hover:bg-white/20'
          }`}
        >
          °F
        </button>
      </div>
    </div>
  );
};

export default HeaderControls;