'use client';

import React, { useState } from 'react';
import { PortableText } from 'next-sanity';

// Define the component props interface
export interface SourcesAccordionProps {
  title?: string;
  sources?: any[]; // WYSIWYG content (PortableText blocks)
  backgroundColor?: string; // CSS class for background color
}

export default function SourcesAccordion({ 
  title = "Sources",
  sources,
  backgroundColor = "bg-white"
}: SourcesAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`sources-accordion ${backgroundColor} overflow-hidden`}>
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
        <div className="pt-4 pb-6">
          {/* Sources Section */}
          {sources && (
            <div className="relative">
              {/* Left indent border */}
                <div className="absolute left-0 top-0 bottom-0 w-[10px] bg-[#D9D9D9]"></div>
              
              {/* Content with left padding to account for border */}
              <div className="pl-6">
                {/* Main title */}
                <h3 className="mb-4">Sources</h3>
                
                {/* Sources content */}
                <div className="prose prose-sm max-w-none">
                  <PortableText
                    value={sources}
                    components={{
                      block: {
                        normal: ({ children }: any) => (
                          <p className="text-sm text-gray-700 leading-relaxed mb-3 last:mb-0">
                            {children}
                          </p>
                        ),
                        h1: ({ children }: any) => (
                          <h1 className="text-lg font-bold text-gray-900 mb-3">{children}</h1>
                        ),
                        h2: ({ children }: any) => (
                          <h2 className="text-base font-bold text-gray-900 mb-2">{children}</h2>
                        ),
                        h3: ({ children }: any) => (
                          <h3 className="text-sm font-bold text-gray-900 mb-2">{children}</h3>
                        ),
                        h4: ({ children }: any) => (
                          <h4 className="text-sm font-bold text-gray-900 mb-2">{children}</h4>
                        ),
                      },
                      list: {
                        bullet: ({ children }: any) => (
                          <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
                        ),
                        number: ({ children }: any) => (
                          <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>
                        ),
                      },
                      listItem: {
                        bullet: ({ children }: any) => (
                          <li className="text-sm text-gray-700 leading-relaxed ml-4">{children}</li>
                        ),
                        number: ({ children }: any) => (
                          <li className="text-sm text-gray-700 leading-relaxed ml-4">{children}</li>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
