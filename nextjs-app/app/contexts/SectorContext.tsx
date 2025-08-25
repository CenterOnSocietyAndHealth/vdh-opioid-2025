'use client';

import React, { createContext, useContext, useState } from 'react';

export type Sector = 'All Sectors' | 'Lost Labor' | 'Healthcare' | 'Child Services & K12' | 'Criminal Justice';

type SectorContextType = {
  selectedSector: Sector;
  setSelectedSector: (sector: Sector) => void;
};

const SectorContext = createContext<SectorContextType | undefined>(undefined);

export function SectorProvider({ 
  children 
}: { 
  children: React.ReactNode;
}) {
  const [selectedSector, setSelectedSector] = useState<Sector>('All Sectors');

  return (
    <SectorContext.Provider value={{ 
      selectedSector, 
      setSelectedSector
    }}>
      {children}
    </SectorContext.Provider>
  );
}

export function useSector() {
  const context = useContext(SectorContext);
  if (context === undefined) {
    throw new Error('useSector must be used within a SectorProvider');
  }
  return context;
}
