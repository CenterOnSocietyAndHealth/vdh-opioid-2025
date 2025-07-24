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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
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

  // Adjust position after tooltip renders to account for actual dimensions
  useEffect(() => {
    if (isVisible && tooltipRef.current && triggerRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      
      const actualWidth = tooltipRect.width
      const actualHeight = tooltipRect.height
      
      // Get current position without using the state
      const currentTop = position.top
      const currentLeft = position.left
      const currentPlacement = position.placement
      
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
  }, [isVisible]) // Removed position from dependencies

  return (
    <>
      <span
        ref={triggerRef}
        className="relative inline cursor-help border-b-2 border-dashed border-gray-400 hover:border-gray-600 transition-colors"
        style={{ wordBreak: 'break-word', hyphens: 'auto' }}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </span>
      {mounted && isVisible && createPortal(
        <div
          ref={tooltipRef}
          className="fixed z-50 max-w-xs shadow-lg p-3"
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
          <span className="font-bold text-[16px] text-black mb-1 block">{term}:</span>
          <span className="text-sm text-gray-800 block">{definition}</span>
          
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
          />
        </div>,
        document.body
      )}
    </>
  )
} 