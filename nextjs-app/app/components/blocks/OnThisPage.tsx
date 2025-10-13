import React, { useState } from 'react'
import { OnThisPageProps } from '@/app/types/locality'
import { getValidKeyOrDefault } from '@/app/client-utils'

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

export default function OnThisPage({ block }: OnThisPageProps) {
  const { links = [], marginTop = 'none', marginBottom = 'none' } = block
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [selectedLink, setSelectedLink] = useState(links[0]?.title || '')

  const safeMarginTop = getValidKeyOrDefault(marginTop, marginMap, 'none')
  const safeMarginBottom = getValidKeyOrDefault(marginBottom, marginBottomMap, 'none')

  const handleLinkClick = (destinationId: string) => {
    const element = document.getElementById(destinationId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  const handleDropdownLinkClick = (link: { title: string; destinationId: string }) => {
    setSelectedLink(link.title)
    setIsDropdownOpen(false)
    handleLinkClick(link.destinationId)
  }

  if (!links || links.length === 0) {
    return null
  }

  return (
      <div className={`${marginMap[safeMarginTop as keyof typeof marginMap]} ${marginBottomMap[safeMarginBottom as keyof typeof marginBottomMap]} mx-2 md:mx-0`}>
        <div className="w-full bg-[#F5F5F0] py-8 px-6">
        {/* Desktop Version */}
        <div className="hidden md:flex items-center justify-center space-x-6">
          {/* Icon and "On this page:" label */}
          <div className="flex items-center space-x-2">
            <svg 
              className="w-6 h-6" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 16L16 12L14.6 10.6L13 12.2V8H11V12.2L9.4 10.6L8 12L12 16ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z" fill="#1F1F1F"/>
            </svg>
            <span className="text-[#1E1E1E] font-semibold">On this page:</span>
          </div>
          
          {/* Navigation links */}
          <div className="flex items-center space-x-6">
            {links.map((link, index) => (
              <button
                key={index}
                onClick={() => handleLinkClick(link.destinationId)}
                className="text-[#1E1E1E] underline font-normal border-b border-transparent hover:border-[#1E1E1E]"
              >
                {link.title}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Version */}
        <div className="md:hidden">
          <div className="flex items-center space-x-2 mb-2">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 16L16 12L14.6 10.6L13 12.2V8H11V12.2L9.4 10.6L8 12L12 16ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z" fill="#1F1F1F" />
            </svg>
            <span className="text-[#1E1E1E] font-semibold">On this page:</span>
          </div>
          
          {/* Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-white border border-[#E7E7E7] rounded-[3px] px-4 py-3 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <span className="text-[#1E1E1E] font-normal">{selectedLink}</span>
              <svg 
                className={`w-4 h-4 text-[#1E1E1E] transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E7E7E7] shadow-lg z-10">
                {links.map((link, index) => (
                  <button
                    key={index}
                    onClick={() => handleDropdownLinkClick(link)}
                    className="w-full px-4 py-3 text-left text-[#1E1E1E] font-normal hover:bg-gray-50 first:rounded-t-[3px] last:rounded-b-[3px] border-b border-gray-200 last:border-b-0"
                  >
                    {link.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
