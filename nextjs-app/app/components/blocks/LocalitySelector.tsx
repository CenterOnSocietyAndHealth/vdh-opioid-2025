'use client';

import React, { useState, useEffect } from 'react';
import { useLocality } from '@/app/contexts/LocalityContext';
import { LocalitySelectorProps, Locality } from '@/app/types/locality';

type OptionType = {
  value: string;
  label: string;
};

const marginMap = {
  none: 'mt-0',
  small: 'mt-4',
  medium: 'mt-8',
  large: 'mt-16',
};

const marginBottomMap = {
  none: 'mb-0',
  small: 'mb-4',
  medium: 'mb-8',
  large: 'mb-16',
};

export default function LocalitySelector({ block, localities, pageId }: LocalitySelectorProps) {
  const [mounted, setMounted] = useState(false);
  const [Select, setSelect] = useState<any>(null);
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const { selectedLocality, setSelectedLocality, isUpdating, setIsUpdating } = useLocality();

  useEffect(() => {
    // Import react-select only on the client side
    import('react-select').then((module) => {
      setSelect(() => module.default);
      setMounted(true);
    });
  }, []);

  console.log('LocalitySelector props:', {
    pageId,
    localitiesCount: localities?.length,
    block
  });

  // Prepare options for react-select
  const options: OptionType[] = [
    { value: "State", label: "State of Virginia" },
    ...(localities ? localities.map((locality) => ({
      value: locality._id,
      label: locality.counties,
    })).sort((a, b) => a.label.localeCompare(b.label)) : [])
  ];

  console.log('Prepared options:', options);

  // Get the current value based on selectedLocality
  const currentValue = selectedLocality 
    ? options.find(opt => opt.value === selectedLocality._id) || options[0]
    : options[0];

  // Event handler for setting the selected locality
  const handleSetLocality = async (selectedOption: OptionType | null) => {
    if (!selectedOption || isUpdating) return;

    const localityId = selectedOption.value;
    console.log('LocalitySelector: handleSetLocality called with:', selectedOption);
    setIsUpdating(true);
    
    // Dispatch update start event
    window.dispatchEvent(new Event('localityUpdateStart'));
    
    try {
      // Update the selected locality in state
      const newLocality = localityId === "State" ? null : 
        localities?.find(l => l._id === localityId) || null;
      
      console.log('LocalitySelector: Found locality:', newLocality);
      
      // Make sure we have all the required fields
      if (newLocality && !newLocality.opioidMetrics?.totalTotalPercentile) {
        console.error('Locality data is missing required fields:', newLocality);
        return;
      }
      
      console.log('LocalitySelector: Calling setSelectedLocality with:', newLocality);
      setSelectedLocality(newLocality);
      console.log('LocalitySelector: setSelectedLocality called');
    } catch (error) {
      console.error('Error updating selected locality:', error);
    } finally {
      setIsUpdating(false);
      // Dispatch update end event
      window.dispatchEvent(new Event('localityUpdateEnd'));
    }
  };

  const { heading = 'SEARCH:', subheading = 'By Locality (County or Independent City)', marginTop = 'medium', marginBottom = 'medium' } = block;

  // Don't render anything until the component is mounted on the client
  if (!mounted || !Select) {
    return (
      <div className={`${marginMap[marginTop]} ${marginBottomMap[marginBottom]} flex justify-center items-center`}>
        <div className="relative text-center">
          <label className="inline-block mb-3 font-bold font-lato text-base">
            {heading}
          </label>
          <span className="relative inline-block font-light ml-2 mb-3 text-lg">
            {subheading}
          </span>
          <div className="flex">
            <div className="h-[60px] w-[400px] border border-gray-300 rounded-none flex items-center px-4">
              Loading...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${marginMap[marginTop]} ${marginBottomMap[marginBottom]} flex justify-center items-center`}>
      <div className="relative text-center">
        <h3 className="relative inline-block ml-2 mb-1">
          {subheading}
        </h3>
        <div className="flex">
          <Select
            options={options}
            onChange={handleSetLocality}
            value={currentValue}
            isDisabled={isUpdating}
            placeholder="County or Independent City"
            onMenuOpen={() => setMenuIsOpen(true)}
            onMenuClose={() => setMenuIsOpen(false)}
            styles={{
              control: (base: any, state: any) => ({
                ...base,
                border: 'none',
                borderBottom: '1px solid black',
                borderRadius: 0,
                flex: 1,
                height: 45,
                width: 400,
                backgroundColor: '#FAF9F8',
                cursor: isUpdating ? "not-allowed" : "pointer",
                opacity: isUpdating ? 0.7 : 1,
                '&:hover': {
                  borderBottom: '1px solid black',
                },
                boxShadow: state.isFocused ? 'none' : 'none',
                '&:focus-within': {
                  boxShadow: 'none',
                },
              }),
              valueContainer: (base: any, state: any) => ({
                ...base,
                height: '100%',
                padding: '0 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: isUpdating ? "not-allowed" : "pointer",
                width: '100%',
                // Force positioning to prevent jumping
                position: 'relative',
                top: '0',
                transform: 'none',
              }),
              singleValue: (base: any, state: any) => ({
                ...base,
                margin: 0,
                padding: 0,
                color: '#1E1E1E',
                textAlign: 'center',
                fontFamily: '"DM Sans"',
                fontSize: '25px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '150%',
                letterSpacing: '-0.475px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // Prevent any movement when focused
                position: 'relative',
                top: '0',
                left: '0',
                transform: 'none',
                transition: 'none',
              }),
              placeholder: (base: any) => ({
                ...base,
                margin: 0,
                padding: 0,
                color: '#1E1E1E',
                textAlign: 'center',
                fontFamily: '"DM Sans"',
                fontSize: '25px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: '150%',
                letterSpacing: '-0.475px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                // Prevent any movement
                position: 'relative',
                top: '0',
                left: '0',
                transform: 'none',
                transition: 'none',
              }),
              menu: (base: any) => ({
                ...base,
                zIndex: 10,
                fontWeight: 300,
                fontFamily: 'Lato, sans-serif',
                marginTop: 2,
                textAlign: 'center',
              }),
              menuList: (base: any) => ({
                ...base,
                textAlign: 'center',
              }),
              option: (base: any, state: any) => ({
                ...base,
                padding: '12px 12px 8px 12px',
                backgroundColor: state.isFocused ? '#f3f4f6' : 'white',
                color: 'black',
                cursor: 'pointer',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                height: '40px',
                '&:active': {
                  backgroundColor: '#e5e7eb',
                },
              }),
              dropdownIndicator: (base: any) => ({
                ...base,
                color: 'black',
                transform: 'scale(1.2)',
                padding: '0 8px',
              }),
              indicatorSeparator: () => ({
                display: 'none',
              }),
              indicatorsContainer: (base: any) => ({
                ...base,
                height: 45,
                width: 45,
                cursor: isUpdating ? "not-allowed" : "pointer",
              }),
              input: (base: any) => ({
                ...base,
                margin: 0,
                padding: 0,
                color: 'transparent',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                pointerEvents: 'none',
              }),
            }}
          />
        </div>
      </div>
    </div>
  );
} 