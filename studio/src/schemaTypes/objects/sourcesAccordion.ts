import {defineField, defineType} from 'sanity'
import { LuFileText } from "react-icons/lu";

export const sourcesAccordion = defineType({
  name: 'sourcesAccordion',
  title: 'Sources Accordion',
  type: 'object',
  icon: LuFileText,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The title displayed in the accordion header (e.g., "Sources", "Data Sources", "References")',
      validation: (Rule) => Rule.required(),
      initialValue: 'Sources',
    }),
    defineField({
      name: 'sources',
      title: 'Sources Content',
      type: 'blockContent',
      description: 'Rich text content for the sources information. This can include headings, paragraphs, lists, and links.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          {title: 'White', value: 'bg-white'},
          {title: 'Light Gray', value: 'bg-gray-50'},
          {title: 'Transparent', value: 'bg-transparent'},
        ],
      },
      initialValue: 'bg-white',
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
  ],
  preview: {
    select: {
      title: 'title',
      sources: 'sources',
    },
    prepare({ title, sources }) {
      // Extract plain text from block content for preview
      const plainText = sources?.find((block: any) => block._type === 'block' && block.style === 'normal')?.children?.[0]?.text || ''
      
      const displayText = plainText ? (plainText.length > 60 ? plainText.substring(0, 60) + '...' : plainText) : 'Sources content'
      
      return {
        title: title || 'Sources Accordion',
        subtitle: displayText,
        media: LuFileText
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
