"use client"

import { PortableText, type PortableTextComponents } from 'next-sanity'
import { useLocality } from '@/app/contexts/LocalityContext'
import { findVirginiaLocality } from '@/app/client-utils'
import DefinitionPopup from '@/app/components/DefinitionPopup'
import ResolvedLink from '@/app/components/ResolvedLink'
import { Locality, SocioEconomicDataProps } from '@/app/types/locality'

const marginMap = {
  none: 'mt-0',
  small: 'mt-[20px]',
  medium: 'mt-[40px]',
  large: 'mt-[60px]',
}

const marginBottomMap = {
  none: 'mb-0',
  small: 'mb-[20px]',
  medium: 'mb-[40px]',
  large: 'mb-[60px]',
}

const bodyTextStyle = {
  color: '#1E1E1E',
  fontFamily: 'Inter',
  fontSize: '16px',
  fontStyle: 'normal' as const,
  fontWeight: 400,
  lineHeight: '150%',
  letterSpacing: '-0.304px',
}

const statValueStyle = {
  color: '#000',
  textAlign: 'center' as const,
  fontFamily: 'Inter',
  fontSize: '48px',
  fontStyle: 'normal' as const,
  fontWeight: 700,
  lineHeight: '100%',
}

const statLabelStyle = {
  color: '#000',
  textAlign: 'center' as const,
  fontFamily: 'Inter',
  fontSize: '16px',
  fontStyle: 'normal' as const,
  fontWeight: 400,
  lineHeight: '150%',
}

const sectionLabelStyle = {
  color: '#000',
  textAlign: 'center' as const,
  fontFamily: 'Inter',
  fontSize: '16px',
  fontStyle: 'normal' as const,
  fontWeight: 400,
  lineHeight: '150%',
  letterSpacing: '-0.304px',
}

const headingStyle = {
  color: '#000',
  textAlign: 'center' as const,
  fontFamily: 'Inter',
  fontSize: '16px',
  fontStyle: 'normal' as const,
  fontWeight: 600,
  lineHeight: '130%',
  letterSpacing: '-0.16px',
}

const getNestedValue = (obj: unknown, path: string) => {
  return path.split('.').reduce((acc: unknown, part) => {
    if (acc === null || acc === undefined) return undefined
    return (acc as Record<string, unknown>)[part]
  }, obj)
}

const parseNumber = (value: number | string | null | undefined): number | null => {
  if (value === null || value === undefined) return null
  if (typeof value === 'number') return value
  if (typeof value === 'string') {
    const cleaned = value.replace(/,/g, '')
    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? null : parsed
  }
  return null
}

const calculateComparison = (localValue: number | null, stateValue: number) => {
  if (localValue === null || stateValue === 0) return null
  const difference = ((localValue - stateValue) / stateValue) * 100
  return {
    percentage: Math.round(Math.abs(difference)),
    isHigher: difference > 0,
  }
}

const formatIncome = (income: number | null) => {
  if (income === null) return 'N/A'
  return `$${Math.round(income / 1000)}K`
}

const formatPercent = (value: number | null) => {
  if (value === null) return 'N/A'
  return `${value}%`
}

function CurrencyExchangeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="#1E1E1E" strokeWidth="1.5" />
      <path
        d="M8 10h5a2 2 0 1 1 0 4H9"
        stroke="#1E1E1E"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M10 8V6M10 14v2M14 8l1-1M14 14l1 1"
        stroke="#1E1E1E"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function HousingHealthcareIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 11.5 12 5l8 6.5V19a1 1 0 0 1-1 1h-5v-5H10v5H5a1 1 0 0 1-1-1v-7.5Z"
        stroke="#1E1E1E"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M12 10.5c-.8-.8-2.2-.7-2.8.3-.6 1 .2 2.2 1.4 2.2.8 0 1.4-.5 1.4-1.2 0-.4-.2-.8-.5-1"
        stroke="#1E1E1E"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

