import React from 'react';
import BlockRenderer from '../BlockRenderer';
import { Locality } from '@/app/types/locality';

type ColumnLayoutProps = {
  block: {
    columns: 2 | 3;
    column1: any[];
    column2: any[];
    column3?: any[];
    column1Width?: number;
    column2Width?: number;
    column3Width?: number;
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

export default function ColumnLayout({ block, pageId, pageType, localities, path }: ColumnLayoutProps) {
  const { 
    columns, 
    column1, 
    column2, 
    column3, 
    column1Width, 
    column2Width, 
    column3Width,
    marginTop = 'medium', 
    marginBottom = 'medium', 
    maxWidth 
  } = block;

  // Calculate column widths - use custom widths if provided, otherwise equal distribution
  const getColumnWidth = (columnIndex: number, customWidth?: number) => {
    if (customWidth) {
      return `${customWidth}%`;
    }
    // Default to equal distribution
    return `${100 / columns}%`;
  };

  const column1Style = { width: getColumnWidth(1, column1Width) };
  const column2Style = { width: getColumnWidth(2, column2Width) };
  const column3Style = columns === 3 ? { width: getColumnWidth(3, column3Width) } : {};

  const containerStyle = maxWidth ? { maxWidth: `${maxWidth}px`, margin: '0 auto' } : {};

  return (
    <div className={`${marginMap[marginTop]} ${marginBottomMap[marginBottom]}`}>
      <div className="flex flex-wrap -mx-4" style={containerStyle}>
        <div className="px-4" style={column1Style}>
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
        <div className="px-4" style={column2Style}>
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
          <div className="px-4" style={column3Style}>
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