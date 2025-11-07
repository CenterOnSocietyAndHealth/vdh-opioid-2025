'use client';

import React, { useEffect, useState } from 'react';
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

  const [fileUrl, setFileUrl] = useState<string | undefined>();
  const [fileName, setFileName] = useState<string>('download');
  const [isLoading, setIsLoading] = useState(false);

  const safeMarginTop = getValidKeyOrDefault(marginTop, marginMap, 'medium')
  const safeMarginBottom = getValidKeyOrDefault(marginBottom, marginBottomMap, 'medium')

  // Resolve file URL and filename
  useEffect(() => {
    const resolveFileAsset = async () => {
      if (!file?.asset) {
        setFileUrl(undefined);
        setFileName('download');
        return;
      }

      // Check if asset is already resolved (has url property)
      if ('url' in file.asset && file.asset.url) {
        console.log('Asset is already resolved');
        setFileUrl(file.asset.url);
        setFileName(file.asset.originalFilename || 'download');
        return;
      }

      // Check if asset is a reference (has _ref property)
      if ('_ref' in file.asset && file.asset._ref && typeof file.asset._ref === 'string') {
        console.log('Asset is a reference, resolving...');
        setIsLoading(true);
        
        try {
          // Try to fetch the asset data from Sanity
          const assetData = await client.fetch(`*[_id == $ref][0]`, { ref: file.asset._ref });
          console.log('Resolved asset data:', assetData);
          
          if (assetData?.url) {
            setFileUrl(assetData.url);
            setFileName(assetData.originalFilename || 'download');
          } else {
            // Fallback: build URL from reference
            const assetId = file.asset._ref.replace('file-', '').replace(/-[a-z0-9]+$/, '');
            const fallbackUrl = `https://cdn.sanity.io/files/${projectId}/${dataset}/${assetId}`;
            console.log('Using fallback URL:', fallbackUrl);
            setFileUrl(fallbackUrl);
            setFileName('download');
          }
        } catch (error) {
          console.error('Error resolving asset reference:', error);
          // Fallback: build URL from reference
          try {
            const assetId = file.asset._ref.replace('file-', '').replace(/-[a-z0-9]+$/, '');
            const fallbackUrl = `https://cdn.sanity.io/files/${projectId}/${dataset}/${assetId}`;
            console.log('Using fallback URL after error:', fallbackUrl);
            setFileUrl(fallbackUrl);
            setFileName('download');
          } catch (fallbackError) {
            console.error('Error building fallback URL:', fallbackError);
            setFileUrl(undefined);
            setFileName('download');
          }
        } finally {
          setIsLoading(false);
        }
      }
    };

    resolveFileAsset();
  }, [file?.asset]);


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
    backgroundColor: '#427AA9',
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
  const isDisabled = !fileUrl || isLoading;

  return (
    <div className={`max-w-[1311px] mx-auto ${marginMap[safeMarginTop as keyof typeof marginMap]} ${marginBottomMap[safeMarginBottom as keyof typeof marginBottomMap]}`}>
      <div className="flex justify-center">
        <button
          onClick={handleClick}
          style={buttonStyles}
          tabIndex={0}
          onMouseEnter={(e) => {
            if (!isDisabled) {
              e.currentTarget.style.backgroundColor = '#3A658A';
            }
          }}
          onMouseLeave={(e) => {
            if (!isDisabled) {
              e.currentTarget.style.backgroundColor = '#427AA9';
            }
          }}
          disabled={isDisabled}
        >
          <DownloadIcon />
          <span className="whitespace-nowrap ml-3">
            {isLoading ? 'Loading...' : buttonText}
          </span>
        </button>
      </div>
      
      {isLoading && (
        <div className="mt-4 text-center hidden">
          <p className="text-sm text-gray-500">
            🔄 Loading file...
          </p>
        </div>
      )}
      
      {!isLoading && !fileUrl && (
        <div className="mt-4 text-center hidden">
          <p className="text-sm text-gray-500">
            ⚠️ File not configured. Please upload a file in the CMS to enable this button.
          </p>
        </div>
      )}
    </div>
  );
}
