import {defineField, defineType} from 'sanity'
import { LuLayers } from "react-icons/lu";

export const contentWrapper = defineType({
  name: 'contentWrapper',
  title: 'Content Wrapper',
  type: 'object',
  icon: LuLayers,
  fields: [
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      initialValue: '#f0f0f0',
      options: {
        list: [
          {title: 'Light Gray', value: '#f0f0f0'},
          {title: 'White', value: '#ffffff'},
          {title: 'Light Blue', value: '#e6f3ff'},
          {title: 'Light Green', value: '#f0f8f0'},
          {title: 'Light Yellow', value: '#fffbf0'},
          {title: 'Custom', value: 'custom'},
        ],
      },
    }),
    defineField({
      name: 'customBackgroundColor',
      title: 'Custom Background Color',
      type: 'string',
      description: 'Enter a hex color code (e.g., #ff0000)',
      hidden: ({parent}) => parent?.backgroundColor !== 'custom',
      validation: (Rule) => Rule.regex(/^#[0-9A-Fa-f]{6}$/).warning('Please enter a valid hex color code'),
    }),
    defineField({
      name: 'backgroundWidth',
      title: 'Background Width',
      type: 'string',
      options: {
        list: [
          {title: 'Full Width', value: 'full'},
          {title: 'Container Width', value: 'container'},
          {title: 'Narrow', value: 'narrow'},
        ],
      },
      initialValue: 'container',
    }),
    defineField({
      name: 'contentWidth',
      title: 'Content Width',
      type: 'string',
      options: {
        list: [
          {title: 'Full Width', value: 'full'},
          {title: 'Container Width', value: 'container'},
          {title: 'Narrow', value: 'narrow'},
          {title: 'Custom', value: 'custom'},
        ],
      },
      initialValue: 'container',
    }),
    defineField({
      name: 'customContentWidth',
      title: 'Custom Content Width (px)',
      type: 'number',
      description: 'Set maximum width in pixels for content',
      hidden: ({parent}) => parent?.contentWidth !== 'custom',
    }),
    defineField({
      name: 'padding',
      title: 'Padding',
      type: 'string',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Small', value: 'small'},
          {title: 'Medium', value: 'medium'},
          {title: 'Large', value: 'large'},
        ],
      },
      initialValue: 'medium',
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
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        { type: 'textContent' },
        { type: 'localitySelector' },
        { type: 'costsMaps' },
        { type: 'costsBreakdown' },
        { type: 'accordion' },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      backgroundColor: 'backgroundColor',
      customBackgroundColor: 'customBackgroundColor',
      backgroundWidth: 'backgroundWidth',
      contentWidth: 'contentWidth',
      content: 'content',
    },
    prepare({ backgroundColor, customBackgroundColor, backgroundWidth, contentWidth, content }) {
      const bgColor = backgroundColor === 'custom' ? customBackgroundColor : backgroundColor;
      const contentCount = content?.length || 0;
      
      return {
        title: `Content Wrapper (${contentCount} items)`,
        subtitle: `${backgroundWidth} background, ${contentWidth} content`,
        media: LuLayers,
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
