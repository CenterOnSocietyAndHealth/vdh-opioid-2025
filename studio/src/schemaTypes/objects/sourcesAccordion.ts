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
      description: 'The label on the accordion button (e.g., "Sources", "Data Sources", "References"). This is separate from the heading inside the expanded content.',
      validation: (Rule) => Rule.required(),
      initialValue: 'Sources',
    }),
    defineField({
      name: 'contentTitle',
      title: 'Content Heading',
      type: 'string',
      description: 'Heading shown inside the expanded content, above the source list. Leave empty to use "Sources".',
      initialValue: 'Sources',
      hidden: ({parent}) => parent?.hideContentTitle === true,
    }),
    defineField({
      name: 'hideContentTitle',
      title: 'Hide Content Heading',
      type: 'boolean',
      description: 'Hide the heading inside the expanded content.',
      initialValue: false,
    }),
    defineField({
      name: 'hideLeftBorder',
      title: 'Hide Left Border',
      type: 'boolean',
      description: 'Hide the gray bar along the left side of the sources content.',
      initialValue: false,
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
    defineField({
      name: 'maxWidth',
      title: 'Max Width',
      type: 'number',
      description: 'Set maximum width in pixels (leave empty for full width)',
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
