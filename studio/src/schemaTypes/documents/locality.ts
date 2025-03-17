import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export const locality = defineType({
    name: 'locality',
    title: 'Locality',
    type: 'document',
    icon: DocumentIcon,
    fields: [
        defineField({
            name: 'counties',
            title: 'County/City Name',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'fips',
            title: 'FIPS Code',
            type: 'string',
            validation: (Rule) => Rule.required(),
        }),
        defineField({
            name: 'opioidMetrics',
            title: 'Opioid Metrics',
            type: 'object',
            fields: [
                defineField({ name: 'totalPerCapita', title: 'Total Per Capita', type: 'number' }),
                defineField({ name: 'totalTotal', title: 'Total Cost', type: 'number' }),
                defineField({ name: 'laborPerCapita', title: 'Labor Per Capita', type: 'number' }),
                defineField({ name: 'laborTotal', title: 'Labor Total', type: 'number' }),
                defineField({ name: 'healthcarePerCapita', title: 'Healthcare Per Capita', type: 'number' }),
                defineField({ name: 'healthcareTotal', title: 'Healthcare Total', type: 'number' }),
                defineField({ name: 'crimeOtherPerCapita', title: 'Crime/Other Per Capita', type: 'number' }),
                defineField({ name: 'crimeOtherTotal', title: 'Crime/Other Total', type: 'number' }),
                defineField({ name: 'householdPerCapita', title: 'Household Per Capita', type: 'number' }),
                defineField({ name: 'householdTotal', title: 'Household Total', type: 'number' })
            ]
        }),
        defineField({
            name: 'demographics',
            title: 'Demographics',
            type: 'object',
            fields: [
                defineField({ name: 'totalPopulation', title: 'Total Population', type: 'number' }),
                defineField({ name: 'medianAge', title: 'Median Age (Years)', type: 'number' }),
                defineField({ name: 'medianIncome', title: 'Median Household Income', type: 'number' }),
                defineField({ name: 'povertyPct', title: 'Poverty Percentage', type: 'number' })
            ]
        }),
        defineField({
            name: 'regions',
            title: 'Regional Information',
            type: 'object',
            fields: [
                defineField({ name: 'healthDistrict', title: 'Health District', type: 'string' }),
                defineField({ name: 'healthRegion', title: 'Health Region', type: 'string' }),
                defineField({ name: 'cooperCtrRegion', title: 'Cooper Center Region', type: 'string' })
            ]
        }),
        defineField({
            name: 'classification',
            title: 'Area Classification',
            type: 'object',
            fields: [
                defineField({ name: 'category', title: 'Category', type: 'string' }),
                defineField({ name: 'categoryDescription', title: 'Category Description', type: 'string' }),
                defineField({ name: 'urbanRural', title: 'Urban/Rural', type: 'string' }),
                defineField({ name: 'metroNonMetro', title: 'Metro/Non-Metro', type: 'string' })
            ]
        }),
        defineField({
            name: 'stateComparisons',
            title: 'State Comparisons',
            type: 'object',
            fields: [
                defineField({ name: 'hhmiState', title: 'HHMI State', type: 'string' }),
                defineField({ name: 'hhmiQuartile', title: 'HHMI Quartile', type: 'string' }),
                defineField({ name: 'povertyRateState', title: 'Poverty Rate State', type: 'string' }),
                defineField({ name: 'povertyRateQuartile', title: 'Poverty Rate Quartile', type: 'string' }),
                defineField({ name: 'hhmiQuartileProse', title: 'HHMI Quartile Prose', type: 'string' })
            ]
        })
    ]
})