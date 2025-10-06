export type OpioidMetrics = {
  totalPerCapita: number | null;
  totalTotal: number | null;
  laborPerCapita: number | null;
  laborTotal: number | null;
  healthcarePerCapita: number | null;
  healthcareTotal: number | null;
  crimeOtherPerCapita: number | null;
  crimeOtherTotal: number | null;
  householdPerCapita: number | null;
  householdTotal: number | null;
  totalTotalPercentile: number | null;
  totalTotalComparison: string | null;
  totalPerCapitaPercentile: number | null;
  totalPerCapitaComparison: string | null;
};

export type Demographics = {
  totalPopulation?: number | null;
  medianAge?: number | null;
  medianIncome?: number | null;
  povertyPct?: number | null;
};

export type Regions = {
  healthDistrict?: string | null;
  healthRegion?: string | null;
  cooperCtrRegion?: string | null;
};

export type Classification = {
  category?: string | null;
  categoryDescription?: string | null;
  urbanRural?: string | null;
  metroNonMetro?: string | null;
};

export type StateComparisons = {
  hhmiState?: string | null;
  hhmiQuartile?: string | null;
  povertyRateState?: string | null;
  povertyRateQuartile?: string | null;
  hhmiQuartileProse?: string | null;
};

export type OpioidCases = {
  oudDeaths2023?: number | null;
  oudCases2023?: number | null;
};

export type LaborBreakdown = {
  laborFatal?: number | null;
  laborOUD?: number | null;
  laborIncarceration?: number | null;
};

export type HealthcareBreakdown = {
  healthED?: number | null;
  healthHosp?: number | null;
  healthAmbulanceNalax?: number | null;
  healthIndirect?: number | null;
};

export type ChildFamilyBreakdown = {
  childFamilyAssistance?: number | null;
  childFamilyK12Ed?: number | null;
};

export type SectorBreakdown = {
  householdSectorTotal?: number | null | undefined;
  fedGovtSectorTotal?: number | null | undefined;
  stateLocalSectorTotal?: number | null | undefined;
};

export type Locality = {
  _id: string;
  counties: string;
  fips: string;
  countyFips?: string | null;
  marcCountyId?: string | null;
  Total_PerCapita?: number | null;
  Labor_PerCapita?: number | null;
  HealthCare_PerCapita?: number | null;
  Crime_Other_PerCapita?: number | null;
  Household_PerCapita?: number | null;
  demographics?: Demographics | null;
  regions?: Regions | null;
  classification?: Classification | null;
  stateComparisons?: StateComparisons | null;
  opioidMetrics?: OpioidMetrics | null;
  opioidCases?: OpioidCases | null;
  laborBreakdown?: LaborBreakdown | null;
  healthcareBreakdown?: HealthcareBreakdown | null;
  childFamilyBreakdown?: ChildFamilyBreakdown | null;
  sectorBreakdown?: SectorBreakdown | null;
};

// Type for the locality selector component props
export type LocalitySelectorProps = {
  block: {
    heading?: string;
    subheading?: string;
    marginTop?: 'none' | 'small' | 'medium' | 'large';
    marginBottom?: 'none' | 'small' | 'medium' | 'large';
  };
  localities: Locality[];
  pageId: string;
};

// Type for the text content component props
export type TextContentProps = {
  block: {
    content: any[];
    sectionId?: string;
    marginTop?: 'none' | 'small' | 'medium' | 'large';
    marginBottom?: 'none' | 'small' | 'medium' | 'large';
    textAlignment?: 'left' | 'center' | 'right';
    backgroundColor?: string;
    customBackgroundColor?: string;
    maxWidth?: number;
  };
  selectedLocality?: Locality;
  localities?: Locality[];
};

// Type for the costs breakdown component props
export type CostsBreakdownProps = {
  block: {
    totalCost: string;
    totalCostSubtitle?: string;
    source?: string;
    costSectors: Array<{
      title: string;
      subtitle?: string;
      value: number;
      color: string;
      textColor?: string;
      description?: any[];
      showLabelAsTooltip?: boolean;
    }>;
    marginTop?: 'none' | 'small' | 'medium' | 'large';
    marginBottom?: 'none' | 'small' | 'medium' | 'large';
    aside?: any[];
  };
};

// Type for the accordion component props
export type AccordionProps = {
  block: {
    title: string;
    headingLevel?: 'span' | 'h2' | 'h3' | 'h4';
    content: any[];
    marginTop?: 'none' | 'small' | 'medium' | 'large';
    marginBottom?: 'none' | 'small' | 'medium' | 'large';
  };
};

