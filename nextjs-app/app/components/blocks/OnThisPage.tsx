import React from 'react'
import { OnThisPageProps } from '@/app/types/locality'

export default function OnThisPage({ block }: OnThisPageProps) {
  const { links = [], marginTop = 'none', marginBottom = 'none' } = block

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

  const handleLinkClick = (destinationId: string) => {
    const element = document.getElementById(destinationId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }

  if (!links || links.length === 0) {
    return null
  }

  return (
    <div className={`${marginMap[marginTop as keyof typeof marginMap]} ${marginBottomMap[marginBottom as keyof typeof marginBottomMap]}`}>
      <div className="w-full bg-[#F5F5F0] py-8 px-6">
        <div className="flex items-center justify-center space-x-6">
          {/* Icon and "On this page:" label */}
          <div className="flex items-center space-x-2">
            <svg 
              className="w-5 h-5" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 16L16 12L14.6 10.6L13 12.2V8H11V12.2L9.4 10.6L8 12L12 16ZM12 22C10.6167 22 9.31667 21.7375 8.1 21.2125C6.88333 20.6875 5.825 19.975 4.925 19.075C4.025 18.175 3.3125 17.1167 2.7875 15.9C2.2625 14.6833 2 13.3833 2 12C2 10.6167 2.2625 9.31667 2.7875 8.1C3.3125 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.3125 8.1 2.7875C9.31667 2.2625 10.6167 2 12 2C13.3833 2 14.6833 2.2625 15.9 2.7875C17.1167 3.3125 18.175 4.025 19.075 4.925C19.975 5.825 20.6875 6.88333 21.2125 8.1C21.7375 9.31667 22 10.6167 22 12C22 13.3833 21.7375 14.6833 21.2125 15.9C20.6875 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6875 15.9 21.2125C14.6833 21.7375 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z" fill="#1F1F1F"/>
            </svg>
            <span className="text-gray-700 font-medium">On this page:</span>
          </div>
          
          {/* Navigation links */}
          <div className="flex items-center space-x-6">
            {links.map((link, index) => (
              <button
                key={index}
                onClick={() => handleLinkClick(link.destinationId)}
                className="text-gray-700 underline hover:text-gray-900 transition-colors duration-200 font-medium"
              >
                {link.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
