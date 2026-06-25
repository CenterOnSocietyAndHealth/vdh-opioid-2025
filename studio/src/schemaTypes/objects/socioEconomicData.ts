import {defineField, defineType} from 'sanity'
import {LuChartBar} from 'react-icons/lu'

export const socioEconomicData = defineType({
  name: 'socioEconomicData',
  title: 'Socio-Economic Data',
  type: 'object',
  icon: LuChartBar,
  fields: [
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      description:
        'Optional: Add an ID to this section for on-page navigation links (e.g., "section-1", "overview")',
      validation: (Rule) =>
        Rule.regex(/^[a-zA-Z0-9-_]+$/).warning(
          'Please use only letters, numbers, hyphens, and underscores',
        ),
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
      description: 'Set maximum width in pixels (leave empty for default 608px)',
      initialValue: 608,
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'blockContent',
      description:
        'Main heading above the data card. Use the Definition annotation for terms like "Recovery Capital".',
    }),
    defineField({
      name: 'financialSectionLabel',
      title: 'Financial Section Label',
      type: 'string',
      initialValue: 'FINANCIAL',
    }),
    defineField({
      name: 'housingSectionLabel',
      title: 'Housing & Healthcare Section Label',
      type: 'string',
      initialValue: 'HOUSING & HEALTHCARE',
    }),
    defineField({
      name: 'povertyLabel',
      title: 'Poverty Stat Label',
      type: 'string',
      initialValue: 'Live in Poverty',
    }),
    defineField({
      name: 'incomeLabel',
      title: 'Median Income Stat Label',
      type: 'string',
      initialValue: 'Median Household Income',
    }),
    defineField({
      name: 'rentBurdenLabel',
      title: 'Rent Burden Stat Label',
      type: 'string',
      initialValue: 'Spend a Majority of Paycheck on Rent',
    }),
    defineField({
      name: 'uninsuredLabel',
      title: 'Uninsured Stat Label',
      type: 'string',
      initialValue: 'Lack Any Form of Health Insurance',
    }),
    defineField({
      name: 'povertyComparison',
      title: 'Poverty Comparison Sentence',
      type: 'blockContent',
      description:
        'Editable comparison text. Use Locality Field and State Comparison % annotations for dynamic values.',
    }),
    defineField({
      name: 'incomeComparison',
      title: 'Median Income Comparison Sentence',
      type: 'blockContent',
      description:
        'Editable comparison text. Use Locality Field and State Comparison % annotations for dynamic values.',
    }),
    defineField({
      name: 'rentBurdenComparison',
      title: 'Rent Burden Comparison Sentence',
      type: 'blockContent',
      description:
        'Editable comparison text. Use Locality Field, State Comparison %, and Definition annotations.',
    }),
    defineField({
      name: 'uninsuredComparison',
      title: 'Uninsured Comparison Sentence',
      type: 'blockContent',
      description:
        'Editable comparison text. Use Locality Field, State Comparison %, and Definition annotations.',
    }),
    defineField({
      name: 'statePovertyPct',
      title: 'State Poverty Percentage',
      type: 'number',
      description: 'Virginia state poverty percentage for comparisons',
      initialValue: 9.3,
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'stateMedianIncome',
      title: 'State Median Income',
      type: 'number',
      description: 'Virginia state median income for comparisons (in dollars)',
      initialValue: 93170,
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'stateSevereRentBurdenPct',
      title: 'State Severe Rent Burden Percentage',
      type: 'number',
      description: 'Virginia state severe rent burden percentage for comparisons',
      initialValue: 22.5,
      validation: (Rule) => Rule.min(0).max(100),
    }),
    defineField({
      name: 'stateUninsuredPct',
      title: 'State Uninsured Percentage',
      type: 'number',
      description: 'Virginia state uninsured percentage for comparisons',
      initialValue: 9.5,
      validation: (Rule) => Rule.min(0).max(100),
    }),
  ],
  preview: {
    select: {
      sectionId: 'sectionId',
    },
    prepare({sectionId}) {
      return {
        title: 'Socio-Economic Data',
        subtitle: sectionId ? `ID: ${sectionId}` : 'Recovery capital data points',
        media: LuChartBar,
      }
    },
  },
  options: {
    modal: {
      type: 'dialog',
      width: 'auto',
    },
  },
})
