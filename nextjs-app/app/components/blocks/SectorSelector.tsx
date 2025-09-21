'use client';

import React from 'react';
import { useSector } from '@/app/contexts/SectorContext';

const sectors = [
  'All Sectors',
  'Lost Labor',
  'Healthcare',
  'Child Services & K12',
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

  return (
    <div className={`${marginMap[marginTop]} ${marginBottomMap[marginBottom]} flex justify-center items-center`}>
      <div className="flex flex-wrap gap-3 justify-center">
        {sectors.map((sector) => {
          const isSelected = selectedSector === sector;
          return (
            <button
              key={sector}
              onClick={() => setSelectedSector(sector)}
              className={`
                px-3 py-2 rounded-[3px] font-inter text-sm font-bold transition-all duration-200
                ${isSelected 
                  ? 'bg-[#4783B5] text-white' 
                  : 'bg-[#F2F1F1] text-[#414141] font-normal'
                }
                hover:opacity-90 active:scale-95
              `}
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: isSelected ? 700 : 400,
                lineHeight: '150%',
                letterSpacing: isSelected ? '-0.266px' : 'normal',
              }}
            >
              {sector}
            </button>
          );
        })}
      </div>
    </div>
  );
}
