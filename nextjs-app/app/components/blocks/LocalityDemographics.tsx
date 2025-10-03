"use client"

import { useLocality } from '@/app/contexts/LocalityContext'
import { LocalityDemographicsProps } from '@/app/types/locality'
import { cleanStringDraftSafe, getValidKeyOrDefault, getValidHexColorOrDefault } from '@/app/client-utils'

const marginMap = {
  none: 'mt-0',
  small: 'mt-[20px]',
  medium: 'mt-[30px]',
  large: 'mt-[60px]',
}

const marginBottomMap = {
  none: 'mb-0',
  small: 'mb-[20px]',
  medium: 'mb-[30px]',
  large: 'mb-[60px]',
}

const alignmentMap = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

export default function LocalityDemographics({ block }: LocalityDemographicsProps) {
  const { selectedLocality } = useLocality()
  
  // Get localities from context for state-level aggregation
  const localities = useLocality() // This won't work, we need to pass localities as props
  
  const {
    sectionId,
    marginTop = 'none', 
    marginBottom = 'none', 
    textAlignment = 'left',
    backgroundColor = 'transparent',
    customBackgroundColor,
    maxWidth
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

  // Calculate cases per 100k
  const calculateCasesPer100k = () => {
    const population = parseNumber(selectedLocality?.demographics?.totalPopulation)
    const cases = parseNumber(selectedLocality?.opioidCases?.oudCases2023)
    
    if (!population || !cases) {
      return null
    }
    
    return Math.round((cases / population) * 100000)
  }

  const casesPer100k = calculateCasesPer100k()

  // Get data from selectedLocality and parse numbers
  const totalPopulation = parseNumber(selectedLocality?.demographics?.totalPopulation)
  const oudCases2023 = parseNumber(selectedLocality?.opioidCases?.oudCases2023)
  const oudDeaths2023 = parseNumber(selectedLocality?.opioidCases?.oudDeaths2023)


  // Format numbers with commas
  const formatNumber = (num: number | null | undefined) => {
    if (num === null || num === undefined) return 'N/A'
    return num.toLocaleString()
  }

  return (
    <div className={`${marginMap[validMarginTop as keyof typeof marginMap]} ${marginBottomMap[validMarginBottom as keyof typeof marginBottomMap]}`}>
      <div 
        id={sectionId}
        className={`content-container ${alignmentMap[validTextAlignment as keyof typeof alignmentMap]} ${finalBackgroundColor !== 'transparent' ? 'p-[20px_15px]' : ''}`} 
        style={{
          ...(finalBackgroundColor !== 'transparent' ? { backgroundColor: finalBackgroundColor } : {}),
          ...(maxWidth ? { maxWidth: `${maxWidth}px`, marginLeft: 'auto', marginRight: 'auto' } : {})
        }}
      >
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-4 lg:gap-4">
          {/* Population */}
          <div className="flex items-center gap-1">
            <div 
              style={{
                color: '#414141',
                fontFamily: 'Inter',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '150%',
                letterSpacing: '-0.266px',
              }}
                >
                  {formatNumber(totalPopulation)}
                </div>
            <div 
              style={{
                color: '#414141',
                fontFamily: 'Inter',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '150%',
                letterSpacing: '-0.266px',
              }}
            >
              Population
            </div>
          </div>

          {/* Opioid Fatalities */}
          <div className="flex items-center gap-1">
            <div 
              style={{
                color: '#414141',
                fontFamily: 'Inter',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '150%',
                letterSpacing: '-0.266px',
              }}
                >
                  {formatNumber(oudDeaths2023)}
                </div>
            <div 
              style={{
                color: '#414141',
                fontFamily: 'Inter',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '150%',
                letterSpacing: '-0.266px',
              }}
            >
              Opioid Fatalities
            </div>
          </div>

          {/* Persons with UOU */}
          <div className="flex items-center gap-1">
            <div 
              style={{
                color: '#414141',
                fontFamily: 'Inter',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '150%',
                letterSpacing: '-0.266px',
              }}
                >
                  {formatNumber(oudCases2023)}
                </div>
            <div 
              style={{
                color: '#414141',
                fontFamily: 'Inter',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '150%',
                letterSpacing: '-0.266px',
              }}
            >
              Persons with UOU
            </div>
          </div>

          {/* UOU Cases per 100k */}
          <div className="flex items-center gap-1">
            <div 
              style={{
                color: '#414141',
                fontFamily: 'Inter',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '150%',
                letterSpacing: '-0.266px',
              }}
            >
              {casesPer100k !== null ? formatNumber(casesPer100k) : 'N/A'}
            </div>
            <div 
              style={{
                color: '#414141',
                fontFamily: 'Inter',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 400,
                lineHeight: '150%',
                letterSpacing: '-0.266px',
              }}
            >
              UOU Cases per 100k
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
