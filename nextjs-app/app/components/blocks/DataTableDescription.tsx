'use client';

import React, { useState } from 'react';
import { PortableText } from 'next-sanity';

// Define column configuration
export interface DataTableColumn {
  key: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  format?: 'currency' | 'percentage' | 'number' | 'text';
}

// Define the data structure for table rows - now flexible with any keys
export interface DataTableRow {
  [key: string]: string | number | undefined;
}

// Define the component props interface
export interface DataTableDescriptionProps {
  title?: string;
  description?: any[]; // WYSIWYG content (PortableText blocks)
  columns?: DataTableColumn[];
  data?: DataTableRow[];
  backgroundColor?: string; // CSS class for background color
  highlightRowId?: string | number; // ID of row to highlight in bold
}

export default function DataTableDescription({ 
  title = "Data Table/This Chart Described",
  description,
  columns = [
    { key: 'sector', label: 'Sector', align: 'left', format: 'text' },
    { key: 'total', label: 'Total', align: 'right', format: 'currency' },
    { key: 'perCapita', label: 'Per Capita', align: 'right', format: 'currency' },
    { key: 'percentageOfTotal', label: 'Percentage of Total', align: 'right', format: 'percentage' }
  ],
  data = [],
  backgroundColor = "bg-white",
  highlightRowId
}: DataTableDescriptionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Handle column sorting
  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      // Toggle direction if same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to ascending
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  // Get numeric value for sorting
  const getNumericValue = (value: string | number | undefined): number => {
    if (value === undefined || value === null) return 0;
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(numValue) ? 0 : numValue;
  };

  // Sort data based on current sort column and direction
  const sortedData = React.useMemo(() => {
    if (!sortColumn) return data;

    const column = columns.find(col => col.key === sortColumn);
    if (!column) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      // Handle numeric formats (currency, percentage, number)
      if (column.format === 'currency' || column.format === 'percentage' || column.format === 'number') {
        const aNum = getNumericValue(aValue);
        const bNum = getNumericValue(bValue);
        return sortDirection === 'asc' ? aNum - bNum : bNum - aNum;
      }

      // Handle text format
      const aStr = String(aValue || '').toLowerCase();
      const bStr = String(bValue || '').toLowerCase();
      
      if (sortDirection === 'asc') {
        return aStr.localeCompare(bStr);
      } else {
        return bStr.localeCompare(aStr);
      }
    });
  }, [data, sortColumn, sortDirection, columns]);

  // Format values based on column configuration
  const formatValue = (value: string | number | undefined, format: string): string => {
    if (value === undefined || value === null) return '';
    
    switch (format) {
      case 'currency':
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(numValue)) return String(value);
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(numValue);
      
      case 'percentage':
        const percentValue = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(percentValue)) return String(value);
        return `${percentValue}%`;
      
      case 'number':
        const numberValue = typeof value === 'string' ? parseFloat(value) : value;
        if (isNaN(numberValue)) return String(value);
        return new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        }).format(numberValue);
      
      case 'text':
      default:
        return String(value);
    }
  };

  // Generate CSV data for download
  const generateCSVData = (): string => {
    const headers = columns.map(col => col.label);
    const csvRows = [headers.join(',')];
    
    data.forEach(row => {
      const csvRow = columns.map(col => {
        const value = row[col.key];
        const formattedValue = formatValue(value, col.format || 'text');
        return `"${formattedValue}"`;
      });
      csvRows.push(csvRow.join(','));
    });
    
    return csvRows.join('\n');
  };

  // Download CSV function
  const downloadCSV = () => {
    const csvData = generateCSVData();
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'data-table.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className={`chart-description ${backgroundColor} overflow-hidden`}>
      {/* Accordion Header */}
      <button
        onClick={toggleExpanded}
        className={`w-full px-0 py-2 flex items-start justify-start text-left border-b border-[#78787878] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset transition-colors duration-200 ${isExpanded ? 'border-b border-[#78787800]' : ''}`}
      >
        <span className="text-[12px] font-[400] text-[#1E1E1E] mr-2">{title}</span>
        
        {/* Chevron Icon */}
        <svg
          className={`w-4 h-4 text-[#414141] transition-transform duration-200 mt-1 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 9l-7 7-7-7" 
          />
        </svg>
      </button>

      {/* Accordion Content */}
      <div
        className={`overflow-hidden transition-all duration-1000 ease-in-out ${
          isExpanded ? 'max-h-[2000px] border-b border-[#78787878]' : 'max-h-0'
        }`}
      >
        <div className="pt-4 pb-6 space-y-6">
          {/* Chart Description Section */}
          {description && (
            <div>
              <div className="prose prose-sm max-w-none columns-1 md:columns-2 gap-6">
                <PortableText
                  value={description}
                  components={{
                    block: {
                      normal: ({ children }: any) => (
                        <p className="text-sm text-gray-700 leading-relaxed mb-3 last:mb-0">
                          {children}
                        </p>
                      ),
                    },
                    marks: {
                      link: ({ children, value }: any) => (
                        <a
                          href={value?.href}
                          target={value?.blank ? '_blank' : undefined}
                          rel={value?.blank ? 'noopener noreferrer' : undefined}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {children}
                        </a>
                      ),
                      strong: ({ children }: any) => (
                        <strong className="font-semibold">{children}</strong>
                      ),
                      em: ({ children }: any) => (
                        <em className="italic">{children}</em>
                      ),
                    },
                  }}
                />
              </div>
            </div>
          )}

          {/* Data Table Section */}
          {data.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-gray-900">Data Table</h3>
                
                {/* Download Button */}
                <button
                  onClick={downloadCSV}
                  className="flex items-center gap-2 px-2 py-1 bg-[#F2F1F1] hover:bg-gray-200 text-[#1E1E1E] rounded-[3px] border border-[#DBDBDB] text-[14px] font-[500] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M5 21H19V19H5M19 10H15V4H9V10H5L12 17L19 10Z" fill="#414141" />
                  </svg>
                  Download Data
                </button>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      {columns.map((column) => (
                        <th 
                          key={column.key}
                          className={`py-2 px-1 cursor-pointer hover:bg-gray-100 transition-colors duration-150 ${
                            column.align === 'right' ? 'text-right' : 
                            column.align === 'center' ? 'text-center' : 
                            'text-left'
                          }`}
                          style={{
                            color: '#000',
                            fontFamily: 'Inter',
                            fontSize: '14px',
                            fontStyle: 'normal',
                            fontWeight: '600',
                            lineHeight: '118%',
                            letterSpacing: '-0.266px'
                          }}
                          onClick={() => handleSort(column.key)}
                        >
                          <div className={`flex items-center gap-1 ${
                            column.align === 'right' ? 'justify-end' : 
                            column.align === 'center' ? 'justify-center' : 
                            'justify-start'
                          }`}>
                            <span>{column.label}</span>
                            {/* Sort indicator */}
                            <span className="inline-flex flex-col w-3 h-4">
                              {sortColumn === column.key ? (
                                sortDirection === 'asc' ? (
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" />
                                  </svg>
                                ) : (
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" />
                                  </svg>
                                )
                              ) : (
                                <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" />
                                </svg>
                              )}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedData.map((row, index) => {
                      const isHighlighted = highlightRowId !== undefined && row.id === highlightRowId;
                      return (
                        <tr
                          key={index}
                          className={`border-b border-gray-100 ${
                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }`}
                        >
                          {columns.map((column) => (
                            <td 
                              key={column.key}
                              className={`py-0 px-1 ${
                                column.align === 'right' ? 'text-right' : 
                                column.align === 'center' ? 'text-center' : 
                                'text-left'
                              }`}
                              style={{
                                color: '#1E1E1E',
                                fontFamily: 'Inter',
                                fontSize: '14px',
                                fontStyle: 'normal',
                                fontWeight: isHighlighted ? '700' : '400',
                                lineHeight: '289%'
                              }}
                            >
                              {formatValue(row[column.key], column.format || 'text')}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
