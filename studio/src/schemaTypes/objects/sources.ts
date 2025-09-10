import {defineField, defineType} from 'sanity'
import CitationItem from '../../components/CitationItem'

export const sources = defineType({
  name: 'sources',
  title: 'Sources',
  type: 'object',
  fields: [
    defineField({
      name: 'citations',
      title: 'Citations',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'citation',
          title: 'Citation',
          fields: [
            defineField({
              name: 'text',
              title: 'Citation Text',
              type: 'blockContent',
              description: 'The citation text with optional links (e.g., "Smith, J. (2024). Study on opioid costs. Journal of Health Economics.")',
              validation: (Rule) => Rule.required(),
            }),
            
          ],
          preview: {
            select: {
              text: 'text',
            },
            prepare({ text }) {
              // Extract plain text from block content for preview
              const plainText = text?.find((block: any) => block._type === 'block' && block.style === 'normal')?.children?.[0]?.text || ''
              
              const displayText = plainText ? (plainText.length > 60 ? plainText.substring(0, 60) + '...' : plainText) : 'Citation'
              
              return {
                title: displayText,
                subtitle: 'Rich text citation',
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1).error('At least one citation is required'),
      options: {
        sortable: true,
      },
      components: {
        item: CitationItem
      }
    }),
    defineField({
      name: 'marginTop',
      title: 'Margin Top',
      type: 'string',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Small', value: 'small'},
          {title: 'Medium', value: 'medium'},
          {title: 'Large', value: 'large'},
        ],
      },
      initialValue: 'none',
    }),
    defineField({
      name: 'marginBottom',
      title: 'Margin Bottom',
      type: 'string',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Small', value: 'small'},
          {title: 'Medium', value: 'medium'},
          {title: 'Large', value: 'large'},
        ],
      },
      initialValue: 'none',
    }),
    defineField({
      name: 'width',
      title: 'Width',
      type: 'number',
      description: 'Set the width of the Sources block in pixels (default: 700px)',
      initialValue: 700,
      validation: (Rule) => Rule.min(200).max(1200).warning('Width should be between 200px and 1200px'),
    }),
  ],
  preview: {
    select: {
      citations: 'citations',
    },
    prepare({ citations }) {
      const count = citations?.length || 0
      return {
        title: 'Sources',
        subtitle: `${count} citation${count !== 1 ? 's' : ''}`,
        media: undefined
      }
    },
  },
  options: {
    modal: {
      type: 'dialog',
      width: 'auto'
    }
  }
})
