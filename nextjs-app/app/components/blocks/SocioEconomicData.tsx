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
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="29"
      height="29"
      viewBox="0 0 29 29"
      fill="none"
      aria-hidden="true"
    >
      <mask
        id="socioEconomic-financial-mask"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="29"
        height="29"
      >
        <rect width="29" height="29" fill="#949494" />
      </mask>
      <g mask="url(#socioEconomic-financial-mask)">
        <path
          d="M12.1996 27.1636C9.74269 27.1636 7.49408 26.4709 5.45381 25.0855C3.41354 23.7001 1.90544 21.9495 0.92951 19.8337V24.0455H0V18.2546H6.04167V19.1455H1.64756C2.45775 21.1812 3.85317 22.8779 5.83383 24.2357C7.81449 25.5937 9.93643 26.2726 12.1996 26.2726C13.6774 26.2726 15.0697 26.0165 16.3765 25.5042C17.6832 24.9919 18.8357 24.2833 19.8342 23.3783C20.8327 22.4732 21.6418 21.4019 22.2614 20.1644C22.8811 18.9267 23.2374 17.5922 23.3302 16.1609H24.2597C24.1822 17.6947 23.8115 19.1298 23.1477 20.4661C22.484 21.8025 21.6138 22.9681 20.5371 23.9629C19.4605 24.9578 18.2057 25.74 16.7726 26.3094C15.3397 26.8788 13.8154 27.1636 12.1996 27.1636ZM11.6722 23.3349V21.8828C10.8743 21.6956 10.1799 21.3945 9.58903 20.9795C8.99795 20.5645 8.49871 19.9724 8.0913 19.2034L8.95798 18.867C9.29269 19.5707 9.76323 20.1201 10.3696 20.515C10.9762 20.9102 11.6489 21.1077 12.3878 21.1077C13.1779 21.1077 13.894 20.9121 14.5362 20.5208C15.1783 20.1296 15.4993 19.5286 15.4993 18.7178C15.4993 18.0363 15.2746 17.4932 14.8253 17.0886C14.3762 16.684 13.4847 16.2263 12.1507 15.7156C10.834 15.233 9.89293 14.7414 9.32743 14.2409C8.76213 13.7406 8.47948 13.062 8.47948 12.2051C8.47948 11.4747 8.7583 10.8251 9.31595 10.2565C9.87359 9.68781 10.6791 9.33592 11.7326 9.2008V7.83531H12.7201V9.2008C13.3615 9.24828 13.9487 9.43533 14.4816 9.76194C15.0144 10.0885 15.4521 10.5303 15.7944 11.0872L14.9719 11.4413C14.6543 10.99 14.2739 10.6366 13.8309 10.381C13.3878 10.1256 12.8642 9.99792 12.2601 9.99792C11.4281 9.99792 10.7507 10.2088 10.2279 10.6306C9.70513 11.0523 9.44373 11.5772 9.44373 12.2051C9.44373 12.8525 9.64361 13.3522 10.0434 13.7041C10.4429 14.056 11.3042 14.471 12.6271 14.9491C14.0477 15.4794 15.0384 16.0162 15.5993 16.5596C16.1599 17.103 16.4403 17.8224 16.4403 18.7178C16.4403 19.245 16.3303 19.7038 16.1104 20.0943C15.8905 20.4848 15.6066 20.8137 15.2588 21.0808C14.911 21.3482 14.511 21.555 14.0587 21.7013C13.6063 21.8474 13.14 21.9272 12.6597 21.9408V23.3349H11.6722ZM0.139562 15.0027C0.24791 13.3946 0.641726 11.9187 1.32101 10.575C2.0005 9.2311 2.88631 8.06916 3.97844 7.08915C5.07057 6.10914 6.3215 5.34928 7.73122 4.80957C9.14094 4.26986 10.6304 4 12.1996 4C14.6101 4 16.8587 4.69636 18.9455 6.08906C21.032 7.48197 22.5401 9.25861 23.4698 11.419V7.1181H24.3993V12.909H18.3576V12.0181H22.7517C21.9878 10.0567 20.6168 8.37849 18.6385 6.98347C16.6603 5.58844 14.514 4.89093 12.1996 4.89093C10.7837 4.89093 9.42238 5.13965 8.11577 5.63708C6.80896 6.13452 5.65248 6.82827 4.64634 7.71833C3.6402 8.60858 2.81572 9.67247 2.17289 10.91C1.52985 12.1477 1.16191 13.5119 1.06907 15.0027H0.139562Z"
          fill="#1C1B1F"
        />
      </g>
    </svg>
  )
}

function HousingHealthcareIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      aria-hidden="true"
    >
      <mask
        id="socioEconomic-housing-mask"
        style={{ maskType: 'alpha' }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="0"
        width="36"
        height="36"
      >
        <rect width="36" height="36" fill="#1C1B1F" />
      </mask>
      <g mask="url(#socioEconomic-housing-mask)">
        <path
          d="M21.3655 6L35.731 16.7134L35.0328 17.6104L31.8655 15.2306V29.6047H10.8655V15.2306L7.69825 17.6104L7 16.7134L21.3655 6ZM16.4039 18.3071C16.4039 19.2619 16.9145 20.3095 17.9358 21.45C18.9567 22.5903 20.1 23.7345 21.3655 24.8827C22.6693 23.7345 23.8318 22.591 24.853 21.4523C25.8743 20.3133 26.3849 19.2674 26.3849 18.3146C26.3849 17.5319 26.1274 16.889 25.6124 16.386C25.0974 15.883 24.4594 15.6315 23.6984 15.6315C23.2411 15.6315 22.8125 15.7416 22.4125 15.9619C22.0125 16.1821 21.6635 16.4345 21.3655 16.719C21.106 16.4345 20.7714 16.1821 20.3616 15.9619C19.9521 15.7416 19.5313 15.6315 19.099 15.6315C18.3355 15.6315 17.6955 15.8814 17.179 16.3811C16.6623 16.8809 16.4039 17.5229 16.4039 18.3071ZM30.7116 28.4509V14.3854L21.3655 7.39912L12.0194 14.3854V28.4509H30.7116Z"
          fill="#1C1B1F"
        />
      </g>
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
  isVirginia: boolean,
): PortableTextComponents {
  const dataLocality =
    selectedLocality ||
    (isVirginia && localities?.length ? findVirginiaLocality(localities) : null) ||
    null

  const getComparison = (metric: string) => {
    const povertyPct = parseNumber(dataLocality?.demographics?.povertyPct)
    const medianIncome = parseNumber(dataLocality?.demographics?.medianIncome)
    const rentBurdenPct = parseNumber(dataLocality?.demographics?.severeRentBurdenPct)
    const uninsuredPct = parseNumber(dataLocality?.demographics?.uninsuredPct)

    const comparisons: Record<string, ReturnType<typeof calculateComparison>> = {
      poverty: calculateComparison(povertyPct, benchmarks.statePovertyPct),
      income: calculateComparison(medianIncome, benchmarks.stateMedianIncome),
      rentBurden: calculateComparison(rentBurdenPct, benchmarks.stateSevereRentBurdenPct),
      uninsured: calculateComparison(uninsuredPct, benchmarks.stateUninsuredPct),
    }

    return comparisons[metric] ?? null
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
        const comparison = value?.metric ? getComparison(value.metric) : null
        if (!comparison) return children
        const direction = comparison.isHigher ? 'higher' : 'lower'
        return <>{comparison.percentage}% {direction}</>
      },
      localityField: ({children, value}) => {
        if (!value?.fieldPath) return children

        let fieldValue: unknown
        const locality =
          dataLocality ||
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
      citation: ({children, value}) => {
        const selectedText = children?.toString() || ''
        const number = parseInt(selectedText, 10)
        const citationId =
          (typeof value?.citationId === 'string' && value.citationId) ||
          (isNaN(number) ? 'source-01' : `source-${String(number).padStart(2, '0')}`)

        const handleCitationClick = (e: React.MouseEvent) => {
          e.preventDefault()
          window.location.hash = citationId

          const sourcesAccordion = document.querySelector('[data-sources-accordion]')
          if (sourcesAccordion) {
            window.dispatchEvent(
              new CustomEvent('openSourcesAccordion', {detail: {citationId}}),
            )
          }

          setTimeout(() => {
            const element = document.querySelector(`#${citationId}`)
            if (element) {
              element.scrollIntoView({behavior: 'smooth', block: 'center'})
            }
          }, 400)
        }

        return (
          <a
            href={`#${citationId}`}
            onClick={handleCitationClick}
            tabIndex={0}
            className="cursor-pointer text-sm font-medium underline hover:bg-[#cfe6ef]"
            title="View source"
            style={{fontSize: '0.75em', verticalAlign: 'super'}}
          >
            {children}
          </a>
        )
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
    statePovertyComparison,
    stateIncomeComparison,
    stateRentBurdenComparison,
    stateUninsuredComparison,
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

  const isVirginia =
    !selectedLocality ||
    selectedLocality.counties?.trim() === 'Virginia Total' ||
    selectedLocality.counties?.trim() === 'Virginia' ||
    selectedLocality.fips === 'us-va-999' ||
    selectedLocality.marcCountyId === '999'

  const portableTextComponents = createPortableTextComponents(
    selectedLocality,
    localities,
    benchmarks,
    isVirginia,
  )

  const povertyPct = parseNumber(selectedLocality?.demographics?.povertyPct)
  const medianIncome = parseNumber(selectedLocality?.demographics?.medianIncome)
  const rentBurdenPct = parseNumber(selectedLocality?.demographics?.severeRentBurdenPct)
  const uninsuredPct = parseNumber(selectedLocality?.demographics?.uninsuredPct)

  const povertyComparisonData = calculateComparison(povertyPct, statePovertyPct)
  const incomeComparisonData = calculateComparison(medianIncome, stateMedianIncome)
  const rentBurdenComparisonData = calculateComparison(rentBurdenPct, stateSevereRentBurdenPct)
  const uninsuredComparisonData = calculateComparison(uninsuredPct, stateUninsuredPct)

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
                comparison={isVirginia ? statePovertyComparison : povertyComparison}
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
                comparison={isVirginia ? stateIncomeComparison : incomeComparison}
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
                comparison={isVirginia ? stateRentBurdenComparison : rentBurdenComparison}
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
                comparison={isVirginia ? stateUninsuredComparison : uninsuredComparison}
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
