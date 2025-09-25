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

const getPercentileRank = (values, value) => {
    const sortedValues = [...values].sort((a, b) => a - b);
    // Find the insertion point (like d3.bisect)
    let left = 0;
    let right = sortedValues.length;
    while (left < right) {
        const mid = Math.floor((left + right) / 2);
        if (sortedValues[mid] < value) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    return Math.round(100 * left / values.length);
}

const getComparisonPhrase = (percentileRank) => {
    if (percentileRank === 1) {
        return 'the lowest';
    } else if (percentileRank <= 50) {
        return `lower than ${100 - percentileRank}%`;
    } else if (percentileRank === 100) {
        return 'the highest';
    } else {
        return `higher than ${percentileRank}%`;
    }
}

const cleanCurrencyValue = (value) => {
    if (!value) return 0;

    // Convert to string and trim whitespace
    const stringValue = value.toString().trim();

    // Handle dash values (both "-" and "$-")
    if (stringValue === '-' || stringValue === '$-' || stringValue === '') {
        return 0;
    }

    // Remove currency symbol, commas, and parse as float
    const cleanedValue = stringValue.replace(/[$,]/g, '');
    const parsedValue = parseFloat(cleanedValue);

    // Return 0 if parsing fails (NaN)
    return isNaN(parsedValue) ? 0 : parsedValue;
}

const importData = async () => {
    const results = []

    // Read CSV file
    fs.createReadStream('./public/AllOpioidData2021f.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            // Calculate all totalTotal and totalPerCapita values
            const totalTotalValues = results.map(row => cleanCurrencyValue(row.Total_Total));
            const totalPerCapitaValues = results.map(row => cleanCurrencyValue(row.Total_PerCapita));

            // Process each row
            for (const row of results) {
                const totalTotal = cleanCurrencyValue(row.Total_Total);
                const totalPerCapita = cleanCurrencyValue(row.Total_PerCapita);

                // Calculate percentile ranks
                const totalTotalPercentile = getPercentileRank(totalTotalValues, totalTotal);
                const totalPerCapitaPercentile = getPercentileRank(totalPerCapitaValues, totalPerCapita);

                // Calculate comparison phrases
                const totalTotalComparison = getComparisonPhrase(totalTotalPercentile);
                const totalPerCapitaComparison = getComparisonPhrase(totalPerCapitaPercentile);

                const document = {
                    _type: 'locality',
                    counties: row.LocalityName,
                    fips: row.FIPS,
                    countyFips: row.CountyFIPS,
                    marcCountyId: row.Marc_CountyID1,
                    // Add top-level fields
                    Total_PerCapita: totalPerCapita,
                    Labor_PerCapita: cleanCurrencyValue(row.Labor_PerCapita),
                    HealthCare_PerCapita: cleanCurrencyValue(row.Health_PerCapita),
                    Crime_Other_PerCapita: cleanCurrencyValue(row.Crime_PerCapita),
                    Household_PerCapita: cleanCurrencyValue(row.ChildFamily_PerCapita),
                    // Keep nested fields under opioidMetrics
                    opioidMetrics: {
                        totalPerCapita,
                        totalTotal,
                        laborPerCapita: cleanCurrencyValue(row.Labor_PerCapita),
                        laborTotal: cleanCurrencyValue(row.Labor_Total),
                        healthcarePerCapita: cleanCurrencyValue(row.Health_PerCapita),
                        healthcareTotal: cleanCurrencyValue(row.Health_Total),
                        crimeOtherPerCapita: cleanCurrencyValue(row.Crime_PerCapita),
                        crimeOtherTotal: cleanCurrencyValue(row.Crime_Total),
                        householdPerCapita: cleanCurrencyValue(row.ChildFamily_PerCapita),
                        householdTotal: cleanCurrencyValue(row.ChildFamily_Total),
                        totalTotalPercentile,
                        totalTotalComparison,
                        totalPerCapitaPercentile,
                        totalPerCapitaComparison
                    },
                    demographics: {
                        totalPopulation: parseInt(row.Population2023.replace(/,/g, '')),
                        medianAge: parseFloat(row.MedianAgeYrs),
                        medianIncome: parseInt(row.MedianHHIncome.replace(/,/g, '')),
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
                    },
                    opioidCases: {
                        oudDeaths2023: (() => {
                            const rawValue = row.OUD_Deaths2023;
                            if (!rawValue) return 0;
                            const cleanedValue = rawValue.toString().trim();
                            // Handle dashes and other non-numeric values
                            if (cleanedValue === '-' || cleanedValue === '' || cleanedValue === 'N/A') {
                                return 0;
                            }
                            // Remove commas and parse as integer
                            const numericValue = cleanedValue.replace(/,/g, '');
                            const parsedValue = parseInt(numericValue);
                            return isNaN(parsedValue) ? 0 : parsedValue;
                        })(),
                        oudCases2023: (() => {
                            const rawValue = row.OUDCases_2023;
                            if (!rawValue) return 0;
                            const cleanedValue = rawValue.toString().trim();
                            // Handle dashes and other non-numeric values
                            if (cleanedValue === '-' || cleanedValue === '' || cleanedValue === 'N/A') {
                                return 0;
                            }
                            // Remove commas and parse as integer
                            const numericValue = cleanedValue.replace(/,/g, '');
                            const parsedValue = parseInt(numericValue);
                            return isNaN(parsedValue) ? 0 : parsedValue;
                        })()
                    },
                    laborBreakdown: {
                        laborFatal: cleanCurrencyValue(row.Labor_Fatal),
                        laborOUD: cleanCurrencyValue(row.Labor_OUD),
                        laborIncarceration: cleanCurrencyValue(row.Labor_Incarceration)
                    },
                    healthcareBreakdown: {
                        healthED: cleanCurrencyValue(row.Health_ED),
                        healthHosp: cleanCurrencyValue(row.Health_Hosp),
                        healthAmbulanceNalax: cleanCurrencyValue(row.Health_AmbulanceNalax),
                        healthIndirect: cleanCurrencyValue(row.Health_Indirect)
                    },
                    childFamilyBreakdown: {
                        childFamilyAssistance: cleanCurrencyValue(row['ChildFamily _Assistance']),
                        childFamilyK12Ed: cleanCurrencyValue(row.ChildFamily_K12Ed)
                    },
                    sectorBreakdown: {
                        householdSectorTotal: cleanCurrencyValue(row.HouseholdSector_Total),
                        fedGovtSectorTotal: cleanCurrencyValue(row.FedGovtSector_Total),
                        stateLocalSectorTotal: cleanCurrencyValue(row.StateLocalSector_Total)
                    }
                }

                try {
                    // Create or update document using FIPS as the key
                    await client.createOrReplace({
                        ...document,
                        _id: `locality-${row.FIPS.replace('us-va-', '')}`
                    })
                    console.log(`Imported ${row.LocalityName}`)
                } catch (error) {
                    console.error(`Error importing ${row.LocalityName}:`, error)
                }
            }

            console.log('Import completed!')
        })
}

importData().catch(console.error)