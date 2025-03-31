export type OpioidMetrics = {
  totalPerCapita: number;
  totalTotal: number;
  laborPerCapita: number;
  laborTotal: number;
  healthcarePerCapita: number;
  healthcareTotal: number;
  crimeOtherPerCapita: number;
  crimeOtherTotal: number;
  householdPerCapita: number;
  householdTotal: number;
  totalTotalPercentile: number;
  totalTotalComparison: string;
  totalPerCapitaPercentile: number;
  totalPerCapitaComparison: string;
};

export type Demographics = {
  totalPopulation: number;
  medianAge: number;
  medianIncome: number;
  povertyPct: number;
};

export type Regions = {
  healthDistrict: string;
  healthRegion: string;
  cooperCtrRegion: string;
};

export type Classification = {
  category: string;
  urbanRural: string;
  metroNonMetro: string;
};

export type Locality = {
  _id: string;
  counties: string;
  fips: string;
  demographics: Demographics;
  regions: Regions;
  classification: Classification;
  opioidMetrics: OpioidMetrics;
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
  };
  selectedLocality?: Locality;
}; 