'use client';

import React, { useMemo } from 'react';
import { Locality } from '@/app/types/locality';

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

// Helper to format income values
function formatIncome(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toPrecision(3)}M`;
  } else if (value >= 1_000) {
    return `$${(value / 1_000).toPrecision(3)}K`;
  }
  return `$${value}`;
}

// Helper to format percentage values
function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export interface HighestCostsProps {
  block: {
    title: string;
    maxWidth?: number;
    marginTop?: 'none' | 'small' | 'medium' | 'large';
    marginBottom?: 'none' | 'small' | 'medium' | 'large';
  };
  localities: Locality[];
}

export default function HighestCosts({ block, localities }: HighestCostsProps) {
  const { 
    title,
    maxWidth = 654,
    marginTop = 'medium',
    marginBottom = 'medium'
  } = block;
  
  // Get the top 5 localities with highest Total Costs Per Person
  const topLocalities = useMemo(() => {
    if (!localities || localities.length === 0) {
      return [];
    }
    
    return localities
      .filter(locality => locality.countyFips !== '51999') // Exclude Virginia state total
      .filter(locality => locality.opioidMetrics?.totalPerCapita != null) // Only include localities with data
      .sort((a, b) => (b.opioidMetrics?.totalPerCapita || 0) - (a.opioidMetrics?.totalPerCapita || 0)) // Sort by highest totalPerCapita
      .slice(0, 5); // Take top 5
  }, [localities]);

  // Show loading state if localities are not loaded yet
  if (!localities || localities.length === 0) {
    return (
      <div 
        className={`mx-auto p-6 rounded-lg ${marginMap[marginTop]}`}
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
    <section>
    <div 
      className={`mx-4 md:mx-auto p-6 px-4 md:px-8 ${marginMap[marginTop]}`}
      style={{ 
        maxWidth: `${maxWidth}px`,
        backgroundColor: '#F3F2EC'
      }}
    >
      {/* Header */}
      <div className="mb-6">
        <h2 
          className="text-[#000] font-inter text-lg font-bold leading-[150%] tracking-[-0.342px]"
          style={{
            color: '#000',
            fontFamily: 'Inter',
            fontSize: '18px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '150%',
            letterSpacing: '-0.342px'
          }}
        >
          {title}
        </h2>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-fixed">
          <colgroup>
            <col className="w-[20%]" />
            <col className="w-[20%]" />
            <col className="w-[20%]" />
            <col className="w-[20%]" />
            <col className="w-[20%]" />
          </colgroup>
          <thead className="sticky top-0 bg-[#F3F2EC] z-10">
            <tr className="border-t border-b border-[#979797]">
              <th className="text-left py-1 px-0 text-[#6E6E6E] font-inter text-xs font-normal">
                Locality
              </th>
              <th className="text-right py-1 px-0 text-[#6E6E6E] font-inter text-xs font-normal">
                Income
              </th>
              <th className="text-right py-1 px-0 text-[#6E6E6E] font-inter text-xs font-normal">
                <div className="flex flex-col">
                    <span>Poverty</span>
                    <span>Rate</span>
                </div>
              </th>
              <th className="text-right py-1 px-0 text-[#6E6E6E] font-inter text-xs font-normal">
                <div className="flex flex-col">
                    <span>Local All-Sector</span>
                    <span>Opioid Costs*</span>
                </div>
              </th>
              <th className="text-right py-1 px-0 text-[#6E6E6E] font-inter text-xs font-normal">
                <div className="flex flex-col">
                  <span>Local Lost Labor</span>
                  <span>Opioid Costs*</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {topLocalities.map((locality) => (
              <tr key={locality._id} className="border-b border-[#E0DCDC] hover:bg-gray-50">
                <td className="py-2 px-0 text-[#1E1E1E] font-inter text-xs md:text-sm font-normal">
                  {locality.counties.trim()}
                </td>
                <td className="py-2 px-0 text-right text-[#1E1E1E] font-inter text-xs md:text-sm font-normal">
                  {locality.demographics?.medianIncome != null
                    ? formatIncome(locality.demographics.medianIncome)
                    : 'N/A'
                  }
                </td>
                <td className="py-2 px-0 text-right text-[#1E1E1E] font-inter text-xs md:text-sm font-normal">
                  {locality.demographics?.povertyPct != null
                    ? formatPercentage(locality.demographics.povertyPct)
                    : 'N/A'
                  }
                </td>
                <td className="py-2 px-0 text-right text-[#1E1E1E] font-inter text-xs md:text-sm font-normal">
                  {locality.opioidMetrics?.totalPerCapita != null
                    ? formatCostAbbr(locality.opioidMetrics.totalPerCapita)
                    : 'N/A'
                  }
                </td>
                <td className="py-2 px-0 text-right text-[#1E1E1E] font-inter text-xs md:text-sm font-normal">
                  {locality.opioidMetrics?.laborPerCapita != null
                    ? formatCostAbbr(locality.opioidMetrics.laborPerCapita)
                    : 'N/A'
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* No results message */}
      {topLocalities.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No locality data available.
        </div>
      )}
    </div>
    {/* Footnote */ }
          <div className={`mt-3 mx-4 md:mx-auto ${marginBottomMap[marginBottom]}`} style={{
        maxWidth: `${maxWidth}px`,
    }}>
        <p
            className="text-left mb-2"
            style={{
                color: '#1E1E1E',
                fontFamily: 'Inter',
                fontSize: '12px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '100%'
            }}
        >
            * Costs Per Person
        </p>
    </div>
    </section>
  );
}
