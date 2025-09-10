"use client"

import { PortableText } from '@portabletext/react'
import imageUrlBuilder from '@sanity/image-url'
import { client } from '@/sanity/lib/client'
import { useEffect, useState } from 'react'
import { TextContentProps } from '@/app/types/locality'
import DefinitionPopup from '@/app/components/DefinitionPopup'
import Image from 'next/image'
import { useSector } from '@/app/contexts/SectorContext'

const urlForImage = (source: any) => {
  return imageUrlBuilder(client).image(source)
}

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

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj)
}

// Function to clean corrupted string values by removing invisible Unicode characters
const cleanString = (str: string | undefined): string | undefined => {
  if (typeof str !== 'string') return str
  // Remove invisible Unicode characters that might be causing corruption
  return str.replace(/[\u200B-\u200D\uFEFF\u2060-\u2064\u206A-\u206F]/g, '').trim()
}

export default function TextContent({ block, selectedLocality }: TextContentProps) {
  const { selectedSector } = useSector();
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

  // Clean corrupted string values
  const cleanMarginTop = cleanString(marginTop)
  const cleanMarginBottom = cleanString(marginBottom)
  const cleanTextAlignment = cleanString(textAlignment)
  const cleanBackgroundColor = cleanString(backgroundColor)

  // Validate and sanitize backgroundColor
  const finalBackgroundColor = cleanBackgroundColor === 'custom' && customBackgroundColor 
    ? (typeof customBackgroundColor === 'string' && customBackgroundColor.match(/^#[0-9A-Fa-f]{6}$/) ? customBackgroundColor : 'transparent')
    : (cleanBackgroundColor === 'transparent' ? 'transparent' : (typeof cleanBackgroundColor === 'string' && cleanBackgroundColor.match(/^#[0-9A-Fa-f]{6}$/) ? cleanBackgroundColor : 'transparent'))
  
  // Validate margin values to prevent undefined classes
  const validMarginTop = cleanMarginTop && marginMap[cleanMarginTop as keyof typeof marginMap] ? cleanMarginTop : 'none'
  const validMarginBottom = cleanMarginBottom && marginBottomMap[cleanMarginBottom as keyof typeof marginBottomMap] ? cleanMarginBottom : 'none'
  
  // Validate text alignment to prevent undefined classes
  const validTextAlignment = cleanTextAlignment && alignmentMap[cleanTextAlignment as keyof typeof alignmentMap] ? cleanTextAlignment : 'left'
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

  console.log('TextContent block:', { marginTop, marginBottom, textAlignment, backgroundColor, customBackgroundColor, maxWidth })
  console.log('TextContent sector context:', { selectedSector })
  console.log('Cleaned values:', { 
    cleanMarginTop, 
    cleanMarginBottom, 
    cleanTextAlignment,
    cleanBackgroundColor
  })
  console.log('Margin classes:', { 
    topClass: marginMap[validMarginTop as keyof typeof marginMap], 
    bottomClass: marginBottomMap[validMarginBottom as keyof typeof marginBottomMap] 
  })
  console.log('Text alignment:', { 
    original: textAlignment, 
    cleaned: cleanTextAlignment,
    valid: validTextAlignment, 
    class: alignmentMap[validTextAlignment as keyof typeof alignmentMap] 
  })
  
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
              smallGrayText: ({ children }) => (
                <span style={{
                  color: '#747474',
                  fontFamily: 'Inter',
                  fontSize: '14px',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  lineHeight: '130%',
                  letterSpacing: '-0.266px',
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
                if (!selectedLocality || !value.fieldPath) {
                  return children
                }
                const fieldValue = getNestedValue(selectedLocality, value.fieldPath)
                if (fieldValue === undefined) {
                  return children
                }

                // Format the value based on the field type
                let displayValue = fieldValue
                if (typeof fieldValue === 'number') {
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

                return (
                  <span className={`${isUpdating ? 'animate-pulse' : ''}`}>
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
                    className="text-blue-600 hover:text-blue-800 underline text-sm font-medium align-super cursor-pointer"
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