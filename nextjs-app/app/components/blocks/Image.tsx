"use client"

import imageUrlBuilder from '@sanity/image-url'
import { client } from '@/sanity/lib/client'
import { ImageProps } from '@/app/types/locality'
import Image from 'next/image'

const urlForImage = (source: any) => {
  return imageUrlBuilder(client).image(source)
}

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

const alignmentMap = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

const imageSizeMap = {
  small: 300,
  medium: 600,
  large: 900,
  full: undefined,
  custom: undefined,
}

// Function to clean corrupted string values by removing invisible Unicode characters
const cleanString = (str: string | undefined): string | undefined => {
  if (typeof str !== 'string') return str
  // Remove invisible Unicode characters that might be causing corruption
  return str.replace(/[\u200B-\u200D\uFEFF\u2060-\u2064\u206A-\u206F]/g, '').trim()
}

export default function ImageBlock({ block }: ImageProps) {
  const { 
    image,
    sectionId,
    marginTop = 'none', 
    marginBottom = 'none', 
    imageAlignment = 'center',
    backgroundColor = 'transparent',
    customBackgroundColor,
    maxWidth,
    imageSize = 'medium',
    customImageWidth
  } = block

  // Clean corrupted string values
  const cleanMarginTop = cleanString(marginTop)
  const cleanMarginBottom = cleanString(marginBottom)
  const cleanImageAlignment = cleanString(imageAlignment)
  const cleanBackgroundColor = cleanString(backgroundColor)
  const cleanImageSize = cleanString(imageSize)

  // Validate and sanitize backgroundColor
  const finalBackgroundColor = cleanBackgroundColor === 'custom' && customBackgroundColor 
    ? (typeof customBackgroundColor === 'string' && customBackgroundColor.match(/^#[0-9A-Fa-f]{6}$/) ? customBackgroundColor : 'transparent')
    : (cleanBackgroundColor === 'transparent' ? 'transparent' : (typeof cleanBackgroundColor === 'string' && cleanBackgroundColor.match(/^#[0-9A-Fa-f]{6}$/) ? cleanBackgroundColor : 'transparent'))
  
  // Validate margin values to prevent undefined classes
  const validMarginTop = cleanMarginTop && marginMap[cleanMarginTop as keyof typeof marginMap] ? cleanMarginTop : 'none'
  const validMarginBottom = cleanMarginBottom && marginBottomMap[cleanMarginBottom as keyof typeof marginBottomMap] ? cleanMarginBottom : 'none'
  
  // Validate image alignment to prevent undefined classes
  const validImageAlignment = cleanImageAlignment && alignmentMap[cleanImageAlignment as keyof typeof alignmentMap] ? cleanImageAlignment : 'center'

  // Determine image width
  let imageWidth: number | undefined
  if (cleanImageSize === 'custom' && customImageWidth) {
    imageWidth = customImageWidth
  } else if (cleanImageSize && imageSizeMap[cleanImageSize as keyof typeof imageSizeMap]) {
    imageWidth = imageSizeMap[cleanImageSize as keyof typeof imageSizeMap]
  }

  if (!image?.asset?._ref) {
    return null
  }

  return (
    <div className={`${marginMap[validMarginTop as keyof typeof marginMap]} ${marginBottomMap[validMarginBottom as keyof typeof marginBottomMap]}`}>
      <div 
        id={sectionId}
        className={`content-container ${alignmentMap[validImageAlignment as keyof typeof alignmentMap]} ${finalBackgroundColor !== 'transparent' ? 'p-[20px_15px]' : ''} ${maxWidth ? 'mx-auto' : ''}`}
        style={{
          ...(finalBackgroundColor !== 'transparent' ? { backgroundColor: finalBackgroundColor } : {}),
          ...(maxWidth ? { maxWidth: `${maxWidth}px` } : {})
        }}
      >
        <div className="image-wrapper">
          <Image
            src={urlForImage(image).url()}
            alt={image.alt || ''}
            width={imageWidth || 800}
            height={imageWidth ? (imageWidth * 0.75) : 600} // Assume 4:3 aspect ratio
            priority={false}
            className={`${imageWidth ? '' : 'w-auto h-auto'} max-w-full`}
          />
          {image.caption && (
            <p className="mt-4 max-w-[600px] mx-auto text-[14px] text-[#000] text-left font-normal">
              {image.caption}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
