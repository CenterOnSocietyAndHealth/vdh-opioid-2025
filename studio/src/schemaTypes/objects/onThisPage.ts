import {defineField, defineType} from 'sanity'
import { LuList } from "react-icons/lu";

export const onThisPage = defineType({
  name: 'onThisPage',
  title: 'On This Page',
  type: 'object',
  icon: LuList,
  fields: [
    defineField({
      name: 'links',
      title: 'Page Links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'pageLink',
          title: 'Page Link',
          fields: [
            defineField({
              name: 'title',
              title: 'Link Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'destinationId',
              title: 'Destination ID',
              type: 'string',
              description: 'The ID of the element on the page to jump to (e.g., "section-1")',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'title',
              destinationId: 'destinationId',
            },
            prepare({ title, destinationId }) {
              return {
                title: title || 'Untitled Link',
                subtitle: `→ ${destinationId || 'No destination'}`,
              }
            },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
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
      links: 'links',
    },
    prepare({ links }) {
      const linkCount = links?.length || 0
      return {
        title: 'On This Page',
        subtitle: `${linkCount} link${linkCount !== 1 ? 's' : ''}`,
        media: LuList
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
