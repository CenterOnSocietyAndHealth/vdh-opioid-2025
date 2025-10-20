'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSector } from '@/app/contexts/SectorContext';
import { getValidKeyOrDefault } from '@/app/client-utils';

const sectors = [
  'All Sectors',
  'Lost Labor',
  'Health Care',
  'Child Services & K-12',
  'Criminal Justice'
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
      <div className="hidden md:flex flex-wrap gap-3 justify-center">
        {sectors.map((sector) => {
          const isSelected = selectedSector === sector;
          return (
            <button
              key={sector}
              onClick={() => setSelectedSector(sector)}
              className={`
                px-3 py-2 rounded-[3px] font-inter text-sm transition-all duration-100
                border
                ${isSelected 
                  ? 'bg-[#4783B5] text-white border-[#4783B5]' 
                  : 'bg-[#F2F1F1] text-[#414141] border-[#eee] hover:bg-[#F6F6F6] hover:shadow-md hover:transform hover:-translate-y-0.5'
                }
                active:scale-95
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
        <label className="text-[#414141] font-inter text-[14px] font-bold whitespace-nowrap">
          Sectors:
        </label>
        <div className="relative flex-1" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="
              absolute top-full left-0 right-0 mt-1
              bg-white border border-gray-300 rounded-md shadow-lg
              z-50 max-h-60 overflow-y-auto
            ">
              {sectors.map((sector) => {
                const isSelected = selectedSector === sector;
                return (
                  <button
                    key={sector}
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
