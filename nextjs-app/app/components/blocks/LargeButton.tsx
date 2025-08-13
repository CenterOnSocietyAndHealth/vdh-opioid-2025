'use client';

import React from 'react';
import { LargeButtonProps } from '@/app/types/locality';

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
  const { 
    buttonText, 
    buttonColor, 
    textColor, 
    action, 
    customAction, 
    url,
    marginTop = 'medium',
    marginBottom = 'medium'
  } = block;

  // Determine the action text to display
  const getActionText = () => {
    if (action === 'custom' && customAction) {
      return customAction;
    }
    return action.charAt(0).toUpperCase() + action.slice(1);
  };

  // Handle button click
  const handleClick = () => {
    if (url) {
      if (action === 'download') {
        // Create a temporary link element for download
        const link = document.createElement('a');
        link.href = url;
        link.download = `report.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // Open in new tab for other actions
        window.open(url, '_blank');
      }
    }
  };

  return (
    <div className={`max-w-[1311px] mx-auto ${marginMap[marginTop]} ${marginBottomMap[marginBottom]}`}>
      <div className="flex justify-center">
        <button
          onClick={handleClick}
          className="inline-flex items-center justify-center px-16 py-4 rounded-full font-medium text-lg transition-all duration-200 hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-opacity-50"
          style={{
            backgroundColor: buttonColor,
            color: textColor,
          }}
          disabled={!url}
        >
          {action === 'download' && <DownloadIcon />}
          <span className="whitespace-nowrap">
            {buttonText}
          </span>
        </button>
      </div>
      
      {!url && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            ⚠️ URL not configured. Please add a URL in the CMS to enable this button.
          </p>
        </div>
      )}
    </div>
  );
}
