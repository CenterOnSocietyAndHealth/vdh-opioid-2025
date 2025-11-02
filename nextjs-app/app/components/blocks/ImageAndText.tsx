"use client"

import React from 'react'
import BlockRenderer from '../BlockRenderer'
import imageUrlBuilder from '@sanity/image-url'
import { client } from '@/sanity/lib/client'
import Image from 'next/image'
import { Locality } from '@/app/types/locality'
import { getValidKeyOrDefault } from '@/app/client-utils'

const urlForImage = (source: any) => {
  return imageUrlBuilder(client).image(source)
}

type ImageAndTextProps = {
  block: {
    image: {
      asset: {
        _ref: string
      }
      alt?: string
      caption?: string
    }
    imagePosition: 'left' | 'right'
    imageWidth?: number
    textWidth?: number
    textContent: any[]
    hasShadow?: boolean
    marginTop?: 'none' | 'small' | 'medium' | 'large'
    marginBottom?: 'none' | 'small' | 'medium' | 'large'
    maxWidth?: number
    sectionId?: string
  }
  pageId: string
  pageType: string
  localities?: Locality[]
  path?: string
}

const marginMap = {
  none: 'mt-0',
  small: 'mt-[10px]',
  medium: 'mt-[30px]',
  large: 'mt-[60px]',
}

const marginBottomMap = {
  none: 'mb-0',
  small: 'mb-[10px]',
  medium: 'mb-[30px]',
  large: 'mb-[60px]',
}

export default function ImageAndText({ block, pageId, pageType, localities, path }: ImageAndTextProps) {
  const {
    image,
    imagePosition = 'left',
    imageWidth,
    textWidth,
    textContent,
    marginTop = 'none',
    marginBottom = 'none',
    maxWidth,
    sectionId,
    hasShadow = false
  } = block

  const validMarginTop = getValidKeyOrDefault(marginTop, marginMap, 'none')
  const validMarginBottom = getValidKeyOrDefault(marginBottom, marginBottomMap, 'none')

  // Calculate column widths - use custom widths if provided, otherwise equal distribution
  const imageColWidth = imageWidth ? `${imageWidth}%` : '50%'
  const textColWidth = textWidth ? `${textWidth}%` : '50%'

  const containerStyle = maxWidth ? { maxWidth: `${maxWidth}px`, margin: '0 auto' } : {}

  if (!image?.asset?._ref) {
    return null
  }

  const imageElement = (
    <div className="p-4 md:p-0">
      <Image
        src={urlForImage(image).url()}
        alt={image.alt || ''}
        width={800}
        height={600}
        className={`w-auto h-auto max-w-full ${hasShadow ? 'shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]' : ''}`}
        priority={false}
      />
      {image.caption && (
        <div 
          className="w-full py-5 px-4 mt-4"
          style={{
            backgroundColor: '#F3F2EC',
            fontFamily: 'Inter',
            fontWeight: '400',
            lineHeight: '130%',
          }}
        >
          <p className="text-left text-[14px] font-normal leading-[130%] text-[#1E1E1E] mx-auto mt-0 mb-0 max-w-[600px]">
            {image.caption}
          </p>
        </div>
      )}
    </div>
  )

  const textElement = (
    <div>
      {textContent?.map((childBlock: any, index: number) => {
        const renderedBlock = (
          <BlockRenderer
            key={childBlock._key || index}
            block={childBlock}
            index={index}
            pageId={pageId}
            pageType={pageType}
            localities={localities}
            path={`${path}.textContent[_key=="${childBlock._key}"]`}
          />
        )
        
        // Wrap ImageBlock components with px-4 padding on mobile only
        if (childBlock._type === 'imageBlock') {
          return (
            <div key={childBlock._key || index} className="px-4 md:px-0">
              {renderedBlock}
            </div>
          )
        }
        
        return renderedBlock
      })}
    </div>
  )

  return (
    <div 
      id={sectionId}
      className={`${marginMap[validMarginTop as keyof typeof marginMap]} ${marginBottomMap[validMarginBottom as keyof typeof marginBottomMap]}`}
      style={containerStyle}
    >
      {/* Mobile: Always stack with image on top */}
      <div className="flex flex-col md:hidden -mx-4">
        <div className="w-full px-4">
          {imageElement}
        </div>
        <div className="w-full px-4">
          {textElement}
        </div>
      </div>

      {/* Desktop: Two columns with configurable order */}
      <div className="hidden md:flex md:flex-row -mx-4">
        {imagePosition === 'left' ? (
          <>
            <div className="px-4" style={{ width: imageColWidth }}>
              {imageElement}
            </div>
            <div className="px-4" style={{ width: textColWidth }}>
              {textElement}
            </div>
          </>
        ) : (
          <>
            <div className="px-4" style={{ width: textColWidth }}>
              {textElement}
            </div>
            <div className="px-4" style={{ width: imageColWidth }}>
              {imageElement}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

