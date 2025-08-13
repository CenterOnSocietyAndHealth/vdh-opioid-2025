import { PortableText } from '@portabletext/react'
import { useState } from 'react'
import { AccordionProps } from '@/app/types/locality'

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

export default function Accordion({ block }: AccordionProps) {
  const { title, content, marginTop = 'none', marginBottom = 'none' } = block
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className={`${marginMap[marginTop]} ${marginBottomMap[marginBottom]}`}>
      <div className="">
        {/* Accordion Header */}
        <button
          onClick={toggleAccordion}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-200 transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            {/* Plus/Minus icon */}
            <svg 
              className="w-5 h-5 text-black flex-shrink-0 transition-transform duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isExpanded ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              )}
            </svg>
            {/* Title */}
            <span className="font-medium text-black">{title}</span>
          </div>
          {/* Chevron icon */}
          <svg 
            className={`w-5 h-5 text-black transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {/* Divider line */}
        <div className="border-t border-gray-300"></div>
        
        {/* Accordion Content */}
        <div
          id={`accordion-content-${title}`}
          className={`overflow-hidden transition-all duration-300 ease-in-out ${
            isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 py-4">
            <PortableText
              value={content}
              components={{
                types: {
                  image: ({ value }) => {
                    if (!value?.asset?._ref) {
                      return null
                    }
                    return (
                      <div className="my-4">
                        <img
                          src={`https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${value.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png').replace('-webp', '.webp')}`}
                          alt={value.alt || ''}
                          className="max-w-full h-auto"
                        />
                      </div>
                    )
                  },
                },
                block: {
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold mb-4">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-bold mb-3">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-bold mb-2">{children}</h3>
                  ),
                  normal: ({ children }) => (
                    <p className="mb-3 leading-relaxed">{children}</p>
                  ),
                },
                marks: {
                  link: ({ children, value }) => (
                    <a 
                      href={value?.href} 
                      className="text-blue-600 hover:text-blue-800 underline"
                      target={value?.blank ? '_blank' : undefined}
                      rel={value?.blank ? 'noopener noreferrer' : undefined}
                    >
                      {children}
                    </a>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic">{children}</em>
                  ),
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
} 