import React from 'react';
import BlockRenderer from '../BlockRenderer';
import { Locality } from '@/app/types/locality';

type ColumnLayoutProps = {
  block: {
    columns: 2 | 3;
    column1: any[];
    column2: any[];
    column3?: any[];
    marginTop?: 'none' | 'small' | 'medium' | 'large';
    marginBottom?: 'none' | 'small' | 'medium' | 'large';
    maxWidth?: number;
  };
  pageId: string;
  pageType: string;
  localities?: Locality[];
  path: string;
};

const marginMap = {
  none: 'mt-0',
  small: 'mt-4',
  medium: 'mt-8',
  large: 'mt-16',
};

const marginBottomMap = {
  none: 'mb-0',
  small: 'mb-4',
  medium: 'mb-8',
  large: 'mb-16',
};

const columnWidthMap = {
  2: 'w-1/2',
  3: 'w-1/3',
};

export default function ColumnLayout({ block, pageId, pageType, localities, path }: ColumnLayoutProps) {
  const { columns, column1, column2, column3, marginTop = 'medium', marginBottom = 'medium', maxWidth } = block;
  const columnWidth = columnWidthMap[columns];

  const containerStyle = maxWidth ? { maxWidth: `${maxWidth}px`, margin: '0 auto' } : {};

  return (
    <div className={`${marginMap[marginTop]} ${marginBottomMap[marginBottom]}`}>
      <div className="flex flex-wrap -mx-4" style={containerStyle}>
        <div className={`px-4 ${columnWidth}`}>
          {column1?.map((childBlock: any, index: number) => (
            <BlockRenderer
              key={childBlock._key}
              block={childBlock}
              index={index}
              pageId={pageId}
              pageType={pageType}
              localities={localities}
              path={`${path}.column1[_key=="${childBlock._key}"]`}
            />
          ))}
        </div>
        <div className={`px-4 ${columnWidth}`}>
          {column2?.map((childBlock: any, index: number) => (
            <BlockRenderer
              key={childBlock._key}
              block={childBlock}
              index={index}
              pageId={pageId}
              pageType={pageType}
              localities={localities}
              path={`${path}.column2[_key=="${childBlock._key}"]`}
            />
          ))}
        </div>
        {columns === 3 && column3 && (
          <div className={`px-4 ${columnWidth}`}>
            {column3.map((childBlock: any, index: number) => (
              <BlockRenderer
                key={childBlock._key}
                block={childBlock}
                index={index}
                pageId={pageId}
                pageType={pageType}
                localities={localities}
                path={`${path}.column3[_key=="${childBlock._key}"]`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}