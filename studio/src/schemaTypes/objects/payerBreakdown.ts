import {defineField, defineType} from 'sanity'
import {BarChartIcon} from '@sanity/icons'

export const payerBreakdown = defineType({
  name: 'payerBreakdown',
  title: 'Payer Breakdown',
  type: 'object',
  icon: BarChartIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'Virginia families and businesses would benefit the most from better outcomes',
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'Opioid Epidemic Costs by Payer for Virginia In 2023',
    }),
    defineField({
      name: 'familiesBusinessesValue',
      title: 'Families & Businesses Value',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
      description: 'Enter the dollar value (e.g., 2680000000 for $2.68B)',
      initialValue: 2680000000,
    }),
    defineField({
      name: 'familiesBusinessesColor',
      title: 'Families & Businesses Color',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: '#4A5D23',
      description: 'Color for the Families & Businesses segment (hex code)',
    }),
    defineField({
      name: 'familiesBusinessesTextColor',
      title: 'Families & Businesses Text Color',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: '#FFFFFF',
      description: 'Color for text in the Families & Businesses segment (hex code)',
    }),
    defineField({
      name: 'federalValue',
      title: 'Federal Value',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
      description: 'Enter the dollar value (e.g., 1650000000 for $1.65B)',
      initialValue: 1650000000,
    }),
    defineField({
      name: 'federalColor',
      title: 'Federal Color',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: '#6B7C32',
      description: 'Color for the Federal segment (hex code)',
    }),
    defineField({
      name: 'federalTextColor',
      title: 'Federal Text Color',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: '#FFFFFF',
      description: 'Color for text in the Federal segment (hex code)',
    }),
    defineField({
      name: 'stateLocalValue',
      title: 'State/Local Value',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
      description: 'Enter the dollar value (e.g., 695000000 for $695M)',
      initialValue: 695000000,
    }),
    defineField({
      name: 'stateLocalColor',
      title: 'State/Local Color',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: '#8B9C42',
      description: 'Color for the State/Local segment (hex code)',
    }),
    defineField({
      name: 'stateLocalTextColor',
      title: 'State/Local Text Color',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: '#FFFFFF',
      description: 'Color for text in the State/Local segment (hex code)',
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
    defineField({
      name: 'chartDescription',
      title: 'Chart Description',
      type: 'blockContent',
      description: 'WYSIWYG description content for the data table accordion. This will appear in the "Chart Description/Data Table" section.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      familiesValue: 'familiesBusinessesValue',
      federalValue: 'federalValue',
      stateLocalValue: 'stateLocalValue',
    },
    prepare({ title, familiesValue, federalValue, stateLocalValue }) {
      const total = (familiesValue || 0) + (federalValue || 0) + (stateLocalValue || 0);
      const familiesPercent = total > 0 ? Math.round(((familiesValue || 0) / total) * 100) : 0;
      return {
        title: title || 'Payer Breakdown',
        subtitle: `Families & Businesses: ${familiesPercent}% | Total: $${(total / 1000000000).toFixed(1)}B`,
        media: BarChartIcon
      }
    },
  },
})
