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
  urbanRural?: string;
  metroNonMetro?: string;
};

export type Locality = {
  _id: string;
  counties: string;
  fips: string;
  demographics: Demographics | null;
  regions: Regions | null;
  classification: Classification | null;
  opioidMetrics: OpioidMetrics | null;
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
    marginTop?: 'none' | 'small' | 'medium' | 'large';
    marginBottom?: 'none' | 'small' | 'medium' | 'large';
    isAside?: boolean;
    backgroundColor?: string;
    textAlignment?: 'left' | 'center' | 'right';
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