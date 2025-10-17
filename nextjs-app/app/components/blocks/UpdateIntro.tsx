"use client"

import React from 'react'
import Link from 'next/link'
import { getValidKeyOrDefault } from '@/app/client-utils'

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

export type UpdateIntroProps = {
  block: {
    introText?: string;
    dateUpdated?: string;
    marginTop?: 'none' | 'small' | 'medium' | 'large';
    marginBottom?: 'none' | 'small' | 'medium' | 'large';
    maxWidth?: number;
    displayOnMobile?: boolean;
    displayOnDesktop?: boolean;
  };
};

export default function UpdateIntro({ block }: UpdateIntroProps) {
  const {
    introText = '',
    dateUpdated = '',
    marginTop = 'none',
    marginBottom = 'none',
    maxWidth,
    displayOnMobile = true,
    displayOnDesktop = true
  } = block

  // Validate margin values to prevent undefined classes
  const validMarginTop = getValidKeyOrDefault(marginTop, marginMap, 'none')
  const validMarginBottom = getValidKeyOrDefault(marginBottom, marginBottomMap, 'none')

  // Build responsive display classes
  const displayClasses = []
  if (displayOnMobile && !displayOnDesktop) {
    displayClasses.push('block md:hidden')
  } else if (!displayOnMobile && displayOnDesktop) {
    displayClasses.push('hidden md:block')
  } else if (!displayOnMobile && !displayOnDesktop) {
    displayClasses.push('hidden')
  } else {
    displayClasses.push('block')
  }

  return (
    <div 
      className={`${marginMap[validMarginTop as keyof typeof marginMap]} ${marginBottomMap[validMarginBottom as keyof typeof marginBottomMap]} ${maxWidth ? 'mx-auto' : ''} ${displayClasses.join(' ')}`}
      {...(maxWidth && { style: { maxWidth: `${maxWidth}px` } })}
    >
      <div className="text-center text-[#747474] text-xs font-normal leading-[130%] tracking-[-0.228px]" style={{ fontFamily: 'Inter, sans-serif' }}>
        <p className={`text-xs ${displayOnMobile ? 'mb-0' : 'mb-2'}`}>{introText}</p>
        <p className="text-xs"><Link href='/whats-new'>Updated {dateUpdated}</Link></p>
      </div>
    </div>
  )
}
