import {defineField, defineType} from 'sanity'
import { LuQuote } from "react-icons/lu";

export const blockQuote = defineType({
  name: 'blockQuote',
  title: 'Block Quote',
  type: 'object',
  icon: LuQuote,
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote Text',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'}
            ]
          }
        }
      ],
      validation: (Rule) => Rule.required(),
      description: 'The main quote text (supports bold and italic)',
    }),
    defineField({
      name: 'byline',
      title: 'Byline',
      type: 'string',
      description: 'Optional attribution for the quote (e.g., author name, source)',
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
      name: 'maxWidth',
      title: 'Max Width',
      type: 'number',
      description: 'Set maximum width in pixels (leave empty for full width)',
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
  ],
  preview: {
    select: {
      quote: 'quote',
      byline: 'byline'
    },
    prepare({ quote, byline }) {
      let textContent = '';
      if (Array.isArray(quote)) {
        textContent = quote
          .filter((block) => block._type === 'block')
          .map((block) => block.children?.[0]?.text || '')
          .join('')
      } else if (typeof quote === 'string') {
        textContent = quote;
      }
      
      const truncatedQuote = textContent 
        ? (textContent.length > 50 ? textContent.substring(0, 50) + '...' : textContent)
        : 'No quote text';
      
      return {
        title: truncatedQuote,
        subtitle: byline || 'Block Quote',
        media: LuQuote
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