// Type for the content wrapper component props
export type ContentWrapperProps = {
  block: {
    _key: string;
    content: any[];
    marginTop?: 'none' | 'small' | 'medium' | 'large';
    marginBottom?: 'none' | 'small' | 'medium' | 'large';
    backgroundColor?: string;
    customBackgroundColor?: string;
    backgroundWidth?: 'full' | 'container' | 'narrow';
    contentWidth?: 'full' | 'container' | 'narrow' | 'custom';
    customContentWidth?: number;
    padding?: 'none' | 'small' | 'medium' | 'large';
  };
  selectedLocality?: Locality;
  localities?: Array<Locality>;
  pageId: string;
  pageType: string;
};

// Type for the on this page component props
export type OnThisPageProps = {
  block: {
    links: Array<{
      title: string;
      destinationId: string;
    }>;
    marginTop?: 'none' | 'small' | 'medium' | 'large';
    marginBottom?: 'none' | 'small' | 'medium' | 'large';
  };
};

// Type for the payer breakdown component props
export type PayerBreakdownProps = {
  block: {
    title: string;
    subtitle: string;
    familiesBusinessesValue: number;
    familiesBusinessesColor: string;
    familiesBusinessesTextColor: string;
    federalValue: number;
    federalColor: string;
    federalTextColor: string;
    stateLocalValue: number;
    stateLocalColor: string;
    stateLocalTextColor: string;
    marginTop?: 'none' | 'small' | 'medium' | 'large';
    marginBottom?: 'none' | 'small' | 'medium' | 'large';
  };
};

// Type for the large button component props
export type LargeButtonProps = {
  block: {
    buttonText: string;
    action: 'download' | 'view' | 'open' | 'custom';
    customAction?: string;
    linkType?: 'url' | 'page';
    url?: string;
    page?: {
      _id: string;
      slug: string;
    };
    openInNewTab?: boolean;
    marginTop?: 'none' | 'small' | 'medium' | 'large';
    marginBottom?: 'none' | 'small' | 'medium' | 'large';
  };
};

// Type for the image component props
export type ImageProps = {
  block: {
    image: {
      asset: {
        _ref: string;
      };
      alt: string;
      caption?: string;
    };
    sectionId?: string;
    marginTop?: 'none' | 'small' | 'medium' | 'large';
    marginBottom?: 'none' | 'small' | 'medium' | 'large';
    imageAlignment?: 'left' | 'center' | 'right';
    backgroundColor?: string;
    customBackgroundColor?: string;
    maxWidth?: number;
    imageSize?: 'small' | 'medium' | 'large' | 'full' | 'custom';
    customImageWidth?: number;
    hasShadow?: boolean;
  };
};

// Type for the sources component props
export type SourcesProps = {
  block: {
    citations: Array<{
      text: any[]; // Rich text content (blockContent)
    }>;
    marginTop?: 'none' | 'small' | 'medium' | 'large';
    marginBottom?: 'none' | 'small' | 'medium' | 'large';
    width?: number;
  };
};

// Type for the sector costs component props
export type SectorCostsProps = {
  block: {
    allSectorsContent: any[];
    lostLaborContent: any[];
    healthcareContent: any[];
    childServicesContent: any[];
    criminalJusticeContent: any[];
    sectionId?: string;
    marginTop?: 'none' | 'small' | 'medium' | 'large';
    marginBottom?: 'none' | 'small' | 'medium' | 'large';
    textAlignment?: 'left' | 'center' | 'right';
    backgroundColor?: string;
    customBackgroundColor?: string;
    maxWidth?: number;
  };
  selectedLocality?: Locality;
  localities: Locality[];
};

// Type for the locality payor breakdown component props
export type LocalityPayorBreakdownProps = {
  block: {
    title: string;
    maxWidth?: number;
    marginTop?: 'none' | 'small' | 'medium' | 'large';
    marginBottom?: 'none' | 'small' | 'medium' | 'large';
  };
  localities: Locality[];
};

// Type for the locality demographics component props
export type LocalityDemographicsProps = {
  block: {
    sectionId?: string;
    marginTop?: 'none' | 'small' | 'medium' | 'large';
    marginBottom?: 'none' | 'small' | 'medium' | 'large';
    textAlignment?: 'left' | 'center' | 'right';
    backgroundColor?: string;
    customBackgroundColor?: string;
    maxWidth?: number;
  };
};

// Type for the horizontal rule component props
export type HorizontalRuleProps = {
  block: {
    width?: number;
    thickness?: number;
    color?: string;
    customColor?: string;
    marginTop?: 'none' | 'small' | 'medium' | 'large';
    marginBottom?: 'none' | 'small' | 'medium' | 'large';
  };
};

// Type for the poverty income component props
export type PovertyIncomeProps = {
  block: {
    sectionId?: string;
    marginTop?: 'none' | 'small' | 'medium' | 'large';
    marginBottom?: 'none' | 'small' | 'medium' | 'large';
    textAlignment?: 'left' | 'center' | 'right';
    backgroundColor?: string;
    customBackgroundColor?: string;
    maxWidth?: number;
    povertySource?: number;
    medianIncomeSource?: number;
    statePovertyPct?: number;
    stateMedianIncome?: number;
  };
}; 