import { defineField, defineType } from 'sanity'

export const locality = defineType({
    name: 'locality',
    title: 'Locality',
    type: 'document',
    icon: () => '📍',
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
            name: 'countyFips',
            title: 'County FIPS Code',
            type: 'string',
            description: 'Numeric county FIPS code',
        }),
        defineField({
            name: 'marcCountyId',
            title: 'Marc County ID',
            type: 'string',
            description: 'Marc County identifier',
        }),
        defineField({
            name: 'Total_PerCapita',
            title: 'Total Cost Per Capita',
            type: 'number',
            description: 'Total economic burden per person in the locality',
        }),
        defineField({
            name: 'Labor_PerCapita',
            title: 'Lost Labor Cost Per Capita',
            type: 'number',
            description: 'Lost productivity cost per person due to opioid-related deaths, disabilities, and incarcerations',
        }),
        defineField({
            name: 'HealthCare_PerCapita',
            title: 'Healthcare Cost Per Capita',
            type: 'number',
            description: 'Healthcare cost per person related to opioid use',
        }),
        defineField({
            name: 'Crime_Other_PerCapita',
            title: 'Crime and Other Costs Per Capita',
            type: 'number',
            description: 'Criminal justice and social services cost per person related to opioid use',
        }),
        defineField({
            name: 'Household_PerCapita',
            title: 'Household Cost Per Capita',
            type: 'number',
            description: 'Economic burden per person borne by households',
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
                defineField({ name: 'householdTotal', title: 'Household Total', type: 'number' }),
                defineField({ 
                    name: 'totalTotalPercentile', 
                    title: 'Total Cost Percentile', 
                    type: 'number',
                    description: 'Percentile rank (1-100) for total cost among all localities'
                }),
                defineField({ 
                    name: 'totalTotalComparison', 
                    title: 'Total Cost Comparison', 
                    type: 'string',
                    description: 'Human-readable comparison phrase for total cost (e.g., "higher than 75%")'
                }),
                defineField({ 
                    name: 'totalPerCapitaPercentile', 
                    title: 'Total Per Capita Percentile', 
                    type: 'number',
                    description: 'Percentile rank (1-100) for per capita cost among all localities'
                }),
                defineField({ 
                    name: 'totalPerCapitaComparison', 
                    title: 'Total Per Capita Comparison', 
                    type: 'string',
                    description: 'Human-readable comparison phrase for per capita cost (e.g., "higher than 75%")'
                })
            ]
        }),
        defineField({
            name: 'opioidCases',
            title: 'Opioid Cases and Deaths',
            type: 'object',
            fields: [
                defineField({ 
                    name: 'oudDeaths2023', 
                    title: 'OUD Deaths 2023', 
                    type: 'number',
                    description: 'Number of opioid use disorder deaths in 2023'
                }),
                defineField({ 
                    name: 'oudCases2023', 
                    title: 'OUD Cases 2023', 
                    type: 'number',
                    description: 'Number of opioid use disorder cases in 2023'
                })
            ]
        }),
        defineField({
            name: 'laborBreakdown',
            title: 'Labor Cost Breakdown',
            type: 'object',
            fields: [
                defineField({ 
                    name: 'laborFatal', 
                    title: 'Labor Fatal Costs', 
                    type: 'number',
                    description: 'Labor costs from fatal opioid cases'
                }),
                defineField({ 
                    name: 'laborOUD', 
                    title: 'Labor OUD Costs', 
                    type: 'number',
                    description: 'Labor costs from opioid use disorder cases'
                }),
                defineField({ 
                    name: 'laborIncarceration', 
                    title: 'Labor Incarceration Costs', 
                    type: 'number',
                    description: 'Labor costs from opioid-related incarcerations'
                })
            ]
        }),
        defineField({
            name: 'healthcareBreakdown',
            title: 'Healthcare Cost Breakdown',
            type: 'object',
            fields: [
                defineField({ 
                    name: 'healthED', 
                    title: 'Emergency Department Costs', 
                    type: 'number',
                    description: 'Healthcare costs from emergency department visits'
                }),
                defineField({ 
                    name: 'healthHosp', 
                    title: 'Hospitalization Costs', 
                    type: 'number',
                    description: 'Healthcare costs from hospitalizations'
                }),
                defineField({ 
                    name: 'healthAmbulanceNalax', 
                    title: 'Ambulance/Naloxone Costs', 
                    type: 'number',
                    description: 'Healthcare costs from ambulance and naloxone services'
                }),
                defineField({ 
                    name: 'healthIndirect', 
                    title: 'Indirect Healthcare Costs', 
                    type: 'number',
                    description: 'Indirect healthcare costs related to opioid use'
                })
            ]
        }),
        defineField({
            name: 'childFamilyBreakdown',
            title: 'Child/Family Cost Breakdown',
            type: 'object',
            fields: [
                defineField({ 
                    name: 'childFamilyAssistance', 
                    title: 'Child/Family Assistance Costs', 
                    type: 'number',
                    description: 'Costs for child and family assistance programs'
                }),
                defineField({ 
                    name: 'childFamilyK12Ed', 
                    title: 'K-12 Education Costs', 
                    type: 'number',
                    description: 'K-12 education costs related to opioid impact'
                })
            ]
        }),
        defineField({
            name: 'sectorBreakdown',
            title: 'Sector Cost Breakdown',
            type: 'object',
            fields: [
                defineField({ 
                    name: 'householdSectorTotal', 
                    title: 'Household Sector Total', 
                    type: 'number',
                    description: 'Total costs borne by household sector'
                }),
                defineField({ 
                    name: 'fedGovtSectorTotal', 
                    title: 'Federal Government Sector Total', 
                    type: 'number',
                    description: 'Total costs borne by federal government sector'
                }),
                defineField({ 
                    name: 'stateLocalSectorTotal', 
                    title: 'State/Local Government Sector Total', 
                    type: 'number',
                    description: 'Total costs borne by state and local government sector'
                })
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