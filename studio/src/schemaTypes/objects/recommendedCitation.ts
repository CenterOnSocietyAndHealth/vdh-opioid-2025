import {defineField, defineType} from 'sanity'
import {LuCopy} from 'react-icons/lu'

export const recommendedCitation = defineType({
  name: 'recommendedCitation',
  title: 'Recommended Citation',
  type: 'object',
  icon: LuCopy,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Heading displayed above the citation text',
      validation: (Rule) => Rule.required(),
      initialValue: 'Recommended Citation',
    }),
    defineField({
      name: 'citation',
      title: 'Citation Text',
      type: 'text',
      rows: 4,
      description: 'The text that will be displayed and copied to the clipboard',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'marginTop',
      title: 'Margin Top',
      type: 'string',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Small - 10px', value: 'small'},
          {title: 'Medium - 30px', value: 'medium'},
          {title: 'Large - 60px', value: 'large'},
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
          {title: 'Small - 10px', value: 'small'},
          {title: 'Medium - 30px', value: 'medium'},
          {title: 'Large - 60px', value: 'large'},
        ],
      },
      initialValue: 'none',
    }),
    defineField({
      name: 'maxWidth',
      title: 'Max Width (px)',
      type: 'number',
      description: 'Optional maximum width for the full block (defaults to 672px)',
      initialValue: 672,
      validation: (Rule) => Rule.positive().integer(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      citation: 'citation',
      maxWidth: 'maxWidth',
    },
    prepare({title, citation, maxWidth}) {
      const truncatedCitation =
        citation && citation.length > 60 ? `${citation.slice(0, 60)}…` : citation || 'No citation text'

      return {
        title: title || 'Recommended Citation',
        subtitle: maxWidth ? `${truncatedCitation} • Max width: ${maxWidth}px` : truncatedCitation,
        media: LuCopy,
      }
    },
  },
})