type StateBenchmarks = {
  statePovertyPct: number
  stateMedianIncome: number
  stateSevereRentBurdenPct: number
  stateUninsuredPct: number
}

function createPortableTextComponents(
  selectedLocality: Locality | null | undefined,
  localities: Locality[] | undefined,
  benchmarks: StateBenchmarks,
): PortableTextComponents {
  const getComparisonPercentage = (metric: string) => {
    const povertyPct = parseNumber(selectedLocality?.demographics?.povertyPct)
    const medianIncome = parseNumber(selectedLocality?.demographics?.medianIncome)
    const rentBurdenPct = parseNumber(selectedLocality?.demographics?.severeRentBurdenPct)
    const uninsuredPct = parseNumber(selectedLocality?.demographics?.uninsuredPct)

    const comparisons: Record<string, ReturnType<typeof calculateComparison>> = {
      poverty: calculateComparison(povertyPct, benchmarks.statePovertyPct),
      income: calculateComparison(medianIncome, benchmarks.stateMedianIncome),
      rentBurden: calculateComparison(rentBurdenPct, benchmarks.stateSevereRentBurdenPct),
      uninsured: calculateComparison(uninsuredPct, benchmarks.stateUninsuredPct),
    }

    return comparisons[metric]?.percentage ?? null
  }

  return {
    block: {
      normal: ({children}) => <p className="m-0">{children}</p>,
    },
    marks: {
      link: ({children, value: link}) => (
        <ResolvedLink link={link} tabIndex={0}>
          {children}
        </ResolvedLink>
      ),
      definition: ({children, value}) => {
        if (!value?.term || !value?.definition) return children
        return (
          <DefinitionPopup term={value.term} definition={value.definition}>
            {children}
          </DefinitionPopup>
        )
      },
      stateComparison: ({children, value}) => {
        const percentage = value?.metric ? getComparisonPercentage(value.metric) : null
        if (percentage === null) return children
        return <>{percentage}%</>
      },
      localityField: ({children, value}) => {
        if (!value?.fieldPath) return children

        let fieldValue: unknown
        const locality =
          selectedLocality ||
          (localities?.length ? findVirginiaLocality(localities) : null)

        if (locality) {
          fieldValue = getNestedValue(locality, value.fieldPath)
          if (value.fieldPath === 'counties' && typeof fieldValue === 'string') {
            fieldValue = fieldValue.trim()
          }
        }

        if (fieldValue === undefined) return children

        let displayValue: string | number = fieldValue as string | number

        if (typeof fieldValue === 'number') {
          if (value.numberFormat === 'autoScaleCurrency') {
            displayValue = formatIncome(fieldValue)
          } else if (value.numberFormat === 'percentage' || value.fieldPath.includes('Pct')) {
            displayValue = `${fieldValue}%`
          } else if (value.fieldPath.includes('Income')) {
            displayValue = formatIncome(fieldValue)
          } else {
            displayValue = fieldValue.toLocaleString()
          }
        }

        if (value.bold) {
          return <strong>{displayValue}</strong>
        }

        return <>{displayValue}</>
      },
    },
  }
}

function ComparisonText({
  content,
  fallback,
  components,
}: {
  content?: unknown[]
  fallback: React.ReactNode
  components: PortableTextComponents
}) {
  if (content && content.length > 0) {
    return (
      <div className="text-center" style={bodyTextStyle}>
        <PortableText value={content as never} components={components} />
      </div>
    )
  }

  return <div className="text-center" style={bodyTextStyle}>{fallback}</div>
}

function StatColumn({
  value,
  label,
  comparison,
  fallbackComparison,
  components,
}: {
  value: string
  label: string
  comparison?: unknown[]
  fallbackComparison: React.ReactNode
  components: PortableTextComponents
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-4">
      <div style={statValueStyle}>{value}</div>
      <div style={statLabelStyle}>{label}</div>
      <ComparisonText
        content={comparison as unknown[] | undefined}
        fallback={fallbackComparison}
        components={components}
      />
    </div>
  )
}

