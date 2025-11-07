"use client"

import { useLocality } from '@/app/contexts/LocalityContext'
import { cleanStringDraftSafe, getValidKeyOrDefault, getValidHexColorOrDefault } from '@/app/client-utils'
import { PovertyIncomeProps } from '@/app/types/locality'

const marginMap = {
  none: 'mt-0',
  small: 'mt-[20px]',
  medium: 'mt-[40px]',
  large: 'mt-[60px]',
}

const marginBottomMap = {
  none: 'mb-0',
  small: 'mb-[20px]',
  medium: 'mb-[40px]',
  large: 'mb-[60px]',
}

const alignmentMap = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}


export default function PovertyIncome({ block, selectedLocality: propSelectedLocality, localities, pageId, pageType, path }: PovertyIncomeProps & { 
  selectedLocality?: any; 
  localities?: any[]; 
  pageId?: string; 
  pageType?: string; 
  path?: string; 
}) {
  const { selectedLocality: contextSelectedLocality } = useLocality()
  
  // Use prop selectedLocality if available (from ContentWrapper), otherwise use context
  const selectedLocality = propSelectedLocality || contextSelectedLocality
  
  const {
    sectionId,
    marginTop = 'none', 
    marginBottom = 'none', 
    textAlignment = 'left',
    backgroundColor = 'transparent',
    customBackgroundColor,
    maxWidth,
    povertySource = 15,
    medianIncomeSource = 16,
    statePovertyPct = 9.4,
    stateMedianIncome = 91000
  } = block

  // Draft-safe cleaning
  const cleanBG = cleanStringDraftSafe(backgroundColor)
  const cleanCustomBG = cleanStringDraftSafe(customBackgroundColor)

  // Validate and sanitize backgroundColor
  const finalBackgroundColor = cleanBG === 'custom' && cleanCustomBG 
    ? getValidHexColorOrDefault(cleanCustomBG, 'transparent')
    : (cleanBG === 'transparent' ? 'transparent' : getValidHexColorOrDefault(cleanBG, 'transparent'))
  
  // Validate margin values to prevent undefined classes
  const validMarginTop = getValidKeyOrDefault(marginTop, marginMap, 'none')
  const validMarginBottom = getValidKeyOrDefault(marginBottom, marginBottomMap, 'none')
  
  // Validate text alignment to prevent undefined classes
  const validTextAlignment = getValidKeyOrDefault(textAlignment, alignmentMap, 'left')

  // Helper function to parse numbers that might have comma separators
  const parseNumber = (value: number | string | null | undefined): number | null => {
    if (value === null || value === undefined) return null
    if (typeof value === 'number') return value
    if (typeof value === 'string') {
      // Remove commas and parse as number
      const cleaned = value.replace(/,/g, '')
      const parsed = parseFloat(cleaned)
      return isNaN(parsed) ? null : parsed
    }
    return null
  }

  // Get data from selectedLocality and parse numbers
  const povertyPct = parseNumber(selectedLocality?.demographics?.povertyPct)
  const medianIncome = parseNumber(selectedLocality?.demographics?.medianIncome)
  
  // Calculate comparison percentages
  const calculateComparison = (localValue: number | null, stateValue: number) => {
    if (!localValue) return null
    
    const difference = ((localValue - stateValue) / stateValue) * 100
    return {
      percentage: Math.round(Math.abs(difference)),
      isHigher: difference > 0
    }
  }

  const povertyComparison = calculateComparison(povertyPct, statePovertyPct)
  const incomeComparison = calculateComparison(medianIncome, stateMedianIncome)

  // Check if this is Virginia state or no locality selected
  const isVirginia = !selectedLocality || 
    selectedLocality.counties === 'Virginia Total' || 
    selectedLocality.fips === 'us-va-999' ||
    selectedLocality.marcCountyId === '999'

  // Format income for display (convert to K)
  const formatIncome = (income: number | null) => {
    if (income === null) return 'N/A'
    return `$${Math.round(income / 1000)}K`
  }

  // Format poverty percentage
  const formatPoverty = (poverty: number | null) => {
    if (poverty === null) return 'N/A'
    return `${poverty}%`
  }

  // Render superscript source link
  const renderSourceLink = (sourceNumber: number) => {
    return (
      <sup
        style={{
          fontSize: '0.75em',
          verticalAlign: 'super',
          lineHeight: 0,
          position: 'relative',
          marginLeft: '2px',
        }}
      >
        <a 
          href={`#source-${sourceNumber.toString().padStart(2, '0')}`}
          className="text-blue-600 hover:text-blue-800 underline"
          tabIndex={0}
          style={{
            color: '#1E1E1E',
            fontFamily: 'Inter',
            fontStyle: 'normal',
            fontWeight: 400,
            letterSpacing: '-0.304px',
          }}
        >
          {sourceNumber}
        </a>
      </sup>
    )
  }

  return (
    <div className={`px-16 md:px-0 ${marginMap[validMarginTop as keyof typeof marginMap]} ${marginBottomMap[validMarginBottom as keyof typeof marginBottomMap]}`}>
      <div 
        id={sectionId}
        className={`content-container ${alignmentMap[validTextAlignment as keyof typeof alignmentMap]} ${finalBackgroundColor !== 'transparent' ? 'p-[20px_15px]' : ''}`} 
        style={{
          ...(finalBackgroundColor !== 'transparent' ? { backgroundColor: finalBackgroundColor } : {}),
          ...(maxWidth ? { maxWidth: `${maxWidth}px`, marginLeft: 'auto', marginRight: 'auto' } : {})
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Left Column - Poverty Rate */}
          <div className="space-y-2">
            {/* Poverty Value */}
            <div 
              style={{
                color: '#000',
                textAlign: 'center',
                fontFamily: 'Inter',
                fontSize: '48px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '100%',
              }}
            >
              {isVirginia ? `${statePovertyPct}%` : formatPoverty(povertyPct)}
            </div>
            
            {/* Poverty Label */}
            <div 
              style={{
                color: '#000',
                textAlign: 'center',
                fontFamily: 'Inter',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '150%',
              }}
            >
              Poverty Rate
            </div>
            
            {/* Poverty Comparison */}
            <div 
              className="text-center"
              style={{
                color: '#1E1E1E',
                fontFamily: 'Inter',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '150%',
                letterSpacing: '-0.304px',
              }}
            >
              {isVirginia ? (
                <>At {statePovertyPct}%, Virginia&apos;s poverty rate is 19% lower than the national average.{renderSourceLink(povertySource)}</>
              ) : povertyPct && povertyComparison ? (
                <>
                  At {formatPoverty(povertyPct)}, {selectedLocality?.counties} has a {povertyComparison.percentage}% {povertyComparison.isHigher ? 'higher' : 'lower'} poverty rate than the average Virginia community.{renderSourceLink(povertySource)}
                </>
              ) : (
                <>Data not available</>
              )}
            </div>
          </div>

          {/* Right Column - Median Income */}
          <div className="space-y-2">
            {/* Income Value */}
            <div 
              style={{
                color: '#000',
                textAlign: 'center',
                fontFamily: 'Inter',
                fontSize: '48px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '100%',
              }}
            >
              {isVirginia ? `$${Math.round(stateMedianIncome / 1000)}K` : formatIncome(medianIncome)}
            </div>
            
            {/* Income Label */}
            <div 
              style={{
                color: '#000',
                textAlign: 'center',
                fontFamily: 'Inter',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '150%',
              }}
            >
              Median Household Income
            </div>
            
            {/* Income Comparison */}
            <div 
              className="text-center"
              style={{
                color: '#1E1E1E',
                fontFamily: 'Inter',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '150%',
                letterSpacing: '-0.304px',
              }}
            >
              {isVirginia ? (
                <>At ${Math.round(stateMedianIncome / 1000)}K, Virginia&apos;s median household income is 16% higher than the national average.{renderSourceLink(medianIncomeSource)}</>
              ) : medianIncome && incomeComparison ? (
                <>
                  At {formatIncome(medianIncome)}, {selectedLocality?.counties}&apos;s median household income is {incomeComparison.percentage}% {incomeComparison.isHigher ? 'higher' : 'lower'} than the state median.{renderSourceLink(medianIncomeSource)}
                </>
              ) : (
                <>Data not available</>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
