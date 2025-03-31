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
  };
  localities?: Locality[];
  selectedLocality: Locality | null;
  pageId: string;
} 