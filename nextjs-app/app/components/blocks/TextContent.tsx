import { PortableText } from '@portabletext/react'
import imageUrlBuilder from '@sanity/image-url'
import { client } from '@/sanity/lib/client'
import { useEffect, useState } from 'react'
import { TextContentProps } from '@/app/types/locality'

const urlForImage = (source: any) => {
  return imageUrlBuilder(client).image(source)
}

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

const alignmentMap = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

const getNestedValue = (obj: any, path: string) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj)
}

export default function TextContent({ block, selectedLocality }: TextContentProps) {
  const { 
    content, 
    marginTop = 'none', 
    marginBottom = 'none', 
    isAside = false, 
    backgroundColor = '#f0f0f0',
    textAlignment = 'left',
    maxWidth
  } = block

  // Validate and sanitize backgroundColor to prevent corruption
  const sanitizedBackgroundColor = typeof backgroundColor === 'string' && 
    backgroundColor.match(/^#[0-9A-Fa-f]{6}$/) ? backgroundColor : '#f0f0f0'
  
  // Validate margin values to prevent undefined classes
  const validMarginTop = marginTop && marginMap[marginTop] ? marginTop : 'none'
  const validMarginBottom = marginBottom && marginBottomMap[marginBottom] ? marginBottom : 'none'
  
  // Validate text alignment to prevent undefined classes
  const validTextAlignment = textAlignment && alignmentMap[textAlignment as keyof typeof alignmentMap] ? textAlignment : 'left'
  const [isUpdating, setIsUpdating] = useState(false)

  // Listen for locality updates
  useEffect(() => {
    const handleUpdateStart = () => setIsUpdating(true)
    const handleUpdateEnd = () => setIsUpdating(false)

    window.addEventListener('localityUpdateStart', handleUpdateStart)
    window.addEventListener('localityUpdateEnd', handleUpdateEnd)

    return () => {
      window.removeEventListener('localityUpdateStart', handleUpdateStart)
      window.removeEventListener('localityUpdateEnd', handleUpdateEnd)
    }
  }, [])

  console.log('TextContent block:', { marginTop, marginBottom, isAside, backgroundColor, textAlignment, maxWidth })
  console.log('Margin classes:', { 
    topClass: marginMap[validMarginTop], 
    bottomClass: marginBottomMap[validMarginBottom] 
  })
  console.log('Text alignment:', { 
    original: textAlignment, 
    valid: validTextAlignment, 
    class: alignmentMap[validTextAlignment] 
  })
  
  return (
    <div className={`${marginMap[validMarginTop]} ${marginBottomMap[validMarginBottom]}`}>
      <div 
        className={`content-container ${isAside ? 'p-[35px_30px] aside' : ''} ${alignmentMap[validTextAlignment]}`} 
        style={{
          ...(isAside ? { backgroundColor: sanitizedBackgroundColor } : {}),
          ...(maxWidth ? { maxWidth: `${maxWidth}px`, marginLeft: 'auto', marginRight: 'auto' } : {})
        }}
      >
        <PortableText
          value={content}
          components={{
            types: {
              image: ({ value }) => {
                if (!value?.asset?._ref) {
                  return null
                }
                return (
                  <img
                    src={urlForImage(value).url()}
                    alt={value.alt || ' '}
                    loading="lazy"
                  />
                )
              },
            },
            marks: {
              smallGrayText: ({ children }) => (
                <span style={{
                  color: '#747474',
                  fontFamily: 'Inter',
                  fontSize: '14px',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  lineHeight: '130%',
                  letterSpacing: '-0.266px',
                }}>
                  {children}
                </span>
              ),
              localityField: ({ children, value }) => {
                if (!selectedLocality || !value.fieldPath) {
                  return children
                }
                const fieldValue = getNestedValue(selectedLocality, value.fieldPath)
                if (fieldValue === undefined) {
                  return children
                }

                // Format the value based on the field type
                let displayValue = fieldValue
                if (typeof fieldValue === 'number') {
                  if (value.fieldPath.includes('PerCapita')) {
                    displayValue = `$${fieldValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                  } else if (value.fieldPath.includes('Total')) {
                    displayValue = `$${fieldValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                  } else if (value.fieldPath.includes('Pct')) {
                    displayValue = `${fieldValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`
                  } else if (value.fieldPath.includes('Population')) {
                    displayValue = fieldValue.toLocaleString()
                  } else if (value.fieldPath.includes('Income')) {
                    displayValue = `$${fieldValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                  } else if (value.fieldPath.includes('Percentile')) {
                    displayValue = `${fieldValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`
                  } else if (value.fieldPath.includes('Comparison')) {
                    displayValue = `${fieldValue}`
                  } else {
                    displayValue = fieldValue.toLocaleString()
                  }
                }

                // Transform text case if specified
                if (typeof displayValue === 'string' && value.textCase) {
                  switch (value.textCase) {
                    case 'capitalize':
                      displayValue = displayValue.split(' ').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                      ).join(' ')
                      break
                    case 'lowercase':
                      displayValue = displayValue.toLowerCase()
                      break
                  }
                }

                // Add article if requested
                if (value.addArticle && typeof displayValue === 'string') {
                  const firstChar = displayValue.toLowerCase().charAt(0)
                  const article = ['a', 'e', 'i', 'o', 'u'].includes(firstChar) ? 'an' : 'a'
                  displayValue = `${article} ${displayValue}`
                }

                return (
                  <span className={`${isUpdating ? 'animate-pulse' : ''}`}>
                    {isUpdating ? '...' : displayValue}
                  </span>
                )
              },
            },
          }}
        />
      </div>
    </div>
  )
} 