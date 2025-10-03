'use client';

import React, { useState, useMemo } from 'react';
import { LocalityPayorBreakdownProps } from '@/app/types/locality';

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

// Helper to format cost values as $3.41B, $891M, etc.
function formatCostAbbr(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toPrecision(3)}B`;
  } else if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toPrecision(3)}M`;
  } else if (value >= 1_000) {
    return `$${(value / 1_000).toPrecision(3)}K`;
  }
  return `$${value}`;
}

export default function LocalityPayorBreakdown({ block, localities }: LocalityPayorBreakdownProps) {
  const { 
    title,
    maxWidth = 654,
    marginTop = 'medium',
    marginBottom = 'medium'
  } = block;
  
  const [searchTerm, setSearchTerm] = useState('');

  // Filter localities excluding Virginia (CountyFIPS: 51999) and apply search filter
  const filteredLocalities = useMemo(() => {
    if (!localities || localities.length === 0) {
      return [];
    }
    return localities
      .filter(locality => locality.countyFips !== '51999') // Exclude Virginia state total
      .filter(locality => 
        locality.counties.trim().toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => a.counties.trim().localeCompare(b.counties.trim()));
  }, [localities, searchTerm]);

  console.log("filteredLocalities", filteredLocalities);
  console.log("localities", localities);

  // Show loading state if localities are not loaded yet
  if (!localities || localities.length === 0) {
    return (
      <div 
        className={`mx-auto p-6 rounded-lg ${marginMap[marginTop]} ${marginBottomMap[marginBottom]}`}
        style={{ 
          maxWidth: `${maxWidth}px`,
          backgroundColor: '#F3F2EC'
        }}
      >
        <div className="text-center py-8 text-gray-500">
          Loading locality data...
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`mx-auto p-6 px-12 ${marginMap[marginTop]} ${marginBottomMap[marginBottom]}`}
      style={{ 
        maxWidth: `${maxWidth}px`,
        backgroundColor: '#F3F2EC'
      }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-[#000] font-inter text-lg font-bold leading-[150%] tracking-[-0.342px]">{title}</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="locality-search" className="text-[#1E1E1E] font-inter text-xs font-normal leading-[100%]">
            Search locality:
          </label>
          <input
            id="locality-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Enter locality name..."
                      className="px-1 py-1 border border-[#D7D7D7] rounded-[3px] text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white placeholder:text-xs"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-fixed">
          <colgroup>
            <col className="w-[34%]" />
            <col className="w-[22%]" />
            <col className="w-[22%]" />
            <col className="w-[22%]" />
          </colgroup>
          <thead className="sticky top-0 bg-[#F3F2EC] z-10">
            <tr className="border-t border-b border-[#979797]">
              <th className="text-left py-1 px-0 text-[#6E6E6E] font-inter text-xs font-normal leading-[250%]">Locality</th>
              <th className="text-right py-1 px-0 text-[#6E6E6E] font-inter text-xs font-normal leading-[250%]">Families/Businesses</th>
              <th className="text-right py-1 px-0 text-[#6E6E6E] font-inter text-xs font-normal leading-[250%]">Federal Gov&apos;t</th>
              <th className="text-right py-1 px-0 text-[#6E6E6E] font-inter text-xs font-normal leading-[250%]">State/Local Gov&apos;t</th>
            </tr>
          </thead>
        </table>
        <div className="max-h-[340px] overflow-y-auto scrollbar-hide">
          <table className="w-full border-collapse table-fixed">
            <colgroup>
              <col className="w-[34%]" />
              <col className="w-[22%]" />
              <col className="w-[22%]" />
              <col className="w-[22%]" />
            </colgroup>
            <tbody>
              {filteredLocalities.map((locality) => (
                <tr key={locality._id} className="border-b border-[#E0DCDC] hover:bg-gray-50">
                  <td className="py-0 px-0 text-[#1E1E1E] font-inter text-sm font-normal leading-[289%]">
                    {locality.counties.trim()}
                  </td>
                  <td className="py-0 px-0 text-right text-[#1E1E1E] font-inter text-sm font-normal leading-[289%]">
                    {locality.sectorBreakdown?.householdSectorTotal != null
                      ? formatCostAbbr(locality.sectorBreakdown.householdSectorTotal)
                      : 'N/A'
                    }
                  </td>
                  <td className="py-0 px-0 text-right text-[#1E1E1E] font-inter text-sm font-normal leading-[289%]">
                    {locality.sectorBreakdown?.fedGovtSectorTotal != null
                      ? formatCostAbbr(locality.sectorBreakdown.fedGovtSectorTotal)
                      : 'N/A'
                    }
                  </td>
                  <td className="py-0 px-0 text-right text-[#1E1E1E] font-inter text-sm font-normal leading-[289%]">
                    {locality.sectorBreakdown?.stateLocalSectorTotal != null
                      ? formatCostAbbr(locality.sectorBreakdown.stateLocalSectorTotal)
                      : 'N/A'
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* No results message */}
      {filteredLocalities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? 'No localities found matching your search.' : 'No locality data available.'}
        </div>
      )}
    </div>
  );
}
