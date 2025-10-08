'use client';

import React, { useState, useEffect } from 'react';
import { CostsMapProps, CostsMapIndicator, DisplayType } from '@/app/types/costsMaps';
import { useLocality } from '@/app/contexts/LocalityContext';
import { useSector } from '@/app/contexts/SectorContext';
import dynamic from 'next/dynamic';
import { Locality, OpioidMetrics } from '@/app/types/locality';
import { PortableText } from 'next-sanity';
import topojson from 'topojson-client';
import { getValidKeyOrDefault } from '@/app/client-utils';
import DataTableDescription, { DataTableColumn, DataTableRow } from '@/app/components/blocks/DataTableDescription';
import SourcesAccordion from './SourcesAccordion';

// Define the ChoroplethMap props type to match what we'll pass to the dynamic component
interface ChoroplethMapProps {
  indicator: CostsMapIndicator;
  displayType: DisplayType;
  selectedLocality: Locality | null;
  localities: Locality[];
  colors: string[];
  strokeColor: string;
  totalValue: number;
  onLocalityClick?: (locality: Locality) => void;
  onResetToVirginia?: () => void;
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
  {
    name: "Total", colors: ["#EBD2E6", "#B378B4", "#97459A", "#4C1C54"] },
  { name: "Labor", colors: ["#D0E4F6", "#94C5E2", "#4783B5", "#1A4F72"] },
  { name: "HealthCare", colors: ["#F3F0C5", "#ECE089", "#C4B664", "#5B531E"] },
  { name: "Crime_Other", colors: ["#D4ECE7", "#7DC5B8", "#439788", "#1E4D46"] },
  { name: "Household", colors: ["#F9D1DB", "#F27BA5", "#DB4577", "#6E1634"] }
];

// Stroke colors for each indicator
const strokeColors = [
  { name: "Total", strokeColor: "#6C5172" },
  { name: "Labor", strokeColor: "#5D99C1" },
  { name: "HealthCare", strokeColor: "#998E56" },
  { name: "Crime_Other", strokeColor: "#3F8779" },
  { name: "Household", strokeColor: "#863C59" }
];

// Mapping between tab names and corresponding display names
const tabIndicatorMapping = {
  'Total': 'Total',
  'Labor': 'Lost Labor',
  'HealthCare': 'Health Care',
  'Crime_Other': 'Criminal Justice',
  'Household': 'Child Services & K-12',
};

