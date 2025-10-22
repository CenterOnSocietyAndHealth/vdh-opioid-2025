import { Locality } from './locality';

export type CostsMapIndicator = 'Total' | 'Labor' | 'HealthCare' | 'Crime_Other' | 'Household';
export type DisplayType = 'PerCapita' | 'Total';

export interface CostsMapProps {
  block: {
    _key: string;
    _type: 'costsMaps';
    title?: string;
    defaultIndicator?: CostsMapIndicator;
    type?: DisplayType;
    marginTop?: string;
    marginBottom?: string;
    totalDescription?: any[];
    laborDescription?: any[];
    healthcareDescription?: any[];
    crimeOtherDescription?: any[];
    householdDescription?: any[];
    totalSources?: any[];
    laborSources?: any[];
    healthcareSources?: any[];
    crimeOtherSources?: any[];
    householdSources?: any[];
    // Annotation fields
    totalLeftAnnotation?: string;
    totalTopAnnotation?: string;
    totalRightAnnotation?: string;
    laborLeftAnnotation?: string;
    laborTopAnnotation?: string;
    laborRightAnnotation?: string;
    healthcareLeftAnnotation?: string;
    healthcareTopAnnotation?: string;
    healthcareRightAnnotation?: string;
    crimeOtherLeftAnnotation?: string;
    crimeOtherTopAnnotation?: string;
    crimeOtherRightAnnotation?: string;
    householdLeftAnnotation?: string;
    householdTopAnnotation?: string;
    householdRightAnnotation?: string;
  };
  localities?: Locality[];
  selectedLocality: Locality | null;
  pageId: string;
} 