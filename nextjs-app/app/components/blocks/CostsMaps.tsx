'use client';

import React, { useState, useEffect } from 'react';
import { CostsMapProps, CostsMapIndicator, DisplayType } from '@/app/types/costsMaps';
import { useLocality } from '@/app/contexts/LocalityContext';
import dynamic from 'next/dynamic';
import { Locality } from '@/app/types/locality';
import { PortableText } from '@portabletext/react';
import topojson from 'topojson-client';

// Define the ChoroplethMap props type to match what we'll pass to the dynamic component
interface ChoroplethMapProps {
  indicator: CostsMapIndicator;
  displayType: DisplayType;
  selectedLocality: Locality | null;
  localities: Locality[];
  colors: string[];
  totalValue: number;
  onLocalityClick?: (locality: Locality) => void;
}

// Dynamic import for ChoroplethMap to avoid server-side rendering issues with D3
const ChoroplethMap = dynamic<ChoroplethMapProps>(
  () => import('@/app/components/blocks/ChoroplethMap'),
  {
    ssr: false,
    loading: () => <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center">Loading map...</div>
  }
) as React.ComponentType<ChoroplethMapProps>;

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

// Color schemes for different indicators
const colorSchemes = [
  { name: "Total", colors: ["#f3dfc4", "#d38ab0", "#be58a4", "#782774"] },
  { name: "Labor", colors: ["#dfecc4", "#8bb8b4", "#5898a8", "#315674"] },
  { name: "HealthCare", colors: ["#e9e3cc", "#ae9ad1", "#886dd5", "#473a96"] },
  { name: "Crime_Other", colors: ["#faecd4", "#f1b89a", "#c6482e", "#520002"] },
  { name: "Household", colors: ["#fcf2d7", "#e9a164", "#dd7739", "#a2331c"] }
];

// Mapping between tab names and corresponding display names
const tabIndicatorMapping = {
  'Total': 'Total',
  'Labor': 'Lost Labor',
  'HealthCare': 'Healthcare',
  'Crime_Other': 'Criminal Justice',
  'Household': 'Child Services & K-12',
};

// Tooltip contents for each indicator
const tooltipContents = {
  'Total': 'Total cost includes costs of lost labor, healthcare, and public services related to opioids, spanning local, state, and federal governments, as well as household and private sector expenses.',
  'Labor': 'The cost of lost labor was calculated by counting opioid-related deaths, non-fatal cases of opioid use disorder, and incarcerations due to opioids. Next, we predicted the average earnings of these individuals combined. This prediction was based on Virginia residents of similar ages holding a high school diploma.',
  'HealthCare': 'The health care total combines direct and indirect health care cost in each locality. Direct costs represent emergency and inpatient visits for opioid overdose, and other opioid-related visits. Indirect costs represent treatment for opioid-related conditions, such as HIV and Neonatal Abstinence Syndrome.',
  'Crime_Other': 'The crime/other figure estimates government expenditures for public services needed to respond to the opioid epidemic, mainly criminal justice costs, child and family assistance costs, and education costs. In this calculation, we include the economic burden on households, local, state and federal government.',
  'Household': 'The largest portion of the economic burden is held by households and the private sector. Costs include lost wages and increased private healthcare costs.'
};

