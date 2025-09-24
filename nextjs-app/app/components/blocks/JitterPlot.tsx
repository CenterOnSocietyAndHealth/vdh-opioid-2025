'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useLocality } from '@/app/contexts/LocalityContext';
import { useSector } from '@/app/contexts/SectorContext';
import { Locality } from '@/app/types/locality';

// Types for the component
type JitterPlotProps = {
  block: {
    marginTop?: 'none' | 'small' | 'medium' | 'large';
    marginBottom?: 'none' | 'small' | 'medium' | 'large';
  };
  localities: Locality[];
  pageId: string;
};

// Mapping for the margin classes
const marginMap: Record<string, string> = {
  none: 'mt-0',
  small: 'mt-4',
  medium: 'mt-8',
  large: 'mt-16',
};

const marginBottomMap: Record<string, string> = {
  none: 'mb-0',
  small: 'mb-4',
  medium: 'mb-8',
  large: 'mb-16',
};

// Mapping between SectorSelector sectors and data field names
const sectorToFieldMapping: Record<string, string> = {
  'All Sectors': 'totalPerCapita',
  'Lost Labor': 'laborPerCapita',
  'Health Care': 'healthcarePerCapita',
  'Child Services & K-12': 'householdPerCapita',
  'Criminal Justice': 'crimeOtherPerCapita',
};

// Display names for sectors
const sectorDisplayNames: Record<string, string> = {
  'All Sectors': 'Total',
  'Lost Labor': 'Lost Labor',
  'Health Care': 'Health Care',
  'Child Services & K-12': 'Child Services & K-12',
  'Criminal Justice': 'Criminal Justice',
};

// Color scheme for the plot
const colors = {
  background: '#f8f9fa',
  grid: '#e9ecef',
  dots: 'rgba(71, 131, 181, 0.3)', // Semi-transparent blue
  selectedDot: '#dc2626', // Red for selected locality
  averageLine: '#6b7280', // Gray for average line
  text: '#374151',
  subtitle: '#6b7280',
};