function SectionHeader({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {icon}
      <span style={sectionLabelStyle}>{label}</span>
    </div>
  )
}

export default function SocioEconomicData({
  block,
  selectedLocality: propSelectedLocality,
  localities,
}: SocioEconomicDataProps & {
  selectedLocality?: Locality | null
  localities?: Locality[]
}) {
  const { selectedLocality: contextSelectedLocality } = useLocality()
  const selectedLocality = propSelectedLocality || contextSelectedLocality

  const {
    sectionId,
    marginTop = 'none',
    marginBottom = 'none',
    maxWidth = 608,
    heading,
    financialSectionLabel = 'FINANCIAL',
    housingSectionLabel = 'HOUSING & HEALTHCARE',
    povertyLabel = 'Live in Poverty',
    incomeLabel = 'Median Household Income',
    rentBurdenLabel = 'Spend a Majority of Paycheck on Rent',
    uninsuredLabel = 'Lack Any Form of Health Insurance',
    povertyComparison,
    incomeComparison,
    rentBurdenComparison,
    uninsuredComparison,
    statePovertyPct = 9.3,
    stateMedianIncome = 93170,
    stateSevereRentBurdenPct = 22.5,
    stateUninsuredPct = 9.5,
  } = block

  const benchmarks: StateBenchmarks = {
    statePovertyPct,
    stateMedianIncome,
    stateSevereRentBurdenPct,
    stateUninsuredPct,
  }

  const portableTextComponents = createPortableTextComponents(
    selectedLocality,
    localities,
    benchmarks,
  )

  const povertyPct = parseNumber(selectedLocality?.demographics?.povertyPct)
  const medianIncome = parseNumber(selectedLocality?.demographics?.medianIncome)
  const rentBurdenPct = parseNumber(selectedLocality?.demographics?.severeRentBurdenPct)
  const uninsuredPct = parseNumber(selectedLocality?.demographics?.uninsuredPct)

  const povertyComparisonData = calculateComparison(povertyPct, statePovertyPct)
  const incomeComparisonData = calculateComparison(medianIncome, stateMedianIncome)
  const rentBurdenComparisonData = calculateComparison(rentBurdenPct, stateSevereRentBurdenPct)
  const uninsuredComparisonData = calculateComparison(uninsuredPct, stateUninsuredPct)

  const isVirginia =
    !selectedLocality ||
    selectedLocality.counties === 'Virginia Total' ||
    selectedLocality.fips === 'us-va-999' ||
    selectedLocality.marcCountyId === '999'

  const countyName = selectedLocality?.counties?.trim() || 'this locality'
  const direction = (comparison: ReturnType<typeof calculateComparison>) =>
    comparison?.isHigher ? 'higher' : 'lower'

  const defaultHeading = (
    <p style={headingStyle}>
      Examples of Local{' '}
      <DefinitionPopup
        term="Recovery Capital"
        definition="Resources and conditions in a community that support resilience and recovery from substance use, including financial stability, housing security, and access to healthcare."
      >
        Recovery Capital
      </DefinitionPopup>
      , or Our Access to Resources That Influence Community Opioid Use Outcomes
    </p>
  )

  return (
    <div
      className={`px-4 md:px-0 ${marginMap[marginTop as keyof typeof marginMap] ?? marginMap.none} ${marginBottomMap[marginBottom as keyof typeof marginBottomMap] ?? marginBottomMap.none}`}
    >
      <div
        id={sectionId}
        className="mx-auto"
        style={{maxWidth: maxWidth ? `${maxWidth}px` : undefined}}
      >
        <div className="mb-6">
          {heading && heading.length > 0 ? (
            <div style={headingStyle}>
              <PortableText value={heading as never} components={portableTextComponents} />
            </div>
          ) : (
            defaultHeading
          )}
        </div>

        <div className="overflow-hidden rounded-[20px]">
          <div className="bg-[#ececec] px-4 pb-8 pt-2">
            <SectionHeader icon={<CurrencyExchangeIcon />} label={financialSectionLabel} />
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <StatColumn
                value={isVirginia ? formatPercent(statePovertyPct) : formatPercent(povertyPct)}
                label={povertyLabel}
                comparison={povertyComparison}
                components={portableTextComponents}
                fallbackComparison={
                  isVirginia ? (
                    <>
                      At {formatPercent(statePovertyPct)}, Virginia&apos;s poverty rate reflects
                      statewide economic conditions.
                    </>
                  ) : povertyPct !== null && povertyComparisonData ? (
                    <>
                      At {formatPercent(povertyPct)}, {countyName} has a{' '}
                      {povertyComparisonData.percentage}% {direction(povertyComparisonData)} poverty
                      rate than the state average.
                    </>
                  ) : (
                    <>Data not available</>
                  )
                }
              />
              <StatColumn
                value={
                  isVirginia
                    ? formatIncome(stateMedianIncome)
                    : formatIncome(medianIncome)
                }
                label={incomeLabel}
                comparison={incomeComparison}
                components={portableTextComponents}
                fallbackComparison={
                  isVirginia ? (
                    <>
                      At {formatIncome(stateMedianIncome)}, Virginia&apos;s median household income
                      reflects statewide economic conditions.
                    </>
                  ) : medianIncome !== null && incomeComparisonData ? (
                    <>
                      At {formatIncome(medianIncome)}, {countyName}&apos;s median household income
                      is {incomeComparisonData.percentage}% {direction(incomeComparisonData)} than
                      the state median.
                    </>
                  ) : (
                    <>Data not available</>
                  )
                }
              />
            </div>
          </div>

          <div className="bg-[#e2e2e2] px-4 pb-8 pt-2">
            <SectionHeader icon={<HousingHealthcareIcon />} label={housingSectionLabel} />
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <StatColumn
                value={
                  isVirginia
                    ? formatPercent(stateSevereRentBurdenPct)
                    : formatPercent(rentBurdenPct)
                }
                label={rentBurdenLabel}
                comparison={rentBurdenComparison}
                components={portableTextComponents}
                fallbackComparison={
                  isVirginia ? (
                    <>
                      At {formatPercent(stateSevereRentBurdenPct)}, Virginia&apos;s severe rental
                      cost burden rate reflects statewide housing conditions.
                    </>
                  ) : rentBurdenPct !== null && rentBurdenComparisonData ? (
                    <>
                      At {formatPercent(rentBurdenPct)}, {countyName} has a{' '}
                      {rentBurdenComparisonData.percentage}% {direction(rentBurdenComparisonData)}{' '}
                      rate of{' '}
                      <DefinitionPopup
                        term="severe rental cost burden"
                        definition="Households that spend 50% or more of their income on rent and utilities."
                      >
                        severe rental cost burden
                      </DefinitionPopup>{' '}
                      than the state average.
                    </>
                  ) : (
                    <>Data not available</>
                  )
                }
              />
              <StatColumn
                value={
                  isVirginia ? formatPercent(stateUninsuredPct) : formatPercent(uninsuredPct)
                }
                label={uninsuredLabel}
                comparison={uninsuredComparison}
                components={portableTextComponents}
                fallbackComparison={
                  isVirginia ? (
                    <>
                      At {formatPercent(stateUninsuredPct)}, Virginia&apos;s uninsured rate reflects
                      statewide healthcare access.
                    </>
                  ) : uninsuredPct !== null && uninsuredComparisonData ? (
                    <>
                      At {formatPercent(uninsuredPct)}, {countyName}&apos;s{' '}
                      <DefinitionPopup
                        term="uninsured"
                        definition="People without any form of health insurance coverage."
                      >
                        uninsured
                      </DefinitionPopup>{' '}
                      rate is {uninsuredComparisonData.percentage}%{' '}
                      {direction(uninsuredComparisonData)} than the state median.
                    </>
                  ) : (
                    <>Data not available</>
                  )
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
