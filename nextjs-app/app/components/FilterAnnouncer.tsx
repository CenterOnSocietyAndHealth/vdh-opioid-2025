'use client';

import { useEffect, useRef, useState } from 'react';
import { useLocality } from '@/app/contexts/LocalityContext';
import { useSector } from '@/app/contexts/SectorContext';
import { Locality } from '@/app/types/locality';

function getLocalityLabel(locality: Locality | null) {
  if (!locality) {
    return 'State of Virginia';
  }

  const name = locality.counties?.trim();
  if (
    !name ||
    name === 'Virginia Total' ||
    locality.fips === 'us-va-999' ||
    locality.marcCountyId === '999'
  ) {
    return 'State of Virginia';
  }

  return name;
}

export default function FilterAnnouncer() {
  const { selectedLocality, isUpdating } = useLocality();
  const { selectedSector } = useSector();
  const [message, setMessage] = useState('');
  const isFirstRender = useRef(true);
  const prevLocalityId = useRef<string | null>(null);
  const prevSector = useRef<string | null>(null);
  const wasUpdating = useRef(false);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      prevLocalityId.current = selectedLocality?._id ?? 'state';
      prevSector.current = selectedSector;
      wasUpdating.current = isUpdating;
      return;
    }

    if (isUpdating && !wasUpdating.current) {
      wasUpdating.current = true;
      setMessage(`Updating data for ${getLocalityLabel(selectedLocality)}.`);
      return;
    }

    if (!isUpdating && wasUpdating.current) {
      wasUpdating.current = false;
      prevLocalityId.current = selectedLocality?._id ?? 'state';
      setMessage(`Showing data for ${getLocalityLabel(selectedLocality)}.`);
      return;
    }

    const localityId = selectedLocality?._id ?? 'state';
    if (!isUpdating && localityId !== prevLocalityId.current) {
      prevLocalityId.current = localityId;
      setMessage(`Showing data for ${getLocalityLabel(selectedLocality)}.`);
      return;
    }

    if (!isUpdating && selectedSector !== prevSector.current) {
      prevSector.current = selectedSector;
      setMessage(`Filtering by ${selectedSector}.`);
    }
  }, [selectedLocality, selectedSector, isUpdating]);

  return (
    <div className="sr-only" aria-live="polite" aria-atomic="true">
      {message}
    </div>
  );
}
