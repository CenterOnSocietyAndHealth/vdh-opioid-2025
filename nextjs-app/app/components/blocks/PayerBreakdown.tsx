import React from 'react';
import { PayerBreakdownProps } from '@/app/types/locality';

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
    marginBottom = 'medium'
  } = block;
  
  // Calculate total and percentages
  const totalValue = familiesBusinessesValue + federalValue + stateLocalValue;
  const familiesBusinessesPercent = (familiesBusinessesValue / totalValue) * 100;
  const federalPercent = (federalValue / totalValue) * 100;
  const stateLocalPercent = (stateLocalValue / totalValue) * 100;
  const governmentPercent = federalPercent + stateLocalPercent;
  
  return (
    <div className={`max-w-[1311px] mx-auto ${marginMap[marginTop]} ${marginBottomMap[marginBottom]}`}>
      {/* Header */}
      <div className="text-center mb-12 max-w-[600px] mx-auto">
        <h2 className="text-2xl font-normal mb-2">{title}</h2>
              <h3 className="text-lg text-[#1E1E1E]">{subtitle}</h3>
      </div>
      
      {/* Main Chart */}
      <div className="w-full mb-4">
                  {/* Chart Container */}
          <div className="relative w-full h-[90px] bg-gray-200">
          {/* Government Label and Bracket - positioned above the chart */}

          
          {/* Government bracket lines - positioned above the chart */}
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
                      className="absolute -top-10 left-0 h-8 flex items-center justify-center text-[#1E1E1E] font-medium text-[18px] px-2 rounded"
                style={{
                    left: `${familiesBusinessesPercent}%`,
                    width: `${governmentPercent}%`,
                }}
            >
                <div className=" bg-white w-fit px-2">
                Government
                </div>
                
            </div>
          
          {/* Families & Businesses Segment */}
          <div 
            className="absolute top-0 left-0 h-full flex items-center"
            style={{
              width: `${familiesBusinessesPercent}%`,
              backgroundColor: familiesBusinessesColor,
            }}
          >
            <div className="ml-4 text-left">
              <div 
                className="font-bold"
                style={{
                  fontFamily: 'Inter',
                  fontSize: '18px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: 'normal',
                  color: familiesBusinessesTextColor,
                }}
              >
                {familiesBusinessesPercent.toFixed(1)}% ({formatCostShort(familiesBusinessesValue)})
              </div>
              <div 
                style={{
                  fontFamily: 'Inter',
                  fontSize: '18px',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  lineHeight: '130%',
                  letterSpacing: '-0.342px',
                  color: familiesBusinessesTextColor,
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
              backgroundColor: federalColor,
            }}
          >
            <div className="ml-4 text-left">
              <div 
                className="font-bold"
                style={{
                  fontFamily: 'Inter',
                  fontSize: '18px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: 'normal',
                  color: federalTextColor,
                }}
              >
                {federalPercent.toFixed(1)}% ({formatCostShort(federalValue)})
              </div>
              <div 
                style={{
                  fontFamily: 'Inter',
                  fontSize: '18px',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  lineHeight: '130%',
                  letterSpacing: '-0.342px',
                  color: federalTextColor,
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
              backgroundColor: stateLocalColor,
            }}
          >
            <div className="ml-4 text-left">
              <div 
                className="font-bold"
                style={{
                  fontFamily: 'Inter',
                  fontSize: '18px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: 'normal',
                  color: stateLocalTextColor,
                }}
              >
                {stateLocalPercent.toFixed(1)}% ({formatCostShort(stateLocalValue)})
              </div>
              <div 
                style={{
                  fontFamily: 'Inter',
                  fontSize: '18px',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  lineHeight: '130%',
                  letterSpacing: '-0.342px',
                  color: stateLocalTextColor,
                }}
              >
                State/Local
              </div>
            </div>
          </div>
        </div>
        
        
      </div>
      
      {/* Data Table/Chart Description */}
      <details className="mb-4">
        <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
          Data table/Chart description
          <svg className="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="mt-2 p-4 bg-gray-50 rounded">
          <p className="text-sm text-gray-700">
            This chart shows the breakdown of opioid epidemic costs by payer type in Virginia for 2023. 
            The data represents the financial burden distributed across different sectors of society.
          </p>
        </div>
      </details>
      
      {/* Sources */}
      <details className="mb-4">
        <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
          Sources: CDC Data and other sources
          <svg className="inline w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="mt-2 p-4 bg-gray-50 rounded">
          <p className="text-sm text-gray-700">
            Data compiled from Centers for Disease Control and Prevention (CDC) reports, 
            state health department records, and economic impact studies.
          </p>
        </div>
      </details>
    </div>
  );
}
