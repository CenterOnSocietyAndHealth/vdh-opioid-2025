import {defineField, defineType} from 'sanity'
import { HiPhoto } from "react-icons/hi2";

export const imageAndText = defineType({
  name: 'imageAndText',
  title: 'Image and Text',
  type: 'object',
  icon: HiPhoto,
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      validation: (Rule) => Rule.required(),
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility. Describe what the image shows.',
          validation: (Rule) => Rule.required(),
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
          description: 'Optional caption text to display below the image',
        },
      ],
    }),
    defineField({
      name: 'hasShadow',
      title: 'Add Shadow',
      type: 'boolean',
      description: 'Add a subtle shadow effect to the image',
      initialValue: false,
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image Position',
      type: 'string',
      description: 'Position of the image on desktop (left or right). On mobile, image always appears on top.',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Right', value: 'right'},
        ],
      },
      initialValue: 'left',
    }),
    defineField({
      name: 'imageWidth',
      title: 'Image Column Width (%)',
      type: 'number',
      description: 'Width percentage for the image column on desktop (defaults to 50%)',
      validation: (Rule) => Rule.min(10).max(90).warning('Width should be between 10% and 90%'),
      initialValue: undefined,
    }),
    defineField({
      name: 'textWidth',
      title: 'Text Column Width (%)',
      type: 'number',
      description: 'Width percentage for the text column on desktop (defaults to 50%)',
      validation: (Rule) => Rule.min(10).max(90).warning('Width should be between 10% and 90%'),
      initialValue: undefined,
    }),
    defineField({
      name: 'textContent',
      title: 'Text Content',
      description: 'Add text content blocks (Text Content, Image blocks, etc.)',
      type: 'array',
      of: [
        {
          type: 'textContent',
          options: {
            modal: {
              type: 'dialog',
              width: 'large'
            }
          }
        },
        {
          type: 'imageBlock',
          options: {
            modal: {
              type: 'dialog',
              width: 'auto'
            }
          }
        },
      ],
      validation: (Rule) => Rule.min(1).error('At least one content block is required'),
    }),
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      description: 'Optional: Add an ID to this section for on-page navigation links (e.g., "section-1", "overview")',
      validation: (Rule) => Rule.regex(/^[a-zA-Z0-9-_]+$/).warning('Please use only letters, numbers, hyphens, and underscores'),
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
      title: 'Maximum Width',
      type: 'number',
      description: 'Maximum width in pixels. Leave empty for full width.',
      validation: (Rule) => Rule.min(100).max(2000),
      initialValue: undefined,
    }),
  ],
  preview: {
    select: {
      media: 'image',
      title: 'image.alt',
      imagePosition: 'imagePosition',
      subtitle: 'sectionId'
    },
    prepare({ media, title, imagePosition, subtitle }) {
      return {
        title: title || 'Image and Text',
        subtitle: imagePosition ? `Image ${imagePosition}` : subtitle ? `ID: ${subtitle}` : undefined,
        media: media
      }
    },
  },
  options: {
    collapsible: true,
    collapsed: false,
  }
})