export default function CostsMaps({ block, localities, pageId }: CostsMapProps) {
  const { selectedLocality, setSelectedLocality } = useLocality();
  const [indicatorTab, setIndicatorTab] = useState<CostsMapIndicator>(block.defaultIndicator || 'Total');
  const [tooltipOpen, setTooltipOpen] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);
  const [showDetailedDescription, setShowDetailedDescription] = useState(false);

  // Arrow positions for the tabs (in percentage)
  const arrowPositions = ['62%', '56%', '50%', '44%', '38%'];
  const tabs: CostsMapIndicator[] = ['Total', 'Labor', 'HealthCare', 'Crime_Other', 'Household'];

  // Set mounted state once component is mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get the display type from block props
  const displayType = block.type || 'PerCapita';
  const marginTop = block.marginTop || 'none';
  const marginBottom = block.marginBottom || 'none';

  function getColorsByIndicator(indicator: CostsMapIndicator) {
    const scheme = colorSchemes.find(scheme => scheme.name === indicator);
    return scheme ? scheme.colors : colorSchemes[0].colors;
  }

  // Calculate total for the current indicator (across all localities)
  const calculateTotal = (indicator: string) => {
    if (!localities) return 0;
    
    let fieldName = indicator.toLowerCase();
    // Special case for Crime_Other to match the field names in the data
    if (fieldName === 'crime_other') {
      fieldName = 'crimeOther';
    }
    // Special case for HealthCare to match the field names in the data
    if (fieldName === 'healthcare') {
      fieldName = 'healthcare';
    }
    
    const fieldPath = `opioidMetrics.${fieldName}${displayType === 'PerCapita' ? 'PerCapita' : 'Total'}`;
    
    return localities.reduce((total, locality) => {
      // Access nested properties using the fieldPath
      const value = fieldPath.split('.').reduce((obj, key) => obj?.[key], locality as any) || 0;
      return total + value;
    }, 0);
  };

  // Handle locality click
  const handleLocalityClick = (locality: Locality) => {
    setSelectedLocality(locality);
  };

  // Get the description for the current tab
  const getCurrentDescription = () => {
    switch (indicatorTab) {
      case 'Total':
        return block.totalDescription;
      case 'Labor':
        return block.laborDescription;
      case 'HealthCare':
        return block.healthcareDescription;
      case 'Crime_Other':
        return block.crimeOtherDescription;
      case 'Household':
        return block.householdDescription;
      default:
        return null;
    }
  };

  // Don't render until mounted on the client
  if (!mounted) {
    return (
      <div className={`${marginMap[marginTop]} ${marginBottomMap[marginBottom]}`}>
        <div className="relative mx-auto p-4">
          <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center">
            <p>Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${marginMap[marginTop]} ${marginBottomMap[marginBottom]}`}>
      {/* Detailed Description */}
      {getCurrentDescription() && (
        <div className="bg-white mt-4 mb-2">
          <button
            onClick={() => setShowDetailedDescription(!showDetailedDescription)}
            className="text-sm font-bold uppercase tracking-wider text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center gap-2"
          >
            Detailed Chart Description{' '}
            <span 
              className="inline-block transform transition-transform duration-200"
              style={{
                transform: showDetailedDescription ? 'rotate(225deg) translate(-4px,-3px)' : 'rotate(45deg)',
                display: 'inline-block',
                width: '10px',
                height: '10px',
                borderRight: '3px solid currentColor',
                borderBottom: '3px solid currentColor',
                marginLeft: '4px',
                marginTop: '-2px'
              }}
            />
          </button>
          <div
            className={`px-2 py-0 max-w-none text-[16px] [&_p]:text-[16px] transition-all duration-300 ease-in-out ${
              showDetailedDescription ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}
          >
            <PortableText value={getCurrentDescription()} />
          </div>
        </div>
      )}
      <div className="relative mx-auto">
        {/* Tab Navigation */}
        <div className="bg-[#F3F3F3] border border-black m-0">
          <div className="tab-section">
            <div className="flex box-border border-b border-black text-base">
              <div className={`w-4/5 text-center py-2.5 px-[38px] font-bold border-r-[0.5px] border-black ${
                indicatorTab === 'Household' ? 'bg-[#F3F3F4]' : 'bg-[#D3D8E2]'
              }`}>BY SECTOR</div>
              <div className={`w-1/5 text-center py-2.5 px-2.5 font-bold border-l-[0.5px] border-black ${
                indicatorTab === 'Household' ? 'bg-[#D3D8E2]' : 'bg-[#F3F3F4]'
              }`}>BY PAYER</div>
            </div>
            
            <div role="tablist" className="flex mb-0">
              {tabs.map((tab, index) => {
                const isActiveTab = indicatorTab === tab;
                
                return (
                  <div
                    key={tab}
                    role="tab"
                    tabIndex={isActiveTab ? 0 : -1}
                    aria-label={tabIndicatorMapping[tab]}
                    {...isActiveTab ? {'aria-selected': 'true'} : {'aria-selected': 'false'}}
                    onClick={() => {
                      setIndicatorTab(tab);
                      const newTooltipState = Object.keys(tooltipOpen).reduce((acc, key) => {
                        acc[key] = false;
                        return acc;
                      }, {} as Record<string, boolean>);
                      setTooltipOpen(newTooltipState);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowRight') {
                        const nextIndex = (index + 1) % tabs.length;
                        setIndicatorTab(tabs[nextIndex]);
                      } else if (e.key === 'ArrowLeft') {
                        const prevIndex = (index - 1 + tabs.length) % tabs.length;
                        setIndicatorTab(tabs[prevIndex]);
                      }
                    }}
                    className={`flex-1 p-5 cursor-pointer relative text-center text-[21px] font-[300] z-[${5 - index}] ${
                      index === tabs.length - 1 ? '' : 'border-r-[0.5px] border-black'
                    } ${
                      index === 0 ? '' : 'border-l-[0.5px] border-black'
                    } border-b border-black ${
                      isActiveTab ? 'bg-[#082459] text-white' : 'bg-[#EAEAEA] text-black'
                    }`}
                  >
                    {tabIndicatorMapping[tab]}
                    <button
                      className="info ml-[7px] -translate-y-0.5 w-[15px] h-[15px] border rounded-full inline-flex items-center justify-center p-0 bg-transparent cursor-pointer"
                      tabIndex={0}
                      aria-label={`${tabIndicatorMapping[tab]} information`}
                      title={tooltipContents[tab]}
                      style={{
                        borderColor: isActiveTab ? 'white' : 'black'
                      }}
                    >
                      <span aria-hidden="true" className="text-xs">i</span>
                    </button>
                    
                    {isActiveTab && (
                      <div
                        className="tabArrow absolute -bottom-4 left-1/2 -translate-x-1/2 z-10"
                        style={{
                          content: '""',
                          width: 0,
                          height: 0,
                          borderLeft: '16px solid transparent',
                          borderRight: '16px solid transparent',
                          borderTop: '16px solid #082459'
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Map Container */}
          <div 
            className="bg-white p-0 min-h-[400px]"
            role="region"
            aria-label={`${tabIndicatorMapping[indicatorTab]} Costs Map`}
          >
            <ChoroplethMap 
              key={`${indicatorTab}-${displayType}`}
              indicator={indicatorTab}
              displayType={displayType}
              selectedLocality={selectedLocality}
              localities={localities || []}
              colors={getColorsByIndicator(indicatorTab)}
              totalValue={calculateTotal(`${indicatorTab}`)}
              onLocalityClick={handleLocalityClick}
            />
          </div>
        </div>
        

        
        {/* Data Summary */}
        <div className="mt-6 p-4 border border-gray-300">
          <h3 className="text-xl font-bold mb-3">{selectedLocality ? selectedLocality.counties : 'Virginia'} Data Summary</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left border">Cost Category</th>
                <th className="p-2 text-left border">Per Capita Cost</th>
                <th className="p-2 text-left border">Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {tabs.map((tab) => {
                // Get per capita and total values
                const perCapitaKey = `opioidMetrics.${tab.toLowerCase()}PerCapita`;
                const totalKey = `opioidMetrics.${tab.toLowerCase()}Total`;
                
                // Access nested values using safe property access
                const getNestedValue = (obj: any, path: string) => {
                  return path.split('.').reduce((o, key) => o?.[key], obj) || 0;
                };
                
                const perCapitaValue = selectedLocality ? 
                  getNestedValue(selectedLocality, perCapitaKey) : 
                  calculateTotal(`${tab}PerCapita`) / (localities?.length || 1);
                
                const totalValue = selectedLocality ? 
                  getNestedValue(selectedLocality, totalKey) : 
                  calculateTotal(`${tab}Total`);
                
                return (
                  <tr key={tab} className={tab === indicatorTab ? "bg-blue-50" : ""}>
                    <td className="p-2 border font-medium">{tabIndicatorMapping[tab]}</td>
                    <td className="p-2 border">${Math.round(perCapitaValue).toLocaleString()}</td>
                    <td className="p-2 border">${Math.round(totalValue).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 