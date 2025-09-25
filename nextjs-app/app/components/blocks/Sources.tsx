"use client"

import { useState, useEffect } from 'react'
import { PortableText } from 'next-sanity'
import { SourcesProps } from '@/app/types/locality'

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

export default function Sources({ block }: SourcesProps) {
  const { citations = [], marginTop = 'none', marginBottom = 'none', width = 672 } = block
  const [isExpanded, setIsExpanded] = useState(false)
  const [highlightedSource, setHighlightedSource] = useState<string | null>(null)

  const toggleSources = () => {
    setIsExpanded(!isExpanded)
  }

  // Auto-open accordion when a citation link is clicked
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash && hash.startsWith('#source-')) {
        const sourceId = hash.substring(1) // Remove the # symbol
        setIsExpanded(true)
        setHighlightedSource(sourceId)
        
        // Scroll to the citation after a short delay to ensure accordion is open
        setTimeout(() => {
          const element = document.querySelector(hash)
          if (element) {
            // Calculate the element's position and scroll to center it smoothly
            const elementRect = element.getBoundingClientRect()
            const absoluteElementTop = elementRect.top + window.pageYOffset
            const center = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2)
            
            window.scrollTo({
              top: center,
              behavior: 'smooth'
            })
          }
        }, 350) // Slightly longer than the accordion transition duration
        
        // Remove highlighting after 3 seconds
        setTimeout(() => {
          setHighlightedSource(null)
        }, 3000)
      }
    }

    const handleOpenSourcesAccordion = (event: CustomEvent) => {
      setIsExpanded(true)
      const { citationId } = event.detail
      if (citationId) {
        setHighlightedSource(citationId)
        
        // Scroll to the citation after a short delay
        setTimeout(() => {
          const element = document.querySelector(`#${citationId}`)
          if (element) {
            // Calculate the element's position and scroll to center it smoothly
            const elementRect = element.getBoundingClientRect()
            const absoluteElementTop = elementRect.top + window.pageYOffset
            const center = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2)
            
            window.scrollTo({
              top: center,
              behavior: 'smooth'
            })
          }
        }, 350)
        
        // Remove highlighting after 3 seconds
        setTimeout(() => {
          setHighlightedSource(null)
        }, 3000)
      }
    }

    // Handle clicks on citation links to prevent default behavior
    const handleCitationClick = (event: Event) => {
      const target = event.target as HTMLElement
      const link = target.closest('a[href^="#source-"]') as HTMLAnchorElement
      
      if (link) {
        event.preventDefault()
        const hash = link.getAttribute('href')
        if (hash) {
          // Update the URL without triggering a page jump
          window.history.pushState(null, '', hash)
          
          // Handle the navigation ourselves
          const sourceId = hash.substring(1)
          setIsExpanded(true)
          setHighlightedSource(sourceId)
          
          // Scroll to the citation after a short delay to ensure accordion is open
          setTimeout(() => {
            const element = document.querySelector(hash)
            if (element) {
              // Calculate the element's position and scroll to center it smoothly
              const elementRect = element.getBoundingClientRect()
              const absoluteElementTop = elementRect.top + window.pageYOffset
              const center = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2)
              
              window.scrollTo({
                top: center,
                behavior: 'smooth'
              })
            }
          }, 350)
          
          // Remove highlighting after 3 seconds
          setTimeout(() => {
            setHighlightedSource(null)
          }, 3000)
        }
      }
    }

    // Check hash on mount
    handleHashChange()

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)
    
    // Listen for custom event to open accordion
    window.addEventListener('openSourcesAccordion', handleOpenSourcesAccordion as EventListener)
    
    // Listen for clicks on citation links
    document.addEventListener('click', handleCitationClick)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
      window.removeEventListener('openSourcesAccordion', handleOpenSourcesAccordion as EventListener)
      document.removeEventListener('click', handleCitationClick)
    }
  }, [])

  // Generate auto-incrementing IDs for citations
  const generateCitationId = (index: number) => {
    return `source-${String(index + 1).padStart(2, '0')}`
  }

  return (
    <div className={`${marginMap[marginTop]} ${marginBottomMap[marginBottom]}`} data-sources-accordion>
      <div 
        className="mx-auto"
        style={{ maxWidth: `${width}px` }}
      >
        {/* Sources Header */}
        <button
          onClick={toggleSources}
          className="w-full px-0 py-3 pt-5 flex items-center justify-between text-left transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            {/* Title */}
            <span className="text-lg font-medium">Sources:</span>
            {/* Chevron icon */}
            <svg
                className={`w-4 h-4 text-black flex-shrink-0 transition-transform duration-200 ${isExpanded ? '-rotate-90' : 'rotate-90'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
        
        
        {/* Sources Content */}
        <div
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-0 py-4">
            <ol className="space-y-3">
              {citations.map((citation, index) => {
                const citationId = generateCitationId(index)
                const isHighlighted = highlightedSource === citationId
                return (
                  <li 
                    key={citationId} 
                    id={citationId} 
                    className={`flex transition-colors duration-300 ${
                      isHighlighted ? 'bg-[#F3E7B9] rounded-lg' : ''
                    }`}
                  >
                    <span className="flex-shrink-0 w-6 h-6 bg-gray-100 text-gray-700 text-sm font-medium rounded-full flex items-center justify-center mr-3 mt-0.5">
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <div className="text-gray-900 leading-relaxed">
                        <PortableText
                          value={citation.text}
                          components={{
                            block: {
                              normal: ({ children }) => (
                                <p className="mb-2 last:mb-0 break-words">{children}</p>
                              ),
                            },
                            marks: {
                              link: ({ children, value }) => (
                                <a
                                  href={value?.href}
                                  target={value?.blank ? '_blank' : undefined}
                                  rel={value?.blank ? 'noopener noreferrer' : undefined}
                                  className="text-blue-600 hover:text-blue-800 underline"
                                >
                                  {children}
                                </a>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-semibold">{children}</strong>
                              ),
                              em: ({ children }) => (
                                <em className="italic">{children}</em>
                              ),
                            },
                          }}
                        />
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}
