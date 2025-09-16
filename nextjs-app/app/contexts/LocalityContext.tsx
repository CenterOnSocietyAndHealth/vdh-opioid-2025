'use client';

import React, { createContext, useContext, useState } from 'react';
import { Locality } from '@/app/types/locality';

type LocalityContextType = {
  selectedLocality: Locality | null;
  setSelectedLocality: (locality: Locality | null) => void;
  isUpdating: boolean;
  setIsUpdating: (updating: boolean) => void;
};

const LocalityContext = createContext<LocalityContextType | undefined>(undefined);

export function LocalityProvider({ 
  children, 
  initialLocality,
  localities 
}: { 
  children: React.ReactNode;
  initialLocality: Locality | null;
  localities?: Locality[];
}) {
  // Default to Virginia if no initialLocality is provided
  const getDefaultLocality = () => {
    if (initialLocality) return initialLocality;
    if (localities) {
      // Find Virginia Total in the localities array
      const virginia = localities.find(loc => 
        loc.counties === 'Virginia Total' || 
        loc.fips === 'us-va-999' ||
        loc.marcCountyId === '999'
      );
      return virginia || null;
    }
    return null;
  };

  const [selectedLocality, setSelectedLocality] = useState<Locality | null>(getDefaultLocality());
  const [isUpdating, setIsUpdating] = useState(false);

  // Update selectedLocality when localities change (if no locality is currently selected)
  React.useEffect(() => {
    if (!selectedLocality && localities) {
      const virginia = localities.find(loc => 
        loc.counties === 'Virginia Total' || 
        loc.fips === 'us-va-999' ||
        loc.marcCountyId === '999'
      );
      if (virginia) {
        setSelectedLocality(virginia);
      }
    }
  }, [localities, selectedLocality]);

  // Debug: Monitor changes to selectedLocality
  React.useEffect(() => {
    console.log('LocalityContext: selectedLocality changed to:', selectedLocality);
  }, [selectedLocality]);

  return (
    <LocalityContext.Provider value={{ 
      selectedLocality, 
      setSelectedLocality,
      isUpdating,
      setIsUpdating
    }}>
      {children}
    </LocalityContext.Provider>
  );
}

export function useLocality() {
  const context = useContext(LocalityContext);
  if (context === undefined) {
    throw new Error('useLocality must be used within a LocalityProvider');
  }
  return context;
} 