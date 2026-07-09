'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { useSector } from '@/app/contexts/SectorContext';
import { getValidKeyOrDefault } from '@/app/client-utils';

const sectors = [
  'All Sectors',
  'Lost Labor',
  'Health Care',
  'Child Services & K-12',
  'Criminal Legal System'
] as const;

const marginMap = {
  none: 'mt-0',
  small: 'mt-4',
  medium: 'mt-8',
  large: 'mt-16',
};

const marginBottomMap = {
  none: 'mb-0',
  small: 'mb-4',
  medium: 'mb-8',
  large: 'mb-16',
};

export default function SectorSelector({ 
  block 
}: { 
  block: {
    marginTop?: 'none' | 'small' | 'medium' | 'large';
    marginBottom?: 'none' | 'small' | 'medium' | 'large';
  };
}) {
  const { selectedSector, setSelectedSector } = useSector();
  const { marginTop = 'medium', marginBottom = 'medium' } = block;
  const safeMarginTop = getValidKeyOrDefault(marginTop, marginMap, 'medium');
  const safeMarginBottom = getValidKeyOrDefault(marginBottom, marginBottomMap, 'medium');
  
  // State for dropdown functionality
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const triggerId = useId();

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSectorSelect = (sector: typeof sectors[number]) => {
    setSelectedSector(sector);
    setIsDropdownOpen(false);
  };

  return (
    <div className={`${marginMap[safeMarginTop as keyof typeof marginMap]} ${marginBottomMap[safeMarginBottom as keyof typeof marginBottomMap]} flex justify-center items-center`}>
      {/* Desktop: Button layout */}
      <div className="hidden md:flex flex-wrap gap-3 justify-center" role="group" aria-label="Sector filter">
        {sectors.map((sector) => {
          const isSelected = selectedSector === sector;
          return (
            <button
              key={sector}
              type="button"
              onClick={() => setSelectedSector(sector)}
              aria-pressed={isSelected}
              className={`
                px-3 py-2 rounded-[3px] font-inter text-sm transition-all duration-100
                border
                ${isSelected 
                  ? 'bg-[#3275B6] text-white border-[#3275B6]' 
                  : 'bg-[#F2F1F1] text-[#414141] border-[#eee] hover:bg-[#F6F6F6] hover:shadow-md hover:transform hover:-translate-y-0.5'
                }
                active:scale-95
                focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[#11607A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#11607A]
              `}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: isSelected ? 600 : 400,
                lineHeight: '150%',
                letterSpacing: isSelected ? '-0.266px' : 'normal',
              }}
            >
              {sector}
            </button>
          );
        })}
      </div>

      {/* Mobile: Dropdown */}
      <div className="md:hidden flex items-center gap-3">
        <label htmlFor={triggerId} className="text-[#414141] font-inter text-[14px] font-bold whitespace-nowrap">
          Sectors:
        </label>
        <div className="relative flex-1" ref={dropdownRef}>
          <button
            id={triggerId}
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            aria-expanded={isDropdownOpen}
            aria-haspopup="listbox"
            aria-controls={listboxId}
            className="
              w-full min-w-[200px] px-4 py-1 
              bg-white border border-[#E7E7E7] rounded-[3px]
              flex justify-between items-center
              font-inter text-[14px] font-normal text-[#414141]
              hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#4783B5] focus:border-transparent
              transition-all duration-200
            "
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              lineHeight: '150%',
            }}
          >
            <span>{selectedSector}</span>
            <svg
              className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div
              id={listboxId}
              role="listbox"
              aria-label="Sectors"
              className="
              absolute top-full left-0 right-0 mt-1
              bg-white border border-gray-300 rounded-md shadow-lg
              z-50 max-h-60 overflow-y-auto
            ">
              {sectors.map((sector) => {
                const isSelected = selectedSector === sector;
                return (
                  <button
                    key={sector}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSectorSelect(sector)}
                    className={`
                      w-full px-4 py-3 text-left
                      font-inter text-sm transition-all duration-200
                      border
                      ${isSelected 
                        ? 'bg-[#4783B5] text-white border-[#4783B5]' 
                        : 'bg-[#F2F1F1] text-[#414141] border-[#eee] hover:bg-[#F6F6F6] hover:shadow-md hover:transform hover:-translate-y-0.5'
                      }
                      first:rounded-t-md last:rounded-b-md
                      focus:outline-none
                    `}
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      fontWeight: isSelected ? 600 : 400,
                      lineHeight: '150%',
                      letterSpacing: isSelected ? '-0.266px' : 'normal',
                    }}
                  >
                    {sector}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
