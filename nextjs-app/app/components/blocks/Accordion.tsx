import { PortableText } from '@portabletext/react'
import { useState, useEffect } from 'react'
import { AccordionProps } from '@/app/types/locality'
import imageUrlBuilder from '@sanity/image-url'
import { client } from '@/sanity/lib/client'
import DefinitionPopup from '@/app/components/DefinitionPopup'
import Image from 'next/image'
import { useSector } from '@/app/contexts/SectorContext'
import { useLocality } from '@/app/contexts/LocalityContext'
import ResolvedLink from '@/app/components/ResolvedLink'

const marginMap = {
  none: 'mt-0',
  small: 'mt-4',
  medium: 'mt-8',
  large: 'mt-16',
}

const marginBottomMap = {
  none: 'mb-0',
  small: 'mb-4',
  medium: 'mb-8',
  large: 'mb-16',
}

const urlForImage = (source: any) => {
  return imageUrlBuilder(client).image(source)
}

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => {
    if (acc === null || acc === undefined) return undefined;
    return acc[part];
  }, obj)
}

export default function Accordion({ block }: AccordionProps) {
  const { title, content, headingLevel = 'span', marginTop = 'none', marginBottom = 'none' } = block
  const [isExpanded, setIsExpanded] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const { selectedSector } = useSector()
  const { selectedLocality } = useLocality()

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

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded)
  }

  const renderTitle = () => {
    const titleContent = <span className="font-[18px] font-medium">{title}</span>
    
    switch (headingLevel) {
      case 'h2':
        return <h2 className="font-medium text-black">{title}</h2>
      case 'h3':
        return <h3 className="font-medium text-black">{title}</h3>
      case 'h4':
        return <h4 className="font-medium text-black">{title}</h4>
      default:
        return titleContent
    }
  }

  return (
    <div className={`${marginMap[marginTop]} ${marginBottomMap[marginBottom]}`}>
      <div className="">
        {/* Accordion Header */}
        <button
          onClick={toggleAccordion}
          className="w-full px-0 py-3 pt-5 flex items-center justify-between text-left hover:bg-gray-200 transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            {/* Plus/X icon */}
            <svg 
              className={`w-[12px] h-[12px] text-black flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-45' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {/* Title */}
            {renderTitle()}
          </div>
        </button>
        
        {/* Divider line */}
        <div className="border-t border-gray-300"></div>
        
        {/* Accordion Content */}
        <div
          id={`accordion-content-${title}`}
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-0 py-4">
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
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold mb-4">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-bold mb-3">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-bold mb-2">{children}</h3>
                  ),
                  normal: ({ children }) => (
                    <p className="mb-3 leading-relaxed">{children}</p>
                  ),
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
                list: {
                  bullet: ({ children }) => (
                    <ul className="list-disc list-inside mb-4 space-y-1 ml-4">{children}</ul>
                  ),
                  number: ({ children }) => (
                    <ol className="list-decimal list-inside mb-4 space-y-1 ml-4">{children}</ol>
                  ),
                },
                listItem: {
                  bullet: ({ children }) => (
                    <li className="leading-relaxed">{children}</li>
                  ),
                  number: ({ children }) => (
                    <li className="leading-relaxed">{children}</li>
                  ),
                },
                marks: {
                  link: ({ children, value: link }) => {
                    return <ResolvedLink link={link}>{children}</ResolvedLink>;
                  },
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
                        className="hover:bg-[#F3E7B9] underline text-sm font-medium align-super cursor-pointer"
                        title="View source"
                        style={{ fontSize: '0.75em', verticalAlign: 'super' }}
                      >
                        {children}
                      </a>
                    )
                  },
                  strong: ({ children }) => (
                    <strong className="font-bold">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic">{children}</em>
                  ),
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 