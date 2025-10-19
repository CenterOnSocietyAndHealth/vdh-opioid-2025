'use client';

import React from 'react';
import { DownloadButtonProps } from '@/app/types/locality';
import { getValidKeyOrDefault } from '@/app/client-utils';
import { client } from '@/sanity/lib/client';
import { projectId, dataset } from '@/sanity/lib/api';

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
    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="14" viewBox="0 0 14 17" fill="none">
        <path d="M0 17H14V15H0M14 6H10V0H4V6H0L7 13L14 6Z" fill="white" />
    </svg>
);

export default function DownloadButton({ block }: DownloadButtonProps) {
  const { 
    buttonText, 
    file,
    marginTop = 'medium',
    marginBottom = 'medium'
  } = block;

  // Debug logging to see what data we're receiving
  console.log('DownloadButton block data:', block);
  console.log('File data:', file);
  console.log('Asset data:', file?.asset);

  const safeMarginTop = getValidKeyOrDefault(marginTop, marginMap, 'medium')
  const safeMarginBottom = getValidKeyOrDefault(marginBottom, marginBottomMap, 'medium')

  // Get file URL and filename from different possible data structures
  let fileUrl = file?.asset?.url || file?.url;
  let fileName = file?.asset?.originalFilename || file?.originalFilename || 'download';
  
  // If we have an asset reference but no URL, try to build the URL from the reference
  if (!fileUrl && file?.asset?._ref) {
    try {
      // Build URL from asset reference using Sanity's CDN
      const assetId = file.asset._ref.replace('file-', '').replace(/-[a-z0-9]+$/, '');
      fileUrl = `https://cdn.sanity.io/files/${projectId}/${dataset}/${assetId}.csv`;
    } catch (error) {
      console.error('Error building file URL:', error);
    }
  }
  
  console.log('File URL:', fileUrl);
  console.log('File name:', fileName);

  // Handle button click
  const handleClick = () => {
    if (fileUrl) {
      // Create a temporary link element for download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Button styles matching the mockup
  const buttonStyles = {
    backgroundColor: '#4783B5',
    color: '#FFFFFF',
    fontFamily: 'Inter',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 600,
    lineHeight: '130%',
    letterSpacing: '-0.304px',
    border: 'none',
    borderRadius: '30px', // Rounded pill shape
    padding: '19px 30px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(71, 131, 181, 0.3)', // Subtle shadow
  };

  // Determine if button should be disabled
  const isDisabled = !fileUrl;

  return (
    <div className={`max-w-[1311px] mx-auto ${marginMap[safeMarginTop as keyof typeof marginMap]} ${marginBottomMap[safeMarginBottom as keyof typeof marginBottomMap]}`}>
      <div className="flex justify-center">
        <button
          onClick={handleClick}
          style={buttonStyles}
          onMouseEnter={(e) => {
            if (!isDisabled) {
              e.currentTarget.style.backgroundColor = '#3A6B9A';
              e.currentTarget.style.transform = 'translateY(-1px)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(71, 131, 181, 0.4)';
            }
          }}
          onMouseLeave={(e) => {
            if (!isDisabled) {
              e.currentTarget.style.backgroundColor = '#4783B5';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(71, 131, 181, 0.3)';
            }
          }}
          disabled={isDisabled}
        >
          <DownloadIcon />
          <span className="whitespace-nowrap ml-3">
            {buttonText}
          </span>
        </button>
      </div>
      
      {isDisabled && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            ⚠️ File not configured. Please upload a file in the CMS to enable this button.
          </p>
        </div>
      )}
    </div>
  );
}
