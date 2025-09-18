import {defineField, defineType} from 'sanity'
import {BarChartIcon} from '@sanity/icons'

export const localityPayorBreakdown = defineType({
  name: 'localityPayorBreakdown',
  title: 'Locality Payor Breakdown',
  type: 'object',
  icon: BarChartIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'Payor Breakdown by Locality',
    }),
    defineField({
      name: 'maxWidth',
      title: 'Max Width (px)',
      type: 'number',
      validation: (Rule) => Rule.required().min(300).max(1200),
      initialValue: 654,
      description: 'Maximum width of the table in pixels',
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
      initialValue: 'medium',
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
      initialValue: 'medium',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        title: title || 'Locality Payor Breakdown',
        subtitle: 'Table showing payor breakdown by locality',
        media: BarChartIcon
      }
    },
  },
})
