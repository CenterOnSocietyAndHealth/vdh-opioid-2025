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
  initialLocality 
}: { 
  children: React.ReactNode;
  initialLocality: Locality | null;
}) {
  const [selectedLocality, setSelectedLocality] = useState<Locality | null>(initialLocality);
  const [isUpdating, setIsUpdating] = useState(false);

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