'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface DefinitionPopupProps {
  term: string
  definition: string
  children: React.ReactNode
}

export default function DefinitionPopup({ term, definition, children }: DefinitionPopupProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0, placement: 'top' as 'top' | 'bottom' })
  const triggerRef = useRef<HTMLSpanElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef(position)
  const [mounted, setMounted] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  // Keep ref in sync with state
  useEffect(() => {
    positionRef.current = position
  }, [position])

  useEffect(() => {
    setMounted(true)
    
    // Cleanup function to remove live region on unmount
    return () => {
      const liveRegion = document.getElementById('definition-announcements')
      if (liveRegion) {
        liveRegion.remove()
      }
    }
  }, [])

  const calculatePosition = (mouseX: number, mouseY: number) => {
    if (!triggerRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    // Estimate tooltip dimensions
    const estimatedWidth = 280 // max-w-xs is roughly 280px
    const estimatedHeight = Math.max(80, definition.length * 0.8) // Rough estimate based on text length
    
    // Calculate available space
    const spaceAbove = mouseY
    const spaceBelow = viewportHeight - mouseY
    
    // Determine placement - prefer top, fallback to bottom
    const placement = spaceAbove > spaceBelow ? 'top' : 'bottom'
    
    // Calculate vertical position
    const verticalOffset = 12
    let top: number
    
    if (placement === 'top') {
      top = mouseY - estimatedHeight - verticalOffset
      // If not enough space above, try to fit it anyway
      if (top < 10) {
        top = 10
      }
    } else {
      top = mouseY + verticalOffset
      // If not enough space below, try to fit it anyway
      if (top + estimatedHeight > viewportHeight - 10) {
        top = viewportHeight - estimatedHeight - 10
      }
    }
    
    // Calculate horizontal position based on mouse position
    let left = mouseX
    
    // Ensure tooltip doesn't go off-screen horizontally
    const tooltipHalfWidth = estimatedWidth / 2
    if (left - tooltipHalfWidth < 10) {
      left = 10 + tooltipHalfWidth
    } else if (left + tooltipHalfWidth > viewportWidth - 10) {
      left = viewportWidth - 10 - tooltipHalfWidth
    }
    
    setPosition({ top, left, placement })
  }

  const handleMouseEnter = (event: React.MouseEvent) => {
    calculatePosition(event.clientX, event.clientY)
    setIsVisible(true)
  }

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isVisible) {
      calculatePosition(event.clientX, event.clientY)
    }
  }

  const handleMouseLeave = () => {
    setIsVisible(false)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (isVisible) {
        setIsVisible(false)
      } else {
        // Calculate position based on trigger element for keyboard activation
        if (triggerRef.current) {
          const rect = triggerRef.current.getBoundingClientRect()
          calculatePosition(rect.left + rect.width / 2, rect.top + rect.height / 2)
        }
        setIsVisible(true)
      }
    } else if (event.key === 'Escape' && isVisible) {
      event.preventDefault()
      setIsVisible(false)
    } else if (event.key === 'ArrowDown' && !isVisible) {
      // Open definition with arrow down
      event.preventDefault()
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect()
        calculatePosition(rect.left + rect.width / 2, rect.top + rect.height / 2)
      }
      setIsVisible(true)
    } else if (event.key === 'ArrowUp' && isVisible) {
      // Close definition with arrow up
      event.preventDefault()
      setIsVisible(false)
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = (event: React.FocusEvent) => {
    // Only hide if focus is moving outside the component entirely
    if (!triggerRef.current?.contains(event.relatedTarget as Node) && 
        !tooltipRef.current?.contains(event.relatedTarget as Node)) {
      setIsFocused(false)
      setIsVisible(false)
    }
  }

  // Handle focus management and screen reader announcements
  useEffect(() => {
    if (isVisible) {
      // Create a more robust live region for screen reader announcements
      let liveRegion = document.getElementById('definition-announcements')
      if (!liveRegion) {
        liveRegion = document.createElement('div')
        liveRegion.id = 'definition-announcements'
        liveRegion.setAttribute('aria-live', 'polite')
        liveRegion.setAttribute('aria-atomic', 'true')
        liveRegion.setAttribute('aria-label', 'Definition announcements')
        liveRegion.className = 'sr-only'
        liveRegion.style.position = 'absolute'
        liveRegion.style.left = '-10000px'
        liveRegion.style.width = '1px'
        liveRegion.style.height = '1px'
        liveRegion.style.overflow = 'hidden'
        liveRegion.style.clip = 'rect(0, 0, 0, 0)'
        liveRegion.style.whiteSpace = 'nowrap'
        document.body.appendChild(liveRegion)
      }
      
      // Clear previous content and announce new definition
      liveRegion.textContent = ''
      // Use a small delay to ensure the clear is processed
      setTimeout(() => {
        liveRegion.textContent = `Definition for ${term}: ${definition}`
      }, 50)
      
      // Clear the announcement after a delay to allow for re-announcement
      setTimeout(() => {
        if (liveRegion) {
          liveRegion.textContent = ''
        }
      }, 3000)
    }
  }, [isVisible, term, definition])

  // Adjust position after tooltip renders to account for actual dimensions
  useEffect(() => {
    if (isVisible && tooltipRef.current && triggerRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      
      const actualWidth = tooltipRect.width
      const actualHeight = tooltipRect.height
      
      // Get current position from ref to avoid dependency issues
      const currentPosition = positionRef.current
      const currentTop = currentPosition.top
      const currentLeft = currentPosition.left
      const currentPlacement = currentPosition.placement
      
      // Recalculate with actual dimensions
      const verticalOffset = 12
      let newTop = currentTop
      let newLeft = currentLeft
      
      if (currentPlacement === 'top') {
        newTop = currentTop - (actualHeight - Math.max(80, definition.length * 0.8))
        if (newTop < 10) {
          newTop = 10
        }
      } else {
        newTop = currentTop + (actualHeight - Math.max(80, definition.length * 0.8))
        if (newTop + actualHeight > viewportHeight - 10) {
          newTop = viewportHeight - actualHeight - 10
        }
      }
      
      const tooltipHalfWidth = actualWidth / 2
      if (newLeft - tooltipHalfWidth < 10) {
        newLeft = 10 + tooltipHalfWidth
      } else if (newLeft + tooltipHalfWidth > viewportWidth - 10) {
        newLeft = viewportWidth - 10 - tooltipHalfWidth
      }
      
      // Only update if position actually changed
      if (newTop !== currentTop || newLeft !== currentLeft) {
        setPosition({ top: newTop, left: newLeft, placement: currentPlacement })
      }
    }
  }, [isVisible, definition.length]) // Removed position dependencies

  const ariaExpandedValue = isVisible ? "true" : "false"

  return (
    <>
      <span
        ref={triggerRef}
        className="relative inline cursor-help border-b border-dotted border-[#1E1E1E] hover:bg-[#cfe6ef] focus:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        style={{ wordBreak: 'break-word', hyphens: 'auto' }}
        tabIndex={0}
        role="button"
        aria-describedby={isVisible ? `definition-${term.replace(/\s+/g, '-').toLowerCase()}` : undefined}
        aria-label={isFocused ? `Definition available for ${term}. Press Enter or Space to read it.` : undefined}
        aria-expanded={ariaExpandedValue}
        aria-haspopup="true"
        aria-controls={isVisible ? `definition-${term.replace(/\s+/g, '-').toLowerCase()}` : undefined}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        {children}
      </span>
      {mounted && isVisible && createPortal(
        <div
          ref={tooltipRef}
          id={`definition-${term.replace(/\s+/g, '-').toLowerCase()}`}
          className="fixed z-50 max-w-xs shadow-lg py-[27px] px-[17px]"
          role="tooltip"
          aria-labelledby={`definition-title-${term.replace(/\s+/g, '-').toLowerCase()}`}
          aria-describedby={`definition-content-${term.replace(/\s+/g, '-').toLowerCase()}`}
          aria-hidden="false"
          style={{
            top: `${position.top}px`,
            left: `${position.left}px`,
            transform: 'translateX(-50%)',
            fontSize: '14px',
            lineHeight: '1.4',
            borderRadius: '5px',
            border: '1px solid #D9D9D9',
            background: '#FFF',
            opacity: '1',
            pointerEvents: 'none'
          }}
        >
          <span 
            id={`definition-title-${term.replace(/\s+/g, '-').toLowerCase()}`}
            className="font-bold text-[16px] text-black mb-1 flex items-center gap-2"
          >
            <span className="inline-flex items-center justify-center w-5 h-5 bg-black text-white rounded-full text-xs font-bold" aria-hidden="true">
              ?
            </span>
            {term}:
          </span>
          <span 
            id={`definition-content-${term.replace(/\s+/g, '-').toLowerCase()}`}
            className="text-sm text-gray-800 block"
          >
            {definition}
          </span>
          
          {/* Arrow */}
          <div 
            className={`absolute w-0 h-0 border-l-8 border-r-8 border-transparent ${
              position.placement === 'top' 
                ? 'top-full border-t-8 border-t-white' 
                : 'bottom-full border-b-8 border-b-white'
            }`}
            style={{
              left: '50%',
              transform: 'translateX(-50%)',
              filter: 'drop-shadow(0 1px 1px rgba(0,0,0,0.1))'
            }}
            aria-hidden="true"
          />
        </div>,
        document.body
      )}
    </>
  )
} 