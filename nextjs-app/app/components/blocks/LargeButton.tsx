'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { LargeButtonProps } from '@/app/types/locality';
import { getValidKeyOrDefault } from '@/app/client-utils';

const marginMap = {
  none: 'mt-0',
  small: 'mt-[20px]',
  medium: 'mt-[40px]',
  large: 'mt-[60px]',
};

const marginBottomMap = {
  none: 'mb-0',
  small: 'mb-[20px]',
  medium: 'mb-[40px]',
  large: 'mb-[60px]',
};

// Download icon component
const DownloadIcon = () => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="mr-3"
  >
    <path 
      d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <polyline 
      points="7,10 12,15 17,10" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <line 
      x1="12" 
      y1="15" 
      x2="12" 
      y2="3" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
);

export default function LargeButton({ block }: LargeButtonProps) {
  const router = useRouter();
  const { 
    buttonText, 
    action, 
    customAction, 
    linkType = 'url',
    url,
    page,
    openInNewTab = false,
    marginTop = 'medium',
    marginBottom = 'medium'
  } = block;

  const safeMarginTop = getValidKeyOrDefault(marginTop, marginMap, 'medium')
  const safeMarginBottom = getValidKeyOrDefault(marginBottom, marginBottomMap, 'medium')

  // Determine the action text to display
  const getActionText = () => {
    if (action === 'custom' && customAction) {
      return customAction;
    }
    return action.charAt(0).toUpperCase() + action.slice(1);
  };

  // Handle button click
  const handleClick = () => {
    if (linkType === 'url' && url) {
      if (action === 'download') {
        // Create a temporary link element for download
        const link = document.createElement('a');
        link.href = url;
        link.download = `report.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Open URL - respect new tab setting
        if (openInNewTab) {
          window.open(url, '_blank');
        } else {
          window.location.href = url;
        }
      }
    } else if (linkType === 'page' && page?.slug) {
      // Navigate to internal page
      if (openInNewTab) {
        // Open internal page in new tab
        window.open(`/${page.slug}`, '_blank');
      } else {
        // Navigate to internal page using Next.js router
        router.push(`/${page.slug}`);
      }
    }
  };

  // Button styles
  const buttonStyles = {
    backgroundColor: '#427AA9',
    color: '#FFFFFF',
    border: '1px solid #417A90',
  };

  const buttonClassName = "inline-flex items-center justify-center px-16 py-4 rounded-full font-medium text-lg transition-all duration-200 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-opacity-50";

  // Button content
  const buttonContent = (
    <>
      {action === 'download' && <DownloadIcon />}
      <span className="whitespace-nowrap">
        {buttonText}
      </span>
    </>
  );

  // Determine if button should be disabled
  const isDisabled = linkType === 'url' ? !url : !page?.slug;

  return (
    <div className={`max-w-[1311px] mx-auto ${marginMap[safeMarginTop as keyof typeof marginMap]} ${marginBottomMap[safeMarginBottom as keyof typeof marginBottomMap]}`}>
      <div className="flex justify-center">
        <button
          onClick={handleClick}
          className={buttonClassName}
          style={buttonStyles}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#3A658A';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#427AA9';
          }}
          disabled={isDisabled}
        >
          {buttonContent}
        </button>
      </div>
      
      {isDisabled && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            ⚠️ {linkType === 'url' ? 'URL' : 'Page'} not configured. Please add a {linkType === 'url' ? 'URL' : 'page'} in the CMS to enable this button.
          </p>
        </div>
      )}
    </div>
  );
}
