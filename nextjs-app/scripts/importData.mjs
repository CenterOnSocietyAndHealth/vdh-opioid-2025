import { createClient } from '@sanity/client'
import csv from 'csv-parser'
import fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'
import readline from 'readline/promises'
import { stdin as input, stdout as output } from 'node:process'

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '../.env.local') })

/** Import writes here by default so .env.local can still point Next at production. */
const DEFAULT_IMPORT_DATASET = 'staging-2026'
const DEFAULT_CSV_RELATIVE = 'public/AllOpioidData2024.csv'

const resolveImportDataset = () =>
    process.env.SANITY_IMPORT_DATASET?.trim() || DEFAULT_IMPORT_DATASET

const resolveCsvPath = () => {
    const override = process.env.SANITY_IMPORT_CSV?.trim()
    if (override) return join(__dirname, '..', override)
    return join(__dirname, '..', DEFAULT_CSV_RELATIVE)
}

/** First non-empty defined value among CSV column keys (supports 2023 vs 2024 exports). */
const cell = (row, ...keys) => {
    for (const k of keys) {
        const v = row[k]
        if (v === undefined || v === null) continue
        const s = String(v).trim()
        if (s !== '') return v
    }
    return undefined
}

const parseOudNumber = (rawValue) => {
    if (rawValue === undefined || rawValue === null) return 0
    const cleanedValue = rawValue.toString().trim()
    if (cleanedValue === '-' || cleanedValue === '' || cleanedValue === 'N/A') return 0
    const numericValue = cleanedValue.replace(/,/g, '')
    const parsedValue = parseFloat(numericValue)
    return Number.isFinite(parsedValue) ? parsedValue : 0
}

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

const readCsvRows = (csvPath) =>
    new Promise((resolve, reject) => {
        const results = []
        fs.createReadStream(csvPath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', reject)
    })

const importData = async () => {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    const token = process.env.SANITY_IMPORT_TOKEN
    const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION
    const dataset = resolveImportDataset()
    const csvPath = resolveCsvPath()

    if (!projectId || !token) {
        console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or SANITY_IMPORT_TOKEN in .env.local')
        process.exit(1)
    }
    if (!fs.existsSync(csvPath)) {
        console.error(`CSV not found: ${csvPath}`)
        process.exit(1)
    }

    const rl = readline.createInterface({ input, output })
    console.log('')
    console.log('Sanity locality import')
    console.log(`  Project:  ${projectId}`)
    console.log(`  Dataset:  ${dataset}`)
    console.log(`  CSV:      ${csvPath}`)
    console.log('')
    console.log('Override with SANITY_IMPORT_DATASET and/or SANITY_IMPORT_CSV if needed.')
    const answer = await rl.question('Proceed with this dataset? Type yes to continue: ')
    rl.close()
    if (answer.trim().toLowerCase() !== 'yes') {
        console.log('Aborted (no writes).')
        process.exit(0)
    }

    const client = createClient({
        projectId,
        dataset,
        token,
        useCdn: false,
        apiVersion
    })

    const results = await readCsvRows(csvPath)

    const totalTotalValues = results.map((row) => cleanCurrencyValue(row.Total_Total))
    const totalPerCapitaValues = results.map((row) => cleanCurrencyValue(row.Total_PerCapita))

    for (const row of results) {
        const totalTotal = cleanCurrencyValue(row.Total_Total)
        const totalPerCapita = cleanCurrencyValue(row.Total_PerCapita)

        const totalTotalPercentile = getPercentileRank(totalTotalValues, totalTotal)
        const totalPerCapitaPercentile = getPercentileRank(totalPerCapitaValues, totalPerCapita)

        const totalTotalComparison = getComparisonPhrase(totalTotalPercentile)
        const totalPerCapitaComparison = getComparisonPhrase(totalPerCapitaPercentile)

        const popRaw = cell(row, 'Population2024', 'Population2023')
        const medianAgeRaw = cell(row, 'MedianAgeYRs', 'MedianAgeYrs')

        const document = {
            _type: 'locality',
            counties: row.LocalityName.trim(),
            fips: row.FIPS,
            countyFips: row.CountyFIPS,
            marcCountyId: row.Marc_CountyID1,
            Total_PerCapita: totalPerCapita,
            Labor_PerCapita: cleanCurrencyValue(row.Labor_PerCapita),
            HealthCare_PerCapita: cleanCurrencyValue(row.Health_PerCapita),
            Crime_Other_PerCapita: cleanCurrencyValue(row.Crime_PerCapita),
            Household_PerCapita: cleanCurrencyValue(row.ChildFamily_PerCapita),
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
                totalPopulation: parseInt(String(popRaw ?? '0').replace(/,/g, ''), 10) || 0,
                medianAge: parseFloat(String(medianAgeRaw ?? '0')) || 0,
                medianIncome: parseInt(String(row.MedianHHIncome ?? '0').replace(/,/g, ''), 10) || 0,
                povertyPct: parseFloat(String(row.PovertyPct ?? '0')) || 0
            },
            regions: {
                healthDistrict: row.Hlth_Dist_Name ?? '',
                healthRegion: row.Hlth_Region_Name ?? '',
                cooperCtrRegion: row.CooperCtrRegionName ?? ''
            },
            classification: {
                category: cell(row, 'CategoryName', 'Category name') ?? '',
                categoryDescription: cell(row, 'CategoryDescription', 'Category description') ?? '',
                urbanRural: row.Urban_Rural ?? '',
                metroNonMetro: row.Metro_NonMetro ?? ''
            },
            stateComparisons: {
                hhmiState: row.HHMI_State ?? '',
                hhmiQuartile: row.HHMI_Quartile ?? '',
                povertyRateState: row.PovertyRate_State ?? '',
                povertyRateQuartile: row.PovertyRate_Quartile ?? '',
                hhmiQuartileProse: row.HHMI_quartileProse ?? ''
            },
            opioidCases: {
                oudDeaths2024: parseOudNumber(cell(row, 'OUD_Deaths2024', 'OUD_Deaths2023')),
                oudCases2024: parseOudNumber(cell(row, 'OUDCases2024', 'OUDCases_2023'))
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
                childFamilyAssistance: cleanCurrencyValue(
                    cell(row, 'ChildFamily_Assistance', 'ChildFamily _Assistance')
                ),
                childFamilyK12Ed: cleanCurrencyValue(row.ChildFamily_K12Ed)
            },
            sectorBreakdown: {
                householdSectorTotal: cleanCurrencyValue(row.HouseholdSector_Total),
                fedGovtSectorTotal: cleanCurrencyValue(row.FedGovtSector_Total),
                stateLocalSectorTotal: cleanCurrencyValue(row.StateLocalSector_Total)
            }
        }

        try {
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
}

importData().catch(console.error)