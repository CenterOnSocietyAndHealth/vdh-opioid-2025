"use client"

import { PortableText } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { client } from '@/sanity/lib/client'
import { useEffect, useState } from 'react'
import { TextContentProps, Locality } from '@/app/types/locality'
import DefinitionPopup from '@/app/components/DefinitionPopup'
import Image from 'next/image'
import { useSector } from '@/app/contexts/SectorContext'
import { useLocality } from '@/app/contexts/LocalityContext'
import { getValidKeyOrDefault, getValidHexColorOrDefault, findVirginiaLocality } from '@/app/client-utils'
import ResolvedLink from '@/app/components/ResolvedLink'

const urlForImage = (source: any) => {
  return imageUrlBuilder(client).image(source)
}

const marginMap = {
  none: 'mt-0',
  small: 'mt-[10px]',
  medium: 'mt-[30px]',
  large: 'mt-[60px]',
}

const marginBottomMap = {
  none: 'mb-0',
  small: 'mb-[10px]',
  medium: 'mb-[30px]',
  large: 'mb-[60px]',
}

const alignmentMap = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => {
    if (acc === null || acc === undefined) return undefined;
    return acc[part];
  }, obj)
}


export default function TextContent({ block, selectedLocality: propSelectedLocality, localities }: TextContentProps & { localities?: Locality[] }) {
  const { selectedSector } = useSector();
  const { selectedLocality: contextSelectedLocality } = useLocality();
  
  // Use context selectedLocality if available, otherwise fall back to prop
  const selectedLocality = contextSelectedLocality || propSelectedLocality;
  const { 
    content, 
    sectionId,
    marginTop = 'none', 
    marginBottom = 'none', 
    textAlignment = 'left',
    backgroundColor = 'transparent',
    customBackgroundColor,
    maxWidth
  } = block

  // Validate and sanitize backgroundColor
  const finalBackgroundColor = backgroundColor === 'custom' && customBackgroundColor 
    ? getValidHexColorOrDefault(customBackgroundColor, 'transparent')
    : (backgroundColor === 'transparent' ? 'transparent' : getValidHexColorOrDefault(backgroundColor, 'transparent'))
  
  // Validate margin values to prevent undefined classes
  const validMarginTop = getValidKeyOrDefault(marginTop, marginMap, 'none')
  const validMarginBottom = getValidKeyOrDefault(marginBottom, marginBottomMap, 'none')
  
  // Validate text alignment to prevent undefined classes
  const validTextAlignment = getValidKeyOrDefault(textAlignment, alignmentMap, 'left')
  const [isUpdating, setIsUpdating] = useState(false)

  // Listen for locality updates
  useEffect(() => {
    const handleUpdateStart = () => setIsUpdating(true)
    const handleUpdateEnd = () => setIsUpdating(false)

    window.addEventListener('localityUpdateStart', handleUpdateStart)
    window.addEventListener('localityUpdateEnd', handleUpdateEnd)

    return () => {
      window.removeEventListener('localityUpdateStart', handleUpdateStart)
      window.removeEventListener('localityUpdateEnd', handleUpdateEnd)
    }
  }, [])
  
  return (
    <div className={`${marginMap[validMarginTop as keyof typeof marginMap]} ${marginBottomMap[validMarginBottom as keyof typeof marginBottomMap]}`}>
      <div 
        id={sectionId}
        tabIndex={sectionId ? -1 : undefined}
        className={`content-container px-4 md:px-0 ${alignmentMap[validTextAlignment as keyof typeof alignmentMap]} ${finalBackgroundColor !== 'transparent' ? 'p-[20px_15px]' : ''}`} 
        style={{
          ...(finalBackgroundColor !== 'transparent' ? { backgroundColor: finalBackgroundColor } : {}),
          ...(maxWidth ? { maxWidth: `${maxWidth}px`, marginLeft: 'auto', marginRight: 'auto' } : {})
        }}
      >
        <PortableText
          value={content}
          components={{
            types: {
              image: ({ value }) => {
                if (!value?.asset?._ref) {
                  return null
                }
                return (
                  <Image
                    src={urlForImage(value).url()}
                    alt={value.alt || ' '}
                    width={800}
                    height={600}
                    style={{ width: 'auto', height: 'auto' }}
                    priority={false}
                  />
                )
              },
            },
            block: {
              largeValue: ({ children }) => (
                <div style={{
                  fontFamily: 'Inter',
                  fontSize: '48px',
                  fontStyle: 'normal',
                  fontWeight: 700,
                  lineHeight: '150%',
                }}>
                  {children}
                </div>
              ),
              quote: ({ children }) => (
                <div style={{
                  color: '#1E1E1E',
                  textAlign: 'center',
                  fontFamily: 'Merriweather',
                  fontSize: '20px',
                  fontStyle: 'normal',
                  fontWeight: 300,
                  lineHeight: '30px',
                }}>
                  {children}
                </div>
              ),
            },
            marks: {
              link: ({ children, value: link }) => {
                return <ResolvedLink link={link} tabIndex={0}>{children}</ResolvedLink>;
              },
              smallGrayText: ({ children }) => (
                <span style={{
                  color: '#747474',
                  fontFamily: 'Inter',
                  fontSize: '12px',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '130%',
                  letterSpacing: '-0.228px',
                }}>
                  {children}
                </span>
              ),
              asteriskText: ({ children }) => (
                <span style={{
                  color: '#414141',
                  textAlign: 'center',
                  fontFamily: 'Inter',
                  fontSize: '14px',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  lineHeight: '110%',
                }}>
                  {children}
                </span>
              ),
              definition: ({ children, value }) => {
                try {
                  if (!value?.term || !value?.definition) {
                    return children
                  }
                  
                  return (
                    <DefinitionPopup 
                      term={value.term} 
                      definition={value.definition}
                    >
                      {children}
                    </DefinitionPopup>
                  )
                } catch (error) {
                  console.warn('Error rendering definition:', error)
                  return children
                }
              },
              localityField: ({ children, value }) => {
                if (!value.fieldPath) {
                  return children
                }
                
                let fieldValue;
                
                if (selectedLocality) {
                  // Use selected locality value
                  fieldValue = getNestedValue(selectedLocality, value.fieldPath)
                  
                  // Special handling for counties field to trim trailing spaces
                  if (value.fieldPath === 'counties' && typeof fieldValue === 'string') {
                    fieldValue = fieldValue.trim();
                  }
                } else if (localities && localities.length > 0) {
                  // Find Virginia data row when no locality is selected
                  const virginia = findVirginiaLocality(localities);
                  
                  if (virginia) {
                    fieldValue = getNestedValue(virginia, value.fieldPath)
                    
                    // Special handling for counties field to trim trailing spaces
                    if (value.fieldPath === 'counties' && typeof fieldValue === 'string') {
                      fieldValue = fieldValue.trim();
                    }
                  }
                }
                
                // If we still don't have a value, try to find Virginia data as fallback
                if (fieldValue === undefined && localities && localities.length > 0) {
                  const virginia = findVirginiaLocality(localities);
                  
                  if (virginia) {
                    fieldValue = getNestedValue(virginia, value.fieldPath)
                    
                    // Special handling for counties field to trim trailing spaces
                    if (value.fieldPath === 'counties' && typeof fieldValue === 'string') {
                      fieldValue = fieldValue.trim();
                    }
                  }
                }
                
                if (fieldValue === undefined) {
                  return children
                }

                // Format the value based on the field type
                let displayValue = fieldValue
                
                // Helper function to format numbers based on numberFormat option
                const formatNumber = (num: number, format: string, decimalPlaces: number = 2) => {
                  switch (format) {
                    case 'currency':
                      return `$${num.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                    case 'autoScale':
                      // Auto-determine scale (K/M/B) based on magnitude
                      if (Math.abs(num) >= 1000000000) {
                        return `${(num / 1000000000).toFixed(decimalPlaces)}B`
                      } else if (Math.abs(num) >= 1000000) {
                        return `${(num / 1000000).toFixed(decimalPlaces)}M`
                      } else if (Math.abs(num) >= 1000) {
                        return `${Math.round(num / 1000)}K`
                      } else {
                        return num.toFixed(decimalPlaces)
                      }
                    case 'autoScaleCurrency':
                      // Auto-determine scale with currency symbol
                      if (Math.abs(num) >= 1000000000) {
                        return `$${(num / 1000000000).toFixed(decimalPlaces)}B`
                      } else if (Math.abs(num) >= 1000000) {
                        return `$${(num / 1000000).toFixed(decimalPlaces)}M`
                      } else if (Math.abs(num) >= 1000) {
                        return `$${Math.round(num / 1000)}K`
                      } else {
                        return `$${num.toFixed(decimalPlaces)}`
                      }
                    case 'percentage':
                      return `${num.toFixed(decimalPlaces)}%`
                    case 'comma':
                      return num.toLocaleString()
                    case 'default':
                    default:
                      return num.toLocaleString()
                  }
                }
                
                // Handle both numbers and strings
                if (typeof fieldValue === 'number') {
                  // Use custom numberFormat if specified, otherwise use field-based defaults
                  if (value.numberFormat && value.numberFormat !== 'default') {
                    displayValue = formatNumber(fieldValue, value.numberFormat, value.decimalPlaces || 2)
                  } else {
                    // Default field-based formatting
                    if (value.fieldPath.includes('PerCapita')) {
                      displayValue = `$${fieldValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                    } else if (value.fieldPath.includes('Total')) {
                      displayValue = `$${fieldValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                    } else if (value.fieldPath.includes('Pct')) {
                      displayValue = `${fieldValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`
                    } else if (value.fieldPath.includes('Population')) {
                      displayValue = fieldValue.toLocaleString()
                    } else if (value.fieldPath.includes('Income')) {
                      displayValue = `$${fieldValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                    } else if (value.fieldPath.includes('Percentile')) {
                      displayValue = `${fieldValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`
                    } else if (value.fieldPath.includes('Comparison')) {
                      displayValue = `${fieldValue}`
                    } else {
                      displayValue = fieldValue.toLocaleString()
                    }
                  }
                } else if (typeof fieldValue === 'string') {
                  // Trim the field value to remove any trailing spaces (especially important for draft mode)
                  fieldValue = fieldValue.trim();
                  
                  // Handle string values - they might already be formatted
                  const numValue = parseFloat(fieldValue.replace(/[,$%]/g, ''))
                  
                  if (!isNaN(numValue)) {
                    // Use custom numberFormat if specified, otherwise use field-based defaults
                    if (value.numberFormat && value.numberFormat !== 'default') {
                      displayValue = formatNumber(numValue, value.numberFormat, value.decimalPlaces || 2)
                    } else {
                      // Default field-based formatting
                      if (value.fieldPath.includes('PerCapita')) {
                        displayValue = `$${numValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                      } else if (value.fieldPath.includes('Total')) {
                        displayValue = `$${numValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                      } else if (value.fieldPath.includes('Pct')) {
                        displayValue = `${numValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`
                      } else if (value.fieldPath.includes('Population')) {
                        displayValue = numValue.toLocaleString()
                      } else if (value.fieldPath.includes('Income')) {
                        displayValue = `$${numValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                      } else if (value.fieldPath.includes('Percentile')) {
                        displayValue = `${numValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`
                      } else if (value.fieldPath.includes('Comparison')) {
                        displayValue = fieldValue
                      } else {
                        displayValue = numValue.toLocaleString()
                      }
                    }
                  } else {
                    // If it's not a number, keep the original string
                    displayValue = fieldValue
                  }
                }

                // Transform text case if specified
                if (typeof displayValue === 'string' && value.textCase) {
                  switch (value.textCase) {
                    case 'capitalize':
                      displayValue = displayValue.split(' ').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                      ).join(' ')
                      break
                    case 'lowercase':
                      displayValue = displayValue.toLowerCase()
                      break
                  }
                }

                // Add article if requested
                if (value.addArticle && typeof displayValue === 'string') {
                  const firstChar = displayValue.toLowerCase().charAt(0)
                  const article = ['a', 'e', 'i', 'o', 'u'].includes(firstChar) ? 'an' : 'a'
                  displayValue = `${article} ${displayValue}`
                }

                // Make possessive if requested
                if (value.makePossessive && typeof displayValue === 'string') {
                  displayValue = `${displayValue.trim()}'s`
                }

                return (
                  <span className={`${isUpdating ? 'animate-pulse' : ''} ${value.bold ? 'font-bold' : ''}`}>
                    {isUpdating ? '...' : displayValue}
                  </span>
                )
              },
              citation: ({ children, value }) => {
                // Auto-generate citation ID from the selected text
                const selectedText = children?.toString() || ''
                const number = parseInt(selectedText, 10)
                
                // Generate citation ID based on the selected number
                const citationId = isNaN(number) ? 'source-01' : `source-${String(number).padStart(2, '0')}`
                
                const handleCitationClick = (e: React.MouseEvent) => {
                  e.preventDefault()
                  
                  // Set the hash to trigger the Sources accordion to open
                  window.location.hash = citationId
                  
                  // Find the Sources accordion and open it
                  const sourcesAccordion = document.querySelector('[data-sources-accordion]')
                  if (sourcesAccordion) {
                    // Trigger a custom event to open the accordion
                    const openEvent = new CustomEvent('openSourcesAccordion', { 
                      detail: { citationId } 
                    })
                    window.dispatchEvent(openEvent)
                  }
                  
                  // Scroll to the citation after a short delay
                  setTimeout(() => {
                    const element = document.querySelector(`#${citationId}`)
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    }
                  }, 400)
                }
                
                return (
                  <a
                    href={`#${citationId}`}
                    onClick={handleCitationClick}
                    tabIndex={0}
                    className="hover:bg-[#cfe6ef] underline text-sm font-medium align-super cursor-pointer"
                    title="View source"
                    style={{ fontSize: '0.75em', verticalAlign: 'super' }}
                  >
                    {children}
                  </a>
                )
              },
            },
          }}
        />
      </div>
    </div>
  )
} 