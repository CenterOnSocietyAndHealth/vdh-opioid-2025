import { PortableText } from '@portabletext/react'
import { TypedObject } from '@portabletext/types'
import imageUrlBuilder from '@sanity/image-url'
import { client } from '@/sanity/lib/client'

const urlForImage = (source: any) => {
  return imageUrlBuilder(client).image(source)
}

type TextContentProps = {
  block: {
    content: TypedObject[]
    marginTop?: 'none' | 'small' | 'medium' | 'large'
    marginBottom?: 'none' | 'small' | 'medium' | 'large'
    isAside?: boolean
    backgroundColor?: string
  }
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

export default function TextContent({ block }: TextContentProps) {
  const { content, marginTop = 'medium', marginBottom = 'medium', isAside = false, backgroundColor = '#b7e3d6' } = block

  return (
    <div className={`${marginMap[marginTop]} ${marginBottomMap[marginBottom]}`}>
      <div className={isAside ? 'p-[35px_30px] aside' : ''} style={isAside ? { backgroundColor } : undefined}>
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
          }}
        />
      </div>
    </div>
  )
} 