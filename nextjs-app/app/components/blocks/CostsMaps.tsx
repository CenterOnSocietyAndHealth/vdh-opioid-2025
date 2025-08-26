'use client';

import React, { useState, useEffect } from 'react';
import { CostsMapProps, CostsMapIndicator, DisplayType } from '@/app/types/costsMaps';
import { useLocality } from '@/app/contexts/LocalityContext';
import { useSector } from '@/app/contexts/SectorContext';
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

// Mapping between SectorSelector sectors and CostsMaps tabs
const sectorToTabMapping: Record<string, CostsMapIndicator> = {
  'All Sectors': 'Total',
  'Lost Labor': 'Labor',
  'Healthcare': 'HealthCare',
  'Child Services & K12': 'Household',
  'Criminal Justice': 'Crime_Other',
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
  const { selectedSector } = useSector();
  const [indicatorTab, setIndicatorTab] = useState<CostsMapIndicator>(block.defaultIndicator || 'Total');
  const [mounted, setMounted] = useState(false);
  const [showDetailedDescription, setShowDetailedDescription] = useState(false);



  // Set mounted state once component is mounted on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Watch for changes in selectedSector and update indicatorTab accordingly
  useEffect(() => {
    if (selectedSector && sectorToTabMapping[selectedSector]) {
      setIndicatorTab(sectorToTabMapping[selectedSector]);
    }
  }, [selectedSector]);

  // Debug: Monitor changes to selectedLocality
  useEffect(() => {
    console.log('CostsMaps: selectedLocality changed to:', selectedLocality);
  }, [selectedLocality]);

  // Get the display type from block props
  const displayType = block.type || 'PerCapita';
  const marginTop = block.marginTop || 'none';
  const marginBottom = block.marginBottom || 'none';

  function getColorsByIndicator(indicator: CostsMapIndicator) {
    const scheme = colorSchemes.find(scheme => scheme.name === indicator);
    return scheme ? scheme.colors : colorSchemes[0].colors;
  }

  // Log sector context
  console.log('CostsMaps sector context:', { selectedSector });

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
    console.log('CostsMaps: handleLocalityClick called with:', locality);
    console.log('Current selectedLocality before update:', selectedLocality);
    setSelectedLocality(locality);
    console.log('setSelectedLocality called, new locality should be:', locality);
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
      <div className="relative mx-auto max-w-[1200px]">
        {/* Map Container */}
        <div className="bg-white p-4">
          <div 
            className="min-h-[400px]"
            role="region"
            aria-label={`${tabIndicatorMapping[indicatorTab]} Costs Map`}
          >
            <ChoroplethMap 
              key={`${indicatorTab}-${displayType}-${selectedLocality?._id || 'state'}`}
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
      </div>
    </div>
  );
} 