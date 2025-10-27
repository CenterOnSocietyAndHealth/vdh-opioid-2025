import { BlockQuoteProps } from '@/app/types/locality'
import { getValidKeyOrDefault } from '@/app/client-utils'
import { PortableText } from 'next-sanity'

const marginMap = {
  none: 'mt-0',
  small: 'mt-[10px]',
  medium: 'mt-[30px]',
  large: 'mt-[60px]',
}

const marginBottomMap = {
  none: 'mb-0',
  small: 'mb-[10px]',
  medium: 'mb-[30px]',
  large: 'mb-[60px]',
}

const alignmentMap = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

export default function BlockQuote({ block }: BlockQuoteProps) {
  const { quote, byline, marginTop = 'none', marginBottom = 'none', textAlignment = 'left', maxWidth } = block

  const validMarginTop = getValidKeyOrDefault(marginTop, marginMap, 'none')
  const validMarginBottom = getValidKeyOrDefault(marginBottom, marginBottomMap, 'none')
  const validTextAlignment = getValidKeyOrDefault(textAlignment, alignmentMap, 'left')

  return (
    <div className={`px-4 md:px-0 ${marginMap[validMarginTop as keyof typeof marginMap]} ${marginBottomMap[validMarginBottom as keyof typeof marginBottomMap]}`}>
      <blockquote 
        className={`${alignmentMap[validTextAlignment as keyof typeof alignmentMap]}`}
        style={{
          backgroundColor: '#F3F2EC',
          padding: '40px',
          margin: 0,
          ...(maxWidth ? { maxWidth: `${maxWidth}px`, marginLeft: 'auto', marginRight: 'auto' } : {})
        }}
      >
        {quote && (
          <PortableText
            value={quote}
            components={{
              block: {
                normal: ({ children }) => (
                  <p
                    style={{
                      fontSize: '20px',
                      lineHeight: '150%',
                      color: '#1e1e1e',
                      fontFamily: '"Merriweather Light", "Merriweather", serif',
                      fontWeight: 300,
                    }}
                  >
                    {children}
                  </p>
                ),
              },
              marks: {
                strong: ({ children }) => <strong>{children}</strong>,
                em: ({ children }) => <em>{children}</em>,
              },
            }}
          />
        )}
        {byline && (
          <footer
            style={{
              fontSize: '14px',
              lineHeight: '120%',
              color: '#1E1E1E',
              fontFamily: 'Inter, Roboto, "Helvetica Neue", "Arial Nova", sans-serif',
              fontWeight: 400,
              marginTop: '16px',
            }}
          >
            {byline}
          </footer>
        )}
      </blockquote>
    </div>
  )
}

