import {defineField, defineType} from 'sanity'
import { LuChevronDown } from "react-icons/lu";

export const accordion = defineType({
  name: 'accordion',
  title: 'Accordion',
  type: 'object',
  icon: LuChevronDown,
  fields: [
    defineField({
      name: 'title',
      title: 'Accordion Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headingLevel',
      title: 'Heading Level',
      type: 'string',
      options: {
        list: [
          {title: 'Span (default)', value: 'span'},
          {title: 'Heading 2 (H2)', value: 'h2'},
          {title: 'Heading 3 (H3)', value: 'h3'},
          {title: 'Heading 4 (H4)', value: 'h4'},
        ],
      },
      initialValue: 'span',
    }),
    defineField({
      name: 'content',
      title: 'Accordion Content',
      type: 'blockContent',
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
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        title: title || 'Accordion',
        subtitle: 'Expandable content section',
        media: LuChevronDown
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