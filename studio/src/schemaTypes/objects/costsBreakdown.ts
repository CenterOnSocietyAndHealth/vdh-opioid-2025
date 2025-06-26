import {defineField, defineType} from 'sanity'
import {BarChartIcon} from '@sanity/icons'

export const costsBreakdown = defineType({
  name: 'costsBreakdown',
  title: 'Costs Breakdown',
  type: 'object',
  icon: BarChartIcon,
  fields: [
    defineField({
      name: 'totalCost',
      title: 'Total Cost',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'totalCostSubtitle',
      title: 'Total Cost Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
    }),
    defineField({
      name: 'updatedLast',
      title: 'Updated Last',
      type: 'date',
    }),
    defineField({
      name: 'aside',
      title: 'Aside',
      type: 'blockContent',
    }),
    defineField({
      name: 'costSectors',
      title: 'Cost Sectors',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'subtitle',
              title: 'Subtitle',
              type: 'string',
            }),
            defineField({
              name: 'value',
              title: 'Value',
              type: 'number',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'color',
              title: 'Color',
              type: 'string',
              validation: (Rule) => Rule.required(),
              initialValue: '#4B7CB4',
            }),
            defineField({
              name: 'textColor',
              title: 'Text Color',
              type: 'string',
              description: 'Color of text in the sector (defaults to white if not specified)',
              initialValue: '#FFFFFF',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'string',
            }),
            defineField({
              name: 'showLabelAsTooltip',
              title: 'Show Label as Tooltip Only',
              type: 'boolean',
              initialValue: false,
              description: 'If true, the label will only appear as a tooltip on the chart.',
            }),
          ],
          preview: {
            select: {
              title: 'title',
              subtitle: 'subtitle',
              value: 'value',
            },
            prepare({ title, subtitle, value }) {
              return {
                title: title || 'Untitled Sector',
                subtitle: subtitle ? `${subtitle} - $${value?.toLocaleString() || 0}` : `$${value?.toLocaleString() || 0}`,
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
      totalCost: 'totalCost',
      sectors: 'costSectors',
    },
    prepare({ totalCost, sectors }) {
      return {
        title: 'Costs Breakdown',
        subtitle: totalCost ? `Total: ${totalCost}` : `${sectors?.length || 0} sectors`,
        media: BarChartIcon
      }
    },
  },
}) 