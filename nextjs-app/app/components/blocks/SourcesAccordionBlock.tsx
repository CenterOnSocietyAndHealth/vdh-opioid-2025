import React from 'react';
import SourcesAccordion from './SourcesAccordion';
import { getValidKeyOrDefault } from '@/app/client-utils';

const marginMap = {
  none: 'mt-0',
  small: 'mt-4',
  medium: 'mt-8',
  large: 'mt-16',
}

const marginBottomMap = {
  none: 'mb-0',
  small: 'mb-4',
  medium: 'mb-8',
  large: 'mb-16',
}

interface SourcesAccordionBlockProps {
  block: {
    _type: 'sourcesAccordion';
    _key: string;
    title?: string;
    sources?: any[];
    backgroundColor?: string;
    marginTop?: string;
    marginBottom?: string;
    maxWidth?: number;
  };
}

export default function SourcesAccordionBlock({ block }: SourcesAccordionBlockProps) {
  const { 
    title = 'Sources', 
    sources, 
    backgroundColor = 'bg-white',
    marginTop = 'none',
    marginBottom = 'none',
    maxWidth
  } = block;

  const safeMarginTop = getValidKeyOrDefault(marginTop, marginMap, 'none');
  const safeMarginBottom = getValidKeyOrDefault(marginBottom, marginBottomMap, 'none');

  return (
    <div 
      className={`${safeMarginTop} ${safeMarginBottom}`}
      style={maxWidth ? { maxWidth: `${maxWidth}px`, marginLeft: 'auto', marginRight: 'auto' } : {}}
    >
      <SourcesAccordion
        title={title}
        sources={sources}
        backgroundColor={backgroundColor}
      />
    </div>
  );
}
