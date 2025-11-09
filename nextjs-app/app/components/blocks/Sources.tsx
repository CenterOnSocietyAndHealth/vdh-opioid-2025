"use client"

import { useState, useEffect, useRef } from 'react'
import { PortableText } from 'next-sanity'
import { SourcesProps } from '@/app/types/locality'
import { getValidKeyOrDefault } from '@/app/client-utils'
import ResolvedLink from '@/app/components/ResolvedLink'

const marginMap = {
  none: 'mt-0',
  small: 'mt-4',
  medium: 'mt-8',
  large: 'mt-10',
}

const marginBottomMap = {
  none: 'mb-0',
  small: 'mb-4',
  medium: 'mb-8',
  large: 'mb-10',
}

export default function Sources({ block }: SourcesProps) {
  const { citations = [], marginTop = 'none', marginBottom = 'none', width = 672 } = block
  const [isExpanded, setIsExpanded] = useState<boolean>(false)
  const [highlightedSource, setHighlightedSource] = useState<string | null>(null)
  const focusOriginsRef = useRef<Map<string, HTMLElement>>(new Map())

  const focusAndScrollToSource = (hash: string) => {
    if (!hash) return

    const scrollToElement = (element: HTMLElement) => {
      const elementRect = element.getBoundingClientRect()
      const absoluteElementTop = elementRect.top + window.pageYOffset
      const center = absoluteElementTop - (window.innerHeight / 2) + (elementRect.height / 2)

      window.scrollTo({
        top: center,
        behavior: 'smooth'
      })
    }

    setTimeout(() => {
      const element = document.querySelector(hash) as HTMLElement | null
      if (!element) return

      if (typeof element.focus === 'function') {
        element.focus({ preventScroll: true })
      }

      scrollToElement(element)

      let attempts = 0
      const maxAttempts = 3
      const interval = 300

      const ensureVisibility = () => {
        const rect = element.getBoundingClientRect()
        const fullyVisible = rect.top >= 0 && rect.bottom <= window.innerHeight

        if (!fullyVisible && attempts < maxAttempts) {
          attempts += 1
          scrollToElement(element)
          setTimeout(ensureVisibility, interval)
        }
      }

      setTimeout(ensureVisibility, interval)
    }, 400)
  }

  const safeMarginTop = getValidKeyOrDefault(marginTop, marginMap, 'none')
  const safeMarginBottom = getValidKeyOrDefault(marginBottom, marginBottomMap, 'none')

  const toggleSources = () => {
    setIsExpanded(!isExpanded)
  }

  const ariaExpanded = isExpanded ? true : false

  const updateFocusOrigin = (citationId: string, originElement?: HTMLElement | null) => {
    if (!citationId || !originElement) {
      return
    }

    focusOriginsRef.current.set(citationId, originElement)
  }

  const focusOriginLink = (citationId: string) => {
    if (!citationId) return

    const originElement = focusOriginsRef.current.get(citationId)

    if (!originElement) {
      focusOriginsRef.current.delete(citationId)
    }

    const elementToFocus =
      originElement || (document.querySelector(`a[data-citation-id="${citationId}"]`) as HTMLElement | null)

    if (elementToFocus) {
      if (typeof elementToFocus.focus === 'function') {
        elementToFocus.focus({ preventScroll: true })
      }
      elementToFocus.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handleReturnToCitation = (citationId: string) => {
    focusOriginLink(citationId)
    setHighlightedSource(null)
  }


  // Auto-open accordion when a citation link is clicked
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash && hash.startsWith('#source-')) {
        const sourceId = hash.substring(1) // Remove the # symbol
        setIsExpanded(true)
        setHighlightedSource(sourceId)
        
        focusAndScrollToSource(hash)
        
        // Remove highlighting after 3 seconds
        setTimeout(() => {
          setHighlightedSource(null)
        }, 3000)
      }
    }

    const handleOpenSourcesAccordion = (
      event: CustomEvent<{ citationId?: string; originElement?: HTMLElement | null }>
    ) => {
      setIsExpanded(true)
      const { citationId, originElement } = event.detail
      if (citationId) {
        setHighlightedSource(citationId)
        updateFocusOrigin(citationId, originElement)
        
        focusAndScrollToSource(`#${citationId}`)
        
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
          const sourceId = hash.substring(1)
          const originElement = link as HTMLElement

          // Update the URL without triggering a page jump
          window.history.pushState(null, '', hash)
          
          // Handle the navigation ourselves
          setIsExpanded(true)
          setHighlightedSource(sourceId)
          updateFocusOrigin(sourceId, originElement)
          
          focusAndScrollToSource(hash)
          
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
    <div className={`${marginMap[safeMarginTop as keyof typeof marginMap]} ${marginBottomMap[safeMarginBottom as keyof typeof marginBottomMap]}`} data-sources-accordion>
      <div 
        className="mx-auto bg-[#f3f2ec]"
        style={{ maxWidth: `${width}px` }}
      >
        {/* Sources Header */}
        {/* eslint-disable-next-line jsx-a11y/aria-proptypes */}
        <button
          onClick={toggleSources}
          className="w-full px-[20px] py-[10px] flex items-center justify-between text-left transition-colors duration-200"
          aria-expanded={ariaExpanded}
          aria-controls="sources-content"
          tabIndex={0}
          id="sources-button"
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
          id="sources-content"
          className={`grid transition-[grid-template-rows] duration-1000 ease-in-out ${
            isExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
          aria-hidden={!isExpanded}
          aria-labelledby="sources-button"
          inert={!isExpanded}
        >
          <div className="overflow-hidden">
            <div className="px-[20px] py-[15px] pb-[20px]">
            <ol className="space-y-3 ml-0 md:ml-6">
              {citations.map((citation, index) => {
                const citationId = generateCitationId(index)
                const isHighlighted = highlightedSource === citationId
                return (
                  <li 
                    key={citationId} 
                    id={citationId} 
                    tabIndex={isExpanded ? 0 : -1}
                    className={`flex transition-colors duration-300 ${
                      isHighlighted ? 'bg-[#F3E7B9] rounded-lg' : ''
                    }`}
                  >
                    <span className="flex-shrink-0 text-gray-700 text-sm font-medium ml-2 mr-6 mt-1">
                      {index + 1}
                    </span>
                    <div className="flex-1 text-gray-900 leading-relaxed">
                      <PortableText
                        value={citation.text}
                        components={{
                          block: {
                            normal: ({ children }) => (
                              <span className="break-words">{children}</span>
                            ),
                          },
                          marks: {
                            link: ({ children, value }) => (
                              <ResolvedLink
                                link={value}
                                className="text-[#1e1e1e] hover:bg-[#cfe6ef] hover:text-black visited:text-[#6b7280] underline break-all"
                                tabIndex={isExpanded ? 0 : -1}
                              >
                                {children}
                              </ResolvedLink>
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
                      <button
                        type="button"
                        onClick={() => handleReturnToCitation(citationId)}
                        className="ml-2 inline-flex items-center gap-1 text-sm text-[#1e1e1e] underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e1e1e]"
                        tabIndex={isExpanded ? 0 : -1}
                        aria-label="Return to citation"
                      >
                        <span aria-hidden="true" className="text-base leading-none">↩</span>
                        <span className="sr-only">Back to citation</span>
                      </button>
                    </div>
                  </li>
                )
              })}
            </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
