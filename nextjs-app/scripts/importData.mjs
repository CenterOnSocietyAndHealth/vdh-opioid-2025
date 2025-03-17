import { createClient } from '@sanity/client'
import csv from 'csv-parser'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '../.env.local') })

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    token: process.env.SANITY_IMPORT_TOKEN,
    useCdn: false,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION
})

const importData = async () => {
    const results = []

    // Read CSV file
    fs.createReadStream('nextjs-app/public/AllOpioidData2021e.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            // Process each row
            for (const row of results) {
                const document = {
                    _type: 'locality',
                    counties: row.Counties,
                    fips: row.FIPS,
                    opioidMetrics: {
                        totalPerCapita: parseFloat(row.Total_PerCapita),
                        totalTotal: parseFloat(row.Total_Total),
                        laborPerCapita: parseFloat(row.Labor_PerCapita),
                        laborTotal: parseFloat(row.Labor_Total),
                        healthcarePerCapita: parseFloat(row.HealthCare_PerCapita),
                        healthcareTotal: parseFloat(row.HealthCare_Total),
                        crimeOtherPerCapita: parseFloat(row.Crime_Other_PerCapita),
                        crimeOtherTotal: parseFloat(row.Crime_Other_Total),
                        householdPerCapita: parseFloat(row.Household_PerCapita),
                        householdTotal: parseFloat(row.Household_Total)
                    },
                    demographics: {
                        totalPopulation: parseInt(row.TotalPopulation),
                        medianAge: parseFloat(row.MedianAgeYrs),
                        medianIncome: parseInt(row.MedianHHIncome),
                        povertyPct: parseFloat(row.PovertyPct)
                    },
                    regions: {
                        healthDistrict: row.Hlth_Dist_Name,
                        healthRegion: row.Hlth_Region_Name,
                        cooperCtrRegion: row.CooperCtrRegionName
                    },
                    classification: {
                        category: row['Category name'],
                        categoryDescription: row['Category description'],
                        urbanRural: row.Urban_Rural,
                        metroNonMetro: row.Metro_NonMetro
                    },
                    stateComparisons: {
                        hhmiState: row.HHMI_State,
                        hhmiQuartile: row.HHMI_Quartile,
                        povertyRateState: row.PovertyRate_State,
                        povertyRateQuartile: row.PovertyRate_Quartile,
                        hhmiQuartileProse: row.HHMI_quartileProse
                    }
                }

                try {
                    // Create or update document using FIPS as the key
                    await client.createOrReplace({
                        ...document,
                        _id: `locality-${row.FIPS.replace('us-va-', '')}`
                    })
                    console.log(`Imported ${row.Counties}`)
                } catch (error) {
                    console.error(`Error importing ${row.Counties}:`, error)
                }
            }

            console.log('Import completed!')
        })
}

importData().catch(console.error)