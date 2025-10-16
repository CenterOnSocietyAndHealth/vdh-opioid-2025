import {defineField, defineType} from 'sanity'
import { LuCalendar } from "react-icons/lu";

export const updateIntro = defineType({
  name: 'updateIntro',
  title: 'Update Intro',
  type: 'object',
  icon: LuCalendar,
  fields: [
    defineField({
      name: 'introText',
      title: 'Intro Text',
      type: 'string',
      description: 'The main introduction text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'dateUpdated',
      title: 'Date Updated',
      type: 'string',
      description: 'The date when the content was last updated',
      validation: (Rule) => Rule.required(),
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
    defineField({
      name: 'displayOnMobile',
      title: 'Display on Mobile',
      type: 'boolean',
      description: 'Show this component on mobile devices',
      initialValue: true,
    }),
    defineField({
      name: 'displayOnDesktop',
      title: 'Display on Desktop',
      type: 'boolean',
      description: 'Show this component on desktop devices',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      introText: 'introText',
      dateUpdated: 'dateUpdated'
    },
    prepare({ introText, dateUpdated }) {
      return {
        title: 'Update Intro',
        subtitle: introText ? `${introText.substring(0, 50)}${introText.length > 50 ? '...' : ''}` : 'No intro text',
        media: LuCalendar
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
