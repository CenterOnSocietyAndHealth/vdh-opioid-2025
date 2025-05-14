import {defineArrayMember, defineType, defineField} from 'sanity'

/**
 * This is the schema definition for the rich text fields used for
 * for this blog studio. When you import it in schemas.js it can be
 * reused in other parts of the studio with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 *
 * Learn more: https://www.sanity.io/docs/block-content
 */
export const blockContent = defineType({
  title: 'Block Content',
  name: 'blockContent',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
          {title: 'Small Gray Text', value: 'smallGrayText'},
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              defineField({
                name: 'linkType',
                title: 'Link Type',
                type: 'string',
                initialValue: 'href',
                options: {
                  list: [
                    {title: 'URL', value: 'href'},
                    {title: 'Page', value: 'page'},
                  ],
                  layout: 'radio',
                },
              }),
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                hidden: ({parent}) => parent?.linkType !== 'href' && parent?.linkType != null,
                validation: (Rule) =>
                  Rule.custom((value, context: any) => {
                    if (context.parent?.linkType === 'href' && !value) {
                      return 'URL is required when Link Type is URL'
                    }
                    return true
                  }),
              }),
              defineField({
                name: 'page',
                title: 'Page',
                type: 'reference',
                to: [{type: 'page'}],
                hidden: ({parent}) => parent?.linkType !== 'page',
                validation: (Rule) =>
                  Rule.custom((value, context: any) => {
                    if (context.parent?.linkType === 'page' && !value) {
                      return 'Page reference is required when Link Type is Page'
                    }
                    return true
                  }),
              }),
              defineField({
                name: 'openInNewTab',
                title: 'Open in new tab',
                type: 'boolean',
                initialValue: false,
              }),
            ],
          },
          {
            name: 'localityField',
            type: 'object',
            title: 'Locality Field',
            icon: () => (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                <circle cx="12" cy="9" r="2.5" />
              </svg>
            ),
            fields: [
              defineField({
                name: 'fieldPath',
                title: 'Field Path',
                type: 'string',
                options: {
                  list: [
                    {title: 'County/City Name', value: 'counties'},
                    {title: 'Total Population', value: 'demographics.totalPopulation'},
                    {title: 'Median Age', value: 'demographics.medianAge'},
                    {title: 'Median Income', value: 'demographics.medianIncome'},
                    {title: 'Poverty Percentage', value: 'demographics.povertyPct'},
                    {title: 'Health District', value: 'regions.healthDistrict'},
                    {title: 'Health Region', value: 'regions.healthRegion'},
                    {title: 'Cooper Center Region', value: 'regions.cooperCtrRegion'},
                    {title: 'Category', value: 'classification.category'},
                    {title: 'Urban/Rural', value: 'classification.urbanRural'},
                    {title: 'Metro/Non-Metro', value: 'classification.metroNonMetro'},
                    {title: 'Total Per Capita', value: 'opioidMetrics.totalPerCapita'},
                    {title: 'Total Cost', value: 'opioidMetrics.totalTotal'},
                    {title: 'Labor Per Capita', value: 'opioidMetrics.laborPerCapita'},
                    {title: 'Labor Total', value: 'opioidMetrics.laborTotal'},
                    {title: 'Healthcare Per Capita', value: 'opioidMetrics.healthcarePerCapita'},
                    {title: 'Healthcare Total', value: 'opioidMetrics.healthcareTotal'},
                    {title: 'Crime/Other Per Capita', value: 'opioidMetrics.crimeOtherPerCapita'},
                    {title: 'Crime/Other Total', value: 'opioidMetrics.crimeOtherTotal'},
                    {title: 'Household Per Capita', value: 'opioidMetrics.householdPerCapita'},
                    {title: 'Household Total', value: 'opioidMetrics.householdTotal'},
                    {title: 'Total Cost Percentile', value: 'opioidMetrics.totalTotalPercentile'},
                    {title: 'Total Cost Comparison', value: 'opioidMetrics.totalTotalComparison'},
                    {title: 'Total Per Capita Percentile', value: 'opioidMetrics.totalPerCapitaPercentile'},
                    {title: 'Total Per Capita Comparison', value: 'opioidMetrics.totalPerCapitaComparison'},
                  ],
                },
                validation: (Rule) => Rule.required(),
              }),
              defineField({
                name: 'addArticle',
                title: 'Add Article (a/an)',
                type: 'boolean',
                initialValue: false,
                description: 'Adds "a" or "an" before the value based on whether it starts with a vowel',
              }),
              defineField({
                name: 'textCase',
                title: 'Text Case',
                type: 'string',
                options: {
                  list: [
                    {title: 'Default', value: 'default'},
                    {title: 'Capitalize', value: 'capitalize'},
                    {title: 'Lowercase', value: 'lowercase'},
                  ],
                },
                initialValue: 'default',
                description: 'Transform the text case of the value',
              }),
            ],
          },
        ],
      },
    }),
  ],
})
