"use client"

import React from 'react'
import { getValidKeyOrDefault, getValidHexColorOrDefault } from '@/app/client-utils'
import { HorizontalRuleProps } from '@/app/types/locality'

const marginMap = {
  none: 'mt-0',
  small: 'mt-[20px]',
  medium: 'mt-[30px]',
  large: 'mt-[60px]',
}

const marginBottomMap = {
  none: 'mb-0',
  small: 'mb-[20px]',
  medium: 'mb-[30px]',
  large: 'mb-[60px]',
}

export default function HorizontalRule({ block }: HorizontalRuleProps) {
  const {
    width = 895,
    thickness = 1,
    color = '#E6E6E6',
    customColor,
    marginTop = 'none',
    marginBottom = 'none'
  } = block

  // Validate and sanitize color
  const finalColor = color === 'custom' && customColor 
    ? getValidHexColorOrDefault(customColor, '#E6E6E6')
    : getValidHexColorOrDefault(color, '#E6E6E6')
  
  // Validate margin values to prevent undefined classes
  const validMarginTop = getValidKeyOrDefault(marginTop, marginMap, 'none')
  const validMarginBottom = getValidKeyOrDefault(marginBottom, marginBottomMap, 'none')

  return (
    <div className={`${marginMap[validMarginTop as keyof typeof marginMap]} ${marginBottomMap[validMarginBottom as keyof typeof marginBottomMap]} flex justify-center`}>
      <div
        style={{
          width: `${width}px`,
          height: `${thickness}px`,
          backgroundColor: finalColor,
        }}
        className="block"
      />
    </div>
  )
}
