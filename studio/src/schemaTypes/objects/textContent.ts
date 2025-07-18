import {defineField, defineType} from 'sanity'
import { LuLetterText } from "react-icons/lu";



export const textContent = defineType({
  name: 'textContent',
  title: 'Text Content',
  type: 'object',
  icon: LuLetterText,
  fields: [
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'textAlignment',
      title: 'Text Alignment',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
          {title: 'Right', value: 'right'},
        ],
      },
      initialValue: 'left',
    }),
    defineField({
      name: 'isAside',
      title: 'Display as Aside',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      initialValue: '#f0f0f0',
      hidden: ({parent}) => !parent?.isAside,
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
      content: 'content',
      isAside: 'isAside'
    },
    prepare({ content, isAside }) {
      // Find the first block that is a heading of any type
      const firstHeading = content?.find((block: any) => 
        block._type === 'block' && 
        (block.style === 'h1' || block.style === 'h2' || block.style === 'h3' || block.style === 'h4')
      )
      
      if (firstHeading) {
        return {
          title: firstHeading.children?.[0]?.text || 'Text Content',
          subtitle: isAside ? 'Aside' : undefined
        }
      }

      // If no heading found, get first paragraph
      const firstParagraph = content?.find((block: any) => block._type === 'block' && block.style === 'normal')
      if (firstParagraph) {
        const text = firstParagraph.children?.[0]?.text || ''
        return {
          title: text.length > 50 ? text.substring(0, 50) + '...' : text || 'Text Content',
          subtitle: isAside ? 'Aside' : undefined
        }
      }

      return {
        title: 'Text Content',
        subtitle: isAside ? 'Aside' : undefined,
        media: LuLetterText
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