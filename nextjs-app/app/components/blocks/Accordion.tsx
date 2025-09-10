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
  const { title, content, headingLevel = 'span', marginTop = 'none', marginBottom = 'none' } = block
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleAccordion = () => {
    setIsExpanded(!isExpanded)
  }

  const renderTitle = () => {
    const titleContent = <span className="font-[18px] font-medium">{title}</span>
    
    switch (headingLevel) {
      case 'h2':
        return <h2 className="font-medium text-black">{title}</h2>
      case 'h3':
        return <h3 className="font-medium text-black">{title}</h3>
      case 'h4':
        return <h4 className="font-medium text-black">{title}</h4>
      default:
        return titleContent
    }
  }

  return (
    <div className={`${marginMap[marginTop]} ${marginBottomMap[marginBottom]}`}>
      <div className="">
        {/* Accordion Header */}
        <button
          onClick={toggleAccordion}
          className="w-full px-0 py-3 pt-5 flex items-center justify-between text-left hover:bg-gray-200 transition-colors duration-200"
        >
          <div className="flex items-center space-x-3">
            {/* Plus/X icon */}
            <svg 
              className={`w-[12px] h-[12px] text-black flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-45' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            {/* Title */}
            {renderTitle()}
          </div>
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
          <div className="px-0 py-4">
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
                  link: ({ children, value }) => {
                    // Debug: log the value to see what we're getting
                    console.log('Link mark value:', value)
                    
                    // Handle citation links
                    if (value?.citationId) {
                      return (
                        <a
                          href={`#${value.citationId}`}
                          className="text-blue-600 hover:text-blue-800 no-underline cursor-pointer font-medium"
                          style={{ 
                            fontSize: '0.75em',
                            verticalAlign: 'super',
                            textDecoration: 'none'
                          }}
                          onClick={(e) => {
                            e.preventDefault()
                            // Dispatch custom event to open sources accordion
                            const event = new CustomEvent('openSourcesAccordion', {
                              detail: { citationId: value.citationId }
                            })
                            window.dispatchEvent(event)
                          }}
                        >
                          {children}
                        </a>
                      )
                    }
                    // Handle regular links
                    return (
                      <a 
                        href={value?.href} 
                        className="text-blue-600 hover:text-blue-800 underline"
                        target={value?.blank ? '_blank' : undefined}
                        rel={value?.blank ? 'noopener noreferrer' : undefined}
                      >
                        {children}
                      </a>
                    )
                  },
                  citation: ({ children, value }) => {
                    // Debug: log the citation value
                    console.log('Citation mark value:', value)
                    
                    return (
                      <a
                        href={`#${value?.citationId || 'source-01'}`}
                        className="text-blue-600 hover:text-blue-800 no-underline cursor-pointer font-medium"
                        style={{ 
                          fontSize: '0.75em',
                          verticalAlign: 'super',
                          textDecoration: 'none'
                        }}
                        onClick={(e) => {
                          e.preventDefault()
                          // Dispatch custom event to open sources accordion
                          const event = new CustomEvent('openSourcesAccordion', {
                            detail: { citationId: value?.citationId || 'source-01' }
                          })
                          window.dispatchEvent(event)
                        }}
                      >
                        {children}
                      </a>
                    )
                  },
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