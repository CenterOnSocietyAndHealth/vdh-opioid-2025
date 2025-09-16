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
  totalPopulation?: number;
  medianAge?: number;
  medianIncome?: number;
  povertyPct?: number;
};

export type Regions = {
  healthDistrict?: string;
  healthRegion?: string;
  cooperCtrRegion?: string;
};

export type Classification = {
  category?: string;
  categoryDescription?: string;
  urbanRural?: string;
  metroNonMetro?: string;
};

export type StateComparisons = {
  hhmiState?: string;
  hhmiQuartile?: string;
  povertyRateState?: string;
  povertyRateQuartile?: string;
  hhmiQuartileProse?: string;
};

export type OpioidCases = {
  oudDeaths2023?: number;
  oudCases2023?: number;
};

export type LaborBreakdown = {
  laborFatal?: number;
  laborOUD?: number;
  laborIncarceration?: number;
};

export type HealthcareBreakdown = {
  healthED?: number;
  healthHosp?: number;
  healthAmbulanceNalax?: number;
  healthIndirect?: number;
};

export type ChildFamilyBreakdown = {
  childFamilyAssistance?: number;
  childFamilyK12Ed?: number;
};

export type SectorBreakdown = {
  householdSectorTotal?: number;
  fedGovtSectorTotal?: number;
  stateLocalSectorTotal?: number;
};

export type Locality = {
  _id: string;
  counties: string;
  fips: string;
  countyFips?: string;
  marcCountyId?: string;
  Total_PerCapita?: number;
  Labor_PerCapita?: number;
  HealthCare_PerCapita?: number;
  Crime_Other_PerCapita?: number;
  Household_PerCapita?: number;
  demographics?: Demographics;
  regions?: Regions;
  classification?: Classification;
  stateComparisons?: StateComparisons;
  opioidMetrics?: OpioidMetrics;
  opioidCases?: OpioidCases;
  laborBreakdown?: LaborBreakdown;
  healthcareBreakdown?: HealthcareBreakdown;
  childFamilyBreakdown?: ChildFamilyBreakdown;
  sectorBreakdown?: SectorBreakdown;
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
    url?: string;
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
}; 