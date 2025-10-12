import React from 'react';
import { PayerBreakdownProps } from '@/app/types/locality';
import { getValidKeyOrDefault, getValidHexColorOrDefault } from '@/app/client-utils';
import DataTableDescription, { DataTableColumn, DataTableRow } from '@/app/components/blocks/DataTableDescription';
import SourcesAccordion from './SourcesAccordion';

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
    return `$${(value / 1_000_000_000).toPrecision(3)} Billion`;
  } else if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toPrecision(3)} Million`;
  } else if (value >= 1_000) {
    return `$${(value / 1_000).toPrecision(3)} Thousand`;
  }
  return `$${value}`;
}

// Helper to format cost values as $3.41B, $891M, etc. (short form)
function formatCostShort(value: number): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toPrecision(3)}B`;
  } else if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toPrecision(3)}M`;
  } else if (value >= 1_000) {
    return `$${(value / 1_000).toPrecision(3)}K`;
  }
  return `$${value}`;
}

export default function PayerBreakdown({ block }: PayerBreakdownProps) {
  const { 
    title, 
    subtitle, 
    familiesBusinessesValue,
    familiesBusinessesColor,
    familiesBusinessesTextColor,
    federalValue,
    federalColor,
    federalTextColor,
    stateLocalValue,
    stateLocalColor,
    stateLocalTextColor,
    marginTop = 'medium',
    marginBottom = 'medium',
    chartDescription,
    sources
  } = block;

  // Sanitize margin values using shared utilities
  const safeMarginTop = getValidKeyOrDefault(marginTop, marginMap, 'medium');
  const safeMarginBottom = getValidKeyOrDefault(marginBottom, marginBottomMap, 'medium');

  // Sanitize color values using shared utilities
  const safeFamiliesBusinessesColor = getValidHexColorOrDefault(familiesBusinessesColor, '#cccccc');
  const safeFamiliesBusinessesTextColor = getValidHexColorOrDefault(familiesBusinessesTextColor, '#1E1E1E');
  const safeFederalColor = getValidHexColorOrDefault(federalColor, '#cccccc');
  const safeFederalTextColor = getValidHexColorOrDefault(federalTextColor, '#1E1E1E');
  const safeStateLocalColor = getValidHexColorOrDefault(stateLocalColor, '#cccccc');
  const safeStateLocalTextColor = getValidHexColorOrDefault(stateLocalTextColor, '#1E1E1E');
  
  // Calculate total and percentages
  const totalValue = familiesBusinessesValue + federalValue + stateLocalValue;
  const familiesBusinessesPercent = (familiesBusinessesValue / totalValue) * 100;
  const federalPercent = (federalValue / totalValue) * 100;
  const stateLocalPercent = (stateLocalValue / totalValue) * 100;
  const governmentPercent = federalPercent + stateLocalPercent;

  // Prepare data for the DataTableDescription
  const prepareTableData = (): DataTableRow[] => {
    return [
      {
        payer: 'Families & Businesses',
        costs: familiesBusinessesValue,
        percentOfTotal: familiesBusinessesPercent.toFixed(1),
      },
      {
        payer: 'Federal',
        costs: federalValue,
        percentOfTotal: federalPercent.toFixed(1),
      },
      {
        payer: 'State/Local',
        costs: stateLocalValue,
        percentOfTotal: stateLocalPercent.toFixed(1),
      },
    ];
  };

  // Define columns for the data table
  const tableColumns: DataTableColumn[] = [
    { key: 'payer', label: 'Payer', align: 'left', format: 'text' },
    { key: 'costs', label: 'Costs', align: 'right', format: 'currency' },
    { key: 'percentOfTotal', label: 'Percent of Total', align: 'right', format: 'percentage' },
  ];
  
  return (
    <div className={`max-w-[1180px] mx-auto ${marginMap[safeMarginTop]} ${marginBottomMap[safeMarginBottom]}`}>
      {/* Header */}
      <div className="text-center mb-12 max-w-[600px] mx-auto">
        <h2 className="text-2xl font-normal mb-2">{title}</h2>
              <h3 className="text-lg text-[#1E1E1E]">{subtitle}</h3>
      </div>
      
      {/* Main Chart */}
      <div className="w-full mb-4">
        {/* Desktop Chart - Horizontal bars */}
        <div className="hidden md:block">
          <div className="relative w-full h-[90px] bg-gray-200">
            {/* Government Label and Bracket - positioned above the chart */}
            <div 
              className="absolute -top-6 left-0 h-6"
              style={{
                left: `${familiesBusinessesPercent}%`,
                width: `${governmentPercent}%`,
              }}
            >
              {/* Top horizontal line */}
              <div 
                className="absolute top-0 left-0 w-full h-[1px] bg-[#1E1E1E]"
                style={{ backgroundColor: '#1E1E1E' }}
              ></div>
              {/* Left vertical line */}
              <div 
                className="absolute top-0 left-0 w-[1px] h-4 bg-[#1E1E1E]"
                style={{ backgroundColor: '#1E1E1E' }}
              ></div>
              {/* Right vertical line */}
              <div 
                className="absolute top-0 right-0 w-[1px] h-4 bg-[#1E1E1E]"
                style={{ backgroundColor: '#1E1E1E' }}
              ></div>
            </div>

            <div
              className="absolute -top-10 left-0 h-8 flex items-center justify-center text-[#1E1E1E] font-medium text-[16px] px-2 rounded"
              style={{
                left: `${familiesBusinessesPercent}%`,
                width: `${governmentPercent}%`,
              }}
            >
              <div className="bg-white w-fit px-2">
                Government
              </div>
            </div>
            
            {/* Families & Businesses Segment */}
            <div 
              className="absolute top-0 left-0 h-full flex items-center"
              style={{
                width: `${familiesBusinessesPercent}%`,
                backgroundColor: safeFamiliesBusinessesColor,
              }}
            >
              <div className="ml-4 text-left">
                <div 
                  className="font-bold"
                  style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 700,
                    lineHeight: 'normal',
                    color: safeFamiliesBusinessesTextColor,
                  }}
                >
                  {familiesBusinessesPercent.toFixed(1)}% ({formatCostShort(familiesBusinessesValue)})
                </div>
                <div 
                  style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: '130%',
                    letterSpacing: '-0.342px',
                    color: safeFamiliesBusinessesTextColor,
                  }}
                >
                  Families & Businesses
                </div>
              </div>
            </div>
            
            {/* Federal Segment */}
            <div 
              className="absolute top-0 left-0 h-full flex items-center"
              style={{
                left: `${familiesBusinessesPercent}%`,
                width: `${federalPercent}%`,
                backgroundColor: safeFederalColor,
              }}
            >
              <div className="ml-4 text-left">
                <div 
                  className="font-bold"
                  style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 700,
                    lineHeight: 'normal',
                    color: safeFederalTextColor,
                  }}
                >
                  {federalPercent.toFixed(1)}% ({formatCostShort(federalValue)})
                </div>
                <div 
                  style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: '130%',
                    letterSpacing: '-0.342px',
                    color: safeFederalTextColor,
                  }}
                >
                  Federal
                </div>
              </div>
            </div>
            
            {/* State/Local Segment */}
            <div 
              className="absolute top-0 left-0 h-full flex items-center"
              style={{
                left: `${familiesBusinessesPercent + federalPercent}%`,
                width: `${stateLocalPercent}%`,
                backgroundColor: safeStateLocalColor,
              }}
            >
              <div className="ml-4 text-left">
                <div 
                  className="font-bold"
                  style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 700,
                    lineHeight: 'normal',
                    color: safeStateLocalTextColor,
                  }}
                >
                  {stateLocalPercent.toFixed(1)}% ({formatCostShort(stateLocalValue)})
                </div>
                <div 
                  style={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    lineHeight: '130%',
                    letterSpacing: '-0.342px',
                    color: safeStateLocalTextColor,
                  }}
                >
                  State/Local
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Chart - Vertical stacked bars */}
        <div className="block md:hidden">
          {/* Government Label */}
          <div className="relative mb-6">
            <div
              className="absolute top-[122px] left-0 h-8 flex items-center justify-center text-[#1E1E1E] font-medium text-[16px] px-2 rounded"
              style={{
                left: `50%`,
                width: `50%`,
              }}
            >
              <div className="bg-white w-fit px-2">
                Government
              </div>
            </div>
          </div>

          {/* Stacked bars with spacing and vertical bracket */}
          <div className="relative">
            {/* Vertical bracket line spanning Federal and State/Local bars */}
            <div 
              className="absolute top-[102px] w-[1px] bg-[#1E1E1E]"
              style={{
                left: `${familiesBusinessesPercent}%`,
                height: `calc(30px + 12px + 30px)`, // height of Federal bar + spacing + State/Local bar
                zIndex: 10,
              }}
            ></div>

            <div className="space-y-4">
              {/* Families & Businesses Bar */}
              <div className="w-full">
                <div 
                  className="w-full h-[30px]"
                  style={{
                    width: `${familiesBusinessesPercent}%`,
                    backgroundColor: safeFamiliesBusinessesColor,
                  }}
                ></div>
                <div className="mt-2 text-left">
                  <div 
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '16px',
                      fontStyle: 'normal',
                      lineHeight: '130%',
                      letterSpacing: '-0.342px',
                      color: '#1E1E1E',
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>Families & Businesses</span>   <span style={{ fontWeight: 400 }}>{familiesBusinessesPercent.toFixed(1)}% / {formatCostShort(familiesBusinessesValue)}</span>
                  </div>
                </div>
              </div>

              {/* Federal Bar */}
              <div className="w-full">
                <div 
                  className="w-full h-[30px]"
                  style={{
                    width: `${federalPercent}%`,
                    backgroundColor: safeFederalColor,
                  }}
                ></div>
                <div className="mt-2 text-left">
                  <div 
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '16px',
                      fontStyle: 'normal',
                      lineHeight: '130%',
                      letterSpacing: '-0.342px',
                      color: '#1E1E1E',
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>Federal</span>   <span style={{ fontWeight: 400 }}>{federalPercent.toFixed(1)}% / {formatCostShort(federalValue)}</span>
                  </div>
                </div>
              </div>

              {/* State/Local Bar */}
              <div className="w-full">
                <div 
                  className="w-full h-[30px]"
                  style={{
                    width: `${stateLocalPercent}%`,
                    backgroundColor: safeStateLocalColor,
                  }}
                ></div>
                <div className="mt-2 text-left">
                  <div 
                    style={{
                      fontFamily: 'Inter',
                      fontSize: '16px',
                      fontStyle: 'normal',
                      lineHeight: '130%',
                      letterSpacing: '-0.342px',
                      color: '#1E1E1E',
                    }}
                  >
                    <span style={{ fontWeight: 700 }}>State/Local</span>   <span style={{ fontWeight: 400 }}>{stateLocalPercent.toFixed(1)}% / {formatCostShort(stateLocalValue)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* DataTableDescription */}
      {chartDescription && (
        <div className="px-0 mt-4">
          <DataTableDescription
            title="Chart Description/Data Table"
            description={chartDescription}
            columns={tableColumns}
            data={prepareTableData()}
            backgroundColor="bg-transparent"
          />
        </div>
      )}

      {/* SourcesAccordion */}
      {sources && (
        <div className="px-0 mt-0">
          <SourcesAccordion
            title="Sources"
            sources={sources}
            backgroundColor="bg-transparent"
          />
        </div>
      )}

    </div>
  );
}