// Mapping between SectorSelector sectors and CostsMaps tabs
const sectorToTabMapping: Record<string, CostsMapIndicator> = {
  'All Sectors': 'Total',
  'Lost Labor': 'Labor',
  'Health Care': 'HealthCare',
  'Child Services & K-12': 'Household',
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
  const safeMarginTop = getValidKeyOrDefault(marginTop, marginMap, 'none')
  const safeMarginBottom = getValidKeyOrDefault(marginBottom, marginBottomMap, 'none')

  function getColorsByIndicator(indicator: CostsMapIndicator) {
    const scheme = colorSchemes.find(scheme => scheme.name === indicator);
    return scheme ? scheme.colors : colorSchemes[0].colors;
  }

  function getStrokeColorByIndicator(indicator: CostsMapIndicator) {
    const strokeScheme = strokeColors.find(scheme => scheme.name === indicator);
    return strokeScheme ? strokeScheme.strokeColor : strokeColors[0].strokeColor;
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

  // Handle reset to Virginia Total
  const handleResetToVirginia = () => {
    console.log('CostsMaps: Resetting to Virginia Total');
    if (localities) {
      // Find Virginia Total in the localities array
      const virginia = localities.find(loc => 
        loc.counties === 'Virginia Total' || 
        loc.fips === 'us-va-999' ||
        loc.marcCountyId === '999'
      );
      if (virginia) {
        console.log('Found Virginia Total locality:', virginia);
        setSelectedLocality(virginia);
      } else {
        console.log('Virginia Total locality not found, setting to null');
        setSelectedLocality(null);
      }
    } else {
      console.log('No localities available, setting to null');
      setSelectedLocality(null);
    }
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

  // Get the sources for the current tab
  const getCurrentSources = () => {
    switch (indicatorTab) {
      case 'Total':
        return block.totalSources;
      case 'Labor':
        return block.laborSources;
      case 'HealthCare':
        return block.healthcareSources;
      case 'Crime_Other':
        return block.crimeOtherSources;
      case 'Household':
        return block.householdSources;
      default:
        return null;
    }
  };

  // Get field name for the current indicator
  const getFieldName = (indicator: CostsMapIndicator) => {
    let fieldName = indicator.toLowerCase();
    if (fieldName === 'crime_other') {
      fieldName = 'crimeOther';
    }
    if (fieldName === 'healthcare') {
      fieldName = 'healthcare';
    }
    return fieldName;
  };

  // Prepare data for the DataTableDescription
  const prepareTableData = (): DataTableRow[] => {
    if (!localities || localities.length === 0) return [];

    const fieldName = getFieldName(indicatorTab);
    const totalField = `${fieldName}Total` as keyof OpioidMetrics;
    const perCapitaField = `${fieldName}PerCapita` as keyof OpioidMetrics;

    // Filter out Virginia Total and map the remaining localities
    return localities
      .filter(locality => 
        locality.counties !== 'Virginia Total' && 
        locality.fips !== 'us-va-999' && 
        locality.marcCountyId !== '999'
      )
      .map(locality => {
        const totalValueRaw = locality.opioidMetrics?.[totalField];
        const perCapitaValueRaw = locality.opioidMetrics?.[perCapitaField];
        
        const totalValue = typeof totalValueRaw === 'number' ? totalValueRaw : 0;
        const perCapitaValue = typeof perCapitaValueRaw === 'number' ? perCapitaValueRaw : 0;

        return {
          id: locality._id, // Add id for highlighting
          locality: locality.counties || 'Unknown',
          total: totalValue,
          perCapita: perCapitaValue,
        };
      });
  };

  // Define columns for the data table
  const tableColumns: DataTableColumn[] = [
    { key: 'locality', label: 'Locality', align: 'left', format: 'text' },
    { key: 'total', label: 'Total Cost', align: 'right', format: 'currency' },
    { key: 'perCapita', label: 'Per Capita Cost', align: 'right', format: 'currency' },
  ];

  // Don't render until mounted on the client
  if (!mounted) {
    return (
      <div className={`${marginMap[safeMarginTop as keyof typeof marginMap]} ${marginBottomMap[safeMarginBottom as keyof typeof marginBottomMap]}`}>
        <div className="relative mx-auto p-4">
          <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center">
            <p>Loading map...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${marginMap[safeMarginTop as keyof typeof marginMap]} ${marginBottomMap[safeMarginBottom as keyof typeof marginBottomMap]}`}>

      <div className="relative mx-auto max-w-[1200px]">
        {/* Map Container */}
        <div className="p-4">
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
              strokeColor={getStrokeColorByIndicator(indicatorTab)}
              totalValue={calculateTotal(`${indicatorTab}`)}
              onLocalityClick={handleLocalityClick}
              onResetToVirginia={handleResetToVirginia}
            />
          </div>

          {/* DataTableDescription for the current sector */}
          {getCurrentDescription() && (
            <div className="px-24 mt-4">
              <DataTableDescription
                title="Map Description/Data Table"
                description={getCurrentDescription() || undefined}
                columns={tableColumns}
                data={prepareTableData()}
                backgroundColor="bg-transparent"
                highlightRowId={selectedLocality?._id}
              />
            </div>
          )}

          {/* SourcesAccordion for the current sector */}
          {getCurrentSources() && (
            <div className="px-24 mt-0">
              <SourcesAccordion
                title="Sources"
                sources={getCurrentSources() || undefined}
                backgroundColor="bg-transparent"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 