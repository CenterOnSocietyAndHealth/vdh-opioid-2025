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
      name: 'chartDescription',
      title: 'Chart Description',
      type: 'blockContent',
      description: 'WYSIWYG description content for the data table accordion. This will appear in the "Data Table/This Chart Described" section.',
    }),
    defineField({
      name: 'sources',
      title: 'Sources',
      type: 'blockContent',
      description: 'WYSIWYG sources content that will appear in the Sources accordion below the data table.',
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
      name: 'asideLink',
      title: 'Aside Link',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Link Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'url',
          title: 'URL',
          type: 'string',
          description: 'Enter a custom URL (e.g., https://example.com)',
        }),
        defineField({
          name: 'internalPage',
          title: 'Internal Page',
          type: 'reference',
          to: [{ type: 'page' }],
          description: 'Select an internal page from your site',
        }),
      ],
      validation: (Rule) => Rule.custom((fields) => {
        if (!fields?.title) {
          return 'Link text is required';
        }
        if (!fields?.url && !fields?.internalPage) {
          return 'Either URL or Internal Page must be provided';
        }
        if (fields?.url && fields?.internalPage) {
          return 'Please provide either URL or Internal Page, not both';
        }
        return true;
      }),
    }),
    defineField({
      name: 'mobileAside',
      title: 'Mobile Aside',
      type: 'blockContent',
      description: 'WYSIWYG content that appears only on mobile devices between the title section and the sector list.',
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