export default function JitterPlot({ block, localities, pageId }: JitterPlotProps) {
  const { selectedLocality } = useLocality();
  const { selectedSector } = useSector();
  const [mounted, setMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  // Set mounted state once component is mounted on client
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Get the margin values from block props
  const marginTop = block.marginTop || 'none';
  const marginBottom = block.marginBottom || 'none';

  // Process data for the current sector
  const plotData = useMemo(() => {
    if (!localities || !mounted) return { values: [], average: 0, selectedValue: 0 };

    const fieldName = sectorToFieldMapping[selectedSector];
    if (!fieldName) return { values: [], average: 0, selectedValue: 0 };

    // Get values for all localities (excluding Virginia)
    const values = localities
      .filter(loc => loc.counties !== 'Virginia')
      .map(loc => {
        const value = loc.opioidMetrics?.[fieldName as keyof typeof loc.opioidMetrics] || 0;
        const numericValue = typeof value === 'number' ? value : 0;
        return {
          value: numericValue,
          locality: loc,
          isSelected: selectedLocality?._id === loc._id,
        };
      })
      .filter(item => item.value > 0); // Only include localities with data

    // Calculate average
    const average = values.length > 0 
      ? values.reduce((sum, item) => sum + item.value, 0) / values.length 
      : 0;

    // Get selected locality value
    const selectedValue = selectedLocality && selectedLocality.counties !== 'Virginia'
      ? (() => {
          const value = selectedLocality.opioidMetrics?.[fieldName as keyof typeof selectedLocality.opioidMetrics] || 0;
          return typeof value === 'number' ? value : 0;
        })()
      : average;

    return { values, average, selectedValue };
  }, [localities, selectedSector, selectedLocality, mounted]);

  // Deterministic jitter utility so dots don't jump on re-render
  function hashStringToInt(input: string): number {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = (hash << 5) - hash + input.charCodeAt(i);
      hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  // Map hash to range [-amplitude, amplitude] in pixels
  function getVerticalJitter(localityId: string, amplitudePx: number): number {
    const seed = hashStringToInt(localityId);
    const normalized = (seed % 1000) / 999; // 0..1
    return (normalized * 2 - 1) * amplitudePx; // -amp .. +amp
  }

  // Calculate statistics for titles
  const { title, subtitle, percentageDifference } = useMemo(() => {
    const sectorDisplayName = sectorDisplayNames[selectedSector] || 'Costs';
    const isVirginiaSelected = !selectedLocality || selectedLocality.counties === 'Virginia';
    
    if (isVirginiaSelected) {
      return {
        title: `${sectorDisplayName} costs in Virginia averaged $${Math.round(plotData.average).toLocaleString()} per person.`,
        subtitle: `${sectorDisplayName} Cost Per Person of the Opioid Epidemic for All Virginia Localities, 2023`,
        percentageDifference: null,
      };
    } else {
      const diff = ((plotData.selectedValue - plotData.average) / plotData.average) * 100;
      const moreOrLess = diff > 0 ? 'more' : 'less';
      const absDiff = Math.abs(Math.round(diff));
      
      return {
        title: `${sectorDisplayName} costs in ${selectedLocality.counties} were ${absDiff}% ${moreOrLess} than the average community.`,
        subtitle: `${sectorDisplayName} Cost Per Person of the Opioid Epidemic for ${selectedLocality.counties}, 2023`,
        percentageDifference: diff,
      };
    }
  }, [selectedSector, selectedLocality, plotData]);

  // Don't render until mounted on the client
  if (!mounted) {
    return (
      <div className={`${marginMap[marginTop]} ${marginBottomMap[marginBottom]}`}>
        <div className="relative mx-auto p-4">
          <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center">
            <p>Loading chart...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${marginMap[marginTop]} ${marginBottomMap[marginBottom]}`}>
      <div className="relative mx-auto max-w-[800px] p-4">
        {/* Title */}
        <h2
          className="mb-2 mx-auto text-center"
          style={{
            color: '#1E1E1E',
            fontFamily: 'DM Sans',
            fontSize: '24px',
            fontStyle: 'normal',
            fontWeight: 400,
            lineHeight: '130%',
            maxWidth: '600px',
          }}
        >
          {(() => {
            const sectorName = sectorDisplayNames[selectedSector] || 'Costs';
            const isVirginiaSelected = !selectedLocality || selectedLocality.counties === 'Virginia';
            if (isVirginiaSelected) {
              return (
                <>
                  <span style={{ fontWeight: 700 }}>{sectorName}</span> costs in <span style={{ fontWeight: 700 }}>Virginia</span> averaged ${Math.round(plotData.average).toLocaleString()} per person.
                </>
              );
            }
            const moreOrLess = (percentageDifference || 0) > 0 ? 'more' : 'less';
            const localityName = selectedLocality?.counties || '';
            const absDiff = Math.abs(Math.round(percentageDifference || 0));
            const sectorLower = sectorName === 'Total' ? 'total costs' : sectorName.toLowerCase();
            return (
              <>
                <span style={{ fontWeight: 700 }}>{localityName}</span> paid {absDiff}% {moreOrLess} per person for <span style={{ fontWeight: 700 }}>{sectorLower}</span> than the average Virginia community
              </>
            );
          })()}
        </h2>

        {/* Subtitle */}
        <p
          className="mb-4 text-center"
          style={{
            color: '#1E1E1E',
            fontFamily: 'Inter',
            fontSize: '16px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: '130%',
            letterSpacing: '-0.16px'
          }}
        >
          {subtitle}
        </p>

        {/* Chart Container */}
        <div 
          className="bg-white border border-gray-200 p-6"
          style={{ minHeight: '400px' }}
        >
          {/* Chart Area */}
          <div className="relative w-full h-80">
            {/* Gradient bar below dots - represents data range */}
            <div className="absolute bottom-0 left-0 right-0 h-2">
              <div 
                className="w-full h-full"
                style={{
                  background: 'linear-gradient(to right, #e0f2fe 0%, #0ea5e9 100%)'
                }}
              ></div>
            </div>
            
            {/* Dots with vertical jitter to avoid overlap */}
            <div className="absolute inset-0 flex items-center">
              <div className="w-full relative">
                {plotData.values.map((item, index) => {
                  // Calculate position based on value (0 to max value maps to 0 to 100%)
                  const maxValue = Math.max(...plotData.values.map(v => v.value), plotData.average);
                  const position = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                  // Jitter amplitude smaller on narrow screens - doubled
                  const amplitude = (windowWidth || 1200) < 640 ? 16 : 28; // px
                  const jitter = getVerticalJitter(item.locality._id, amplitude);
                  
                  return (
                    <div
                      key={`${item.locality._id}-${index}`}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${position}%`, top: `calc(50% + ${jitter}px)` }}
                    >
                      <div
                        className={`w-4 h-4 rounded-full ${
                          item.isSelected ? 'bg-red-600' : ''
                        } hover:opacity-100 transition-opacity cursor-pointer`}
                        style={{
                          backgroundColor: item.isSelected ? undefined : 'rgba(29, 50, 101, 0.60)'
                        }}
                        title={`${item.locality.counties}: $${Math.round(item.value).toLocaleString()}`}
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Virginia Average Line - dotted vertical black line */}
            <div className="absolute inset-0 flex items-center">
              <div className="w-full relative">
                <div
                  className="absolute top-1/2 transform -translate-y-1/2 h-32 w-0.5 border-l-2 border-dotted border-black"
                  style={{ 
                    left: `${Math.max(...plotData.values.map(v => v.value), plotData.average) > 0 ? (plotData.average / Math.max(...plotData.values.map(v => v.value), plotData.average)) * 100 : 0}%` 
                  }}
                >
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-xs text-gray-600 font-medium whitespace-nowrap text-center">
                    Virginia Average/Person
                  </div>
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs text-gray-600 font-bold text-center">
                    ${Math.round(plotData.average).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Locality Line (if applicable) - positioned below dots - only show for non-Virginia localities */}
            {selectedLocality && selectedLocality.counties !== 'Virginia Total' && plotData.selectedValue > 0 && (
              <div className="absolute inset-0 flex items-center">
                <div className="w-full relative">
                  <div
                    className="absolute top-1/2 transform -translate-y-1/2 h-8 w-0.5 bg-red-600"
                    style={{ 
                      left: `${Math.max(...plotData.values.map(v => v.value), plotData.average) > 0 ? (plotData.selectedValue / Math.max(...plotData.values.map(v => v.value), plotData.average)) * 100 : 0}%` 
                    }}
                  >
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 text-xs text-red-600 font-medium whitespace-nowrap text-center">
                      {selectedLocality.counties}
                    </div>
                    <div className="absolute top-14 left-1/2 -translate-x-1/2 text-xs text-red-600 font-bold text-center">
                      ${Math.round(plotData.selectedValue).toLocaleString()}/person
                    </div>
                    <div className="absolute top-16 left-1/2 -translate-x-1/2 text-xs text-red-600 text-center">
                      (${Math.round(plotData.selectedValue * (selectedLocality.demographics?.totalPopulation || 0)).toLocaleString()} total cost)
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* X-axis Labels - positioned above gradient bar */}
          <div className="mt-2 flex justify-between text-sm text-gray-600">
            <span>$0 cost per person</span>
            <span>${Math.round(Math.max(...plotData.values.map(v => v.value), plotData.average)).toLocaleString()} cost per person</span>
          </div>

          {/* Legend */}
          <div className="mt-6 flex justify-end">
              <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'rgba(29, 50, 101, 0.60)' }}></div>
                <span className="text-gray-600">Virginia Localities</span>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
}
