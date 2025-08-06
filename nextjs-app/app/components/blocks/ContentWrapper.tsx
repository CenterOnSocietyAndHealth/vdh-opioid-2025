import React from 'react'
import { ContentWrapperProps } from '@/app/types/locality'
import BlockRenderer from '@/app/components/BlockRenderer'

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

const paddingMap = {
  none: 'p-0',
  small: 'p-[20px]',
  medium: 'p-[35px_30px]',
  large: 'p-[50px_40px]',
}

const backgroundWidthMap = {
  full: 'w-full',
  container: 'max-w-7xl mx-auto',
  narrow: 'max-w-4xl mx-auto',
}

const contentWidthMap = {
  full: 'w-full',
  container: 'max-w-7xl mx-auto',
  narrow: 'max-w-4xl mx-auto',
}

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj)
}

// Function to clean corrupted string values by removing invisible Unicode characters
const cleanString = (str: string | undefined): string | undefined => {
  if (typeof str !== 'string') return str
  // Remove invisible Unicode characters that might be causing corruption
  return str.replace(/[\u200B-\u200D\uFEFF\u2060-\u2064\u206A-\u206F]/g, '').trim()
}

export default function ContentWrapper({ block, selectedLocality, localities, pageId, pageType }: ContentWrapperProps) {
  const { 
    content, 
    marginTop = 'none', 
    marginBottom = 'none', 
    backgroundColor = '#f0f0f0',
    customBackgroundColor,
    backgroundWidth = 'container',
    contentWidth = 'container',
    customContentWidth,
    padding = 'medium'
  } = block

  // Clean corrupted string values
  const cleanMarginTop = cleanString(marginTop)
  const cleanMarginBottom = cleanString(marginBottom)
  const cleanBackgroundColor = cleanString(backgroundColor)
  const cleanBackgroundWidth = cleanString(backgroundWidth)
  const cleanContentWidth = cleanString(contentWidth)
  const cleanPadding = cleanString(padding)

  // Validate and sanitize backgroundColor
  const finalBackgroundColor = cleanBackgroundColor === 'custom' && customBackgroundColor 
    ? (typeof customBackgroundColor === 'string' && customBackgroundColor.match(/^#[0-9A-Fa-f]{6}$/) ? customBackgroundColor : '#f0f0f0')
    : (typeof cleanBackgroundColor === 'string' && cleanBackgroundColor.match(/^#[0-9A-Fa-f]{6}$/) ? cleanBackgroundColor : '#f0f0f0')
  
  // Validate margin values to prevent undefined classes
  const validMarginTop = cleanMarginTop && marginMap[cleanMarginTop as keyof typeof marginMap] ? cleanMarginTop : 'none'
  const validMarginBottom = cleanMarginBottom && marginBottomMap[cleanMarginBottom as keyof typeof marginBottomMap] ? cleanMarginBottom : 'none'
  
  // Validate width values
  const validBackgroundWidth = cleanBackgroundWidth && backgroundWidthMap[cleanBackgroundWidth as keyof typeof backgroundWidthMap] ? cleanBackgroundWidth : 'container'
  const validContentWidth = cleanContentWidth && contentWidthMap[cleanContentWidth as keyof typeof contentWidthMap] ? cleanContentWidth : 'container'
  
  // Validate padding
  const validPadding = cleanPadding && paddingMap[cleanPadding as keyof typeof paddingMap] ? cleanPadding : 'medium'

  console.log('ContentWrapper block:', { 
    marginTop, 
    marginBottom, 
    backgroundColor, 
    customBackgroundColor,
    backgroundWidth, 
    contentWidth, 
    customContentWidth,
    padding 
  })
  console.log('Cleaned values:', { 
    cleanMarginTop, 
    cleanMarginBottom, 
    cleanBackgroundColor,
    cleanBackgroundWidth,
    cleanContentWidth,
    cleanPadding
  })
  
  return (
    <div className={`${marginMap[validMarginTop as keyof typeof marginMap]} ${marginBottomMap[validMarginBottom as keyof typeof marginBottomMap]}`}>
      {/* Background container */}
      <div 
        className={`${backgroundWidthMap[validBackgroundWidth as keyof typeof backgroundWidthMap]}`}
        style={{ backgroundColor: finalBackgroundColor }}
      >
        {/* Content container */}
        <div 
          className={`${paddingMap[validPadding as keyof typeof paddingMap]}`}
          style={{
            ...(validContentWidth === 'custom' && customContentWidth ? { maxWidth: `${customContentWidth}px`, marginLeft: 'auto', marginRight: 'auto' } : {}),
            ...(validContentWidth !== 'custom' ? { width: '100%' } : {})
          }}
        >
          {content && content.map((contentBlock: any, index: number) => (
            <BlockRenderer
              key={contentBlock._key}
              index={index}
              block={contentBlock}
              pageId={pageId}
              pageType={pageType}
              localities={localities}
              path={`pageBuilder[_key=="${block._key}"]content[_key=="${contentBlock._key}"]`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
