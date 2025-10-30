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

type SortColumn = 'locality' | 'household' | 'federal' | 'stateLocal';
type SortDirection = 'asc' | 'desc';

export default function LocalityPayorBreakdown({ block, localities }: LocalityPayorBreakdownProps) {
  const { 
    title,
    maxWidth = 654,
    marginTop = 'medium',
    marginBottom = 'medium'
  } = block;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<SortColumn>('locality');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Handle column header click for sorting
  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Toggle direction if clicking the same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column and default to ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Filter localities excluding Virginia (CountyFIPS: 51999) and apply search filter
  const filteredLocalities = useMemo(() => {
    if (!localities || localities.length === 0) {
      return [];
    }
    
    const filtered = localities
      .filter(locality => locality.countyFips !== '51999') // Exclude Virginia state total
      .filter(locality => 
        locality.counties.trim().toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    // Sort based on selected column and direction
    return filtered.sort((a, b) => {
      let compareValue = 0;
      
      switch (sortColumn) {
        case 'locality':
          compareValue = a.counties.trim().localeCompare(b.counties.trim());
          break;
        case 'household':
          const aHousehold = a.sectorBreakdown?.householdSectorTotal ?? 0;
          const bHousehold = b.sectorBreakdown?.householdSectorTotal ?? 0;
          compareValue = aHousehold - bHousehold;
          break;
        case 'federal':
          const aFederal = a.sectorBreakdown?.fedGovtSectorTotal ?? 0;
          const bFederal = b.sectorBreakdown?.fedGovtSectorTotal ?? 0;
          compareValue = aFederal - bFederal;
          break;
        case 'stateLocal':
          const aStateLocal = a.sectorBreakdown?.stateLocalSectorTotal ?? 0;
          const bStateLocal = b.sectorBreakdown?.stateLocalSectorTotal ?? 0;
          compareValue = aStateLocal - bStateLocal;
          break;
      }
      
      return sortDirection === 'asc' ? compareValue : -compareValue;
    });
  }, [localities, searchTerm, sortColumn, sortDirection]);

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
      className={`mx-4 md:mx-auto p-6 px-4 md:px-12 ${marginMap[marginTop]} ${marginBottomMap[marginBottom]}`}
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
      <div 
        className="overflow-x-auto"
        role="region"
        aria-label={`Interactive sortable locality payer breakdown table for ${filteredLocalities.length} Virginia localities`}
      >
        <table className="w-full border-collapse table-fixed" role="table">
          <colgroup>
            <col className="w-[28%]" />
            <col className="w-[24%]" />
            <col className="w-[24%]" />
            <col className="w-[24%]" />
          </colgroup>
          <thead className="sticky top-0 bg-[#F3F2EC] z-10">
            <tr className="border-t border-b border-[#979797]">
              <th 
                className="text-left py-1 px-0 text-[#6E6E6E] font-inter text-xs font-normal cursor-pointer hover:text-[#1E1E1E] transition-colors select-none"
                onClick={() => handleSort('locality')}
              >
                <div className="flex items-center gap-1">
                  <span>Locality</span>
                  {sortColumn === 'locality' && (
                    <span className="inline-flex flex-col w-3 h-4">
                      {sortDirection === 'asc' ? (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" />
                        </svg>
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="text-right py-1 px-0 text-[#6E6E6E] font-inter text-xs font-normal cursor-pointer hover:text-[#1E1E1E] transition-colors select-none"
                onClick={() => handleSort('household')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Families / Businesses</span>
                  {sortColumn === 'household' && (
                    <span className="inline-flex flex-col w-3 h-4">
                      {sortDirection === 'asc' ? (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" />
                        </svg>
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="text-right py-1 px-0 text-[#6E6E6E] font-inter text-xs font-normal cursor-pointer hover:text-[#1E1E1E] transition-colors select-none"
                onClick={() => handleSort('federal')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Federal Gov&apos;t</span>
                  {sortColumn === 'federal' && (
                    <span className="inline-flex flex-col w-3 h-4">
                      {sortDirection === 'asc' ? (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" />
                        </svg>
                      )}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="text-right py-1 px-0 text-[#6E6E6E] font-inter text-xs font-normal cursor-pointer hover:text-[#1E1E1E] transition-colors select-none"
                onClick={() => handleSort('stateLocal')}
              >
                <div className="flex items-center justify-end gap-1">
                  <span>State / Local Gov&apos;t</span>
                  {sortColumn === 'stateLocal' && (
                    <span className="inline-flex flex-col w-3 h-4">
                      {sortDirection === 'asc' ? (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" />
                        </svg>
                      ) : (
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" />
                        </svg>
                      )}
                    </span>
                  )}
                </div>
              </th>
            </tr>
          </thead>
        </table>
        <div 
          className="max-h-[340px] overflow-y-auto scrollbar-hide"
          tabIndex={0}
          role="region"
          aria-label={`Interactive locality payer breakdown table showing ${filteredLocalities.length} Virginia localities with scrollable content. Columns show Families & Businesses, Federal Government, and State/Local Government costs for opioid epidemic`}
        >
          <table className="w-full border-collapse table-fixed">
            <colgroup>
              <col className="w-[31%]" />
              <col className="w-[23%]" />
              <col className="w-[23%]" />
              <col className="w-[23%]" />
            </colgroup>
            <tbody>
              {filteredLocalities.map((locality) => (
                <tr key={locality._id} className="border-b border-[#E0DCDC] hover:bg-gray-50">
                  <td className="py-2 px-0 text-[#1E1E1E] font-inter text-xs md:text-sm font-normal">
                    {locality.counties.trim().replace(/\bCounty\b/g, 'Co.')}
                  </td>
                  <td className="py-2 px-0 text-right text-[#1E1E1E] font-inter text-xs md:text-sm font-normal">
                    {locality.sectorBreakdown?.householdSectorTotal != null
                      ? formatCostAbbr(locality.sectorBreakdown.householdSectorTotal)
                      : 'N/A'
                    }
                  </td>
                  <td className="py-2 px-0 text-right text-[#1E1E1E] font-inter text-xs md:text-sm font-normal">
                    {locality.sectorBreakdown?.fedGovtSectorTotal != null
                      ? formatCostAbbr(locality.sectorBreakdown.fedGovtSectorTotal)
                      : 'N/A'
                    }
                  </td>
                  <td className="py-2 px-0 text-right text-[#1E1E1E] font-inter text-xs md:text-sm font-normal">
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
