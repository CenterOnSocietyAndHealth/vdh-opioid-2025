'use client';

import React, { useState, useEffect } from 'react';
import { CostsMapProps, CostsMapIndicator, DisplayType } from '@/app/types/costsMaps';
import { useLocality } from '@/app/contexts/LocalityContext';
import dynamic from 'next/dynamic';
import { Locality } from '@/app/types/locality';

// Define the ChoroplethMap props type to match what we'll pass to the dynamic component
interface ChoroplethMapProps {
  indicator: CostsMapIndicator;
  displayType: DisplayType;
  selectedLocality: Locality | null;
  localities: Locality[];
  colors: string[];
  totalValue: number;
}

// Dynamic import for ChoroplethMap to avoid server-side rendering issues with D3
const ChoroplethMap = dynamic<ChoroplethMapProps>(
  () => import('@/app/components/blocks/ChoroplethMap').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center">Loading map...</div>
  }
);

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
  'HealthCare': 'Health Care',
  'Crime_Other': 'Crime / Other',
  'Household': 'Household',
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
  const { selectedLocality } = useLocality();
  const [indicatorTab, setIndicatorTab] = useState<CostsMapIndicator>(block.defaultIndicator || 'Total');
  const [tooltipOpen, setTooltipOpen] = useState<Record<string, boolean>>({});
  const [mounted, setMounted] = useState(false);

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
    
    const fieldPath = `opioidMetrics.${indicator.toLowerCase()}${displayType === 'PerCapita' ? 'PerCapita' : 'Total'}`;
    
    return localities.reduce((total, locality) => {
      // Access nested properties using the fieldPath
      const value = fieldPath.split('.').reduce((obj, key) => obj?.[key], locality as any) || 0;
      return total + value;
    }, 0);
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
      <div className="relative mx-auto">
        {/* Tab Navigation */}
        <div style={{ padding: '0px', backgroundColor: '#F3F3F3', borderRadius: '0px', border: 'solid 0.5px black', margin: '0' }}>
          <div className="tab-section">
            <div style={{ display: 'flex', boxSizing: 'border-box', borderBottom: 'solid 0.5px black', fontSize: 16 }}>
              <div style={{
                width: '80%',
                backgroundColor: indicatorTab === 'Household' ? '#F3F3F4' : '#D3D8E2',
                textAlign: 'center',
                padding: '10px 38px',
                fontWeight: 'bold',
                borderRight: 'solid 0.5px black'
              }}>BY SECTOR</div>
              <div style={{
                width: '20%',
                backgroundColor: indicatorTab === 'Household' ? '#D3D8E2' : '#F3F3F4',
                textAlign: 'center',
                padding: '10px',
                fontWeight: 'bold',
                borderLeft: 'solid 0.5px black'
              }}>BY PAYER</div>
            </div>
            
            <div role="tablist" style={{ display: 'flex', marginBottom: '0px' }}>
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
                    className={`chartTab ${isActiveTab ? 'active-tab' : ''}`}
                    style={{
                      flex: 1,
                      padding: '12px 8px',
                      cursor: 'pointer',
                      borderRight: index === tabs.length - 1 ? 'none' : 'solid 0.5px black',
                      borderLeft: index === 0 ? 'none' : '',
                      borderBottom: 'solid 0.5px black',
                      backgroundColor: isActiveTab ? '#082459' : '#EAEAEA',
                      color: isActiveTab ? 'white' : 'black',
                      position: 'relative',
                      textAlign: 'center',
                      fontWeight: 500,
                      zIndex: 5 - index
                    }}
                  >
                    {tabIndicatorMapping[tab]}
                    <button
                      className="info"
                      tabIndex={0}
                      aria-label={`${tabIndicatorMapping[tab]} information`}
                      title={tooltipContents[tab]}
                      style={{
                        marginLeft: '7px',
                        transform: 'translateY(-2px)',
                        width: '15px',
                        height: '15px',
                        border: '1px solid',
                        borderColor: isActiveTab ? 'white' : 'black',
                        borderRadius: '50%',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 0,
                        backgroundColor: 'transparent',
                        cursor: 'pointer'
                      }}
                    >
                      <span aria-hidden="true" style={{ fontSize: '12px' }}>i</span>
                    </button>
                    
                    {isActiveTab && (
                      <div
                        className="tabArrow"
                        style={{
                          content: '""',
                          width: 0,
                          height: 0,
                          borderLeft: '16px solid transparent',
                          borderRight: '16px solid transparent',
                          borderTop: '16px solid #082459',
                          position: 'absolute',
                          bottom: '-16px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          zIndex: 10
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
            style={{ backgroundColor: 'white', padding: '0px', borderRadius: '0', minHeight: '400px' }}
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