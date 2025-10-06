import {defineField, defineType} from 'sanity'

export const povertyIncome = defineType({
  name: 'povertyIncome',
  title: 'Poverty Income',
  type: 'object',
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      description: 'Optional: Add an ID to this section for on-page navigation links (e.g., "section-1", "overview")',
      validation: (Rule) => Rule.regex(/^[a-zA-Z0-9-_]+$/).warning('Please use only letters, numbers, hyphens, and underscores'),
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
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          {title: 'None', value: 'transparent'},
          {title: 'Light Gray', value: '#f0f0f0'},
          {title: 'White', value: '#ffffff'},
          {title: 'Light Blue', value: '#e6f3ff'},
          {title: 'Light Green', value: '#f0f8f0'},
          {title: 'Light Yellow', value: '#fffbf0'},
          {title: 'Custom', value: 'custom'},
        ],
      },
      initialValue: 'transparent',
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
      name: 'povertySource',
      title: 'Poverty Source Number',
      type: 'number',
      description: 'Source number for poverty data citation (e.g., 15)',
      initialValue: 15,
      validation: (Rule) => Rule.min(1).max(99),
    }),
    defineField({
      name: 'medianIncomeSource',
      title: 'Median Income Source Number',
      type: 'number',
      description: 'Source number for median income data citation (e.g., 16)',
      initialValue: 16,
      validation: (Rule) => Rule.min(1).max(99),
    }),
    defineField({
      name: 'statePovertyPct',
      title: 'State Poverty Percentage',
      type: 'number',
      description: 'Virginia state poverty percentage for comparisons',
      initialValue: 9.4,
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'stateMedianIncome',
      title: 'State Median Income',
      type: 'number',
      description: 'Virginia state median income for comparisons (in dollars)',
      initialValue: 91000,
      validation: (Rule) => Rule.min(0),
    }),
  ],
  preview: {
    select: {
      sectionId: 'sectionId',
      povertySource: 'povertySource',
      medianIncomeSource: 'medianIncomeSource'
    },
    prepare({ sectionId, povertySource, medianIncomeSource }) {
      return {
        title: 'Poverty Income',
        subtitle: sectionId ? `ID: ${sectionId}` : `Sources: ${povertySource}, ${medianIncomeSource}`
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
