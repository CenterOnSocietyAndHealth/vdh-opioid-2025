'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';
import { Locality } from '@/app/types/locality';
import { CostsMapIndicator, DisplayType } from '@/app/types/costsMaps';

type ChoroplethMapProps = {
  indicator: CostsMapIndicator;
  displayType: DisplayType;
  selectedLocality: Locality | null;
  localities: Locality[];
  colors: string[];
  strokeColor: string;
  totalValue: number;
  onLocalityClick?: (locality: Locality) => void;
};

export default function ChoroplethMap({ 
  indicator, 
  displayType, 
  selectedLocality, 
  localities, 
  colors,
  strokeColor,
  totalValue,
  onLocalityClick
}: ChoroplethMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 800);
  const mapGroupRef = useRef<SVGGElement | null>(null);
  const [transform, setTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);
  const [isInitialized, setIsInitialized] = useState(false);

  // Function to format numbers in a readable way
  function formatNumber(num: number, prefix = "", suffix = "") {
    if (num === undefined || num === null) return "N/A";
    const value = Number(num.toPrecision(3));
    if (value >= 1e9) return `${prefix}` + (value / 1e9).toFixed(2) + 'B' + `${suffix}`;
    if (value >= 1e6) return `${prefix}` + (value / 1e6).toFixed(0) + 'M' + `${suffix}`;
    if (value >= 1e3) return `${prefix}` + (value / 1e3).toFixed(1) + 'K' + `${suffix}`;
    return `${prefix}` + Math.round(value) + `${suffix}`;
  }

  // Indicator display names
  const indicatorDisplayNames = useMemo<Record<CostsMapIndicator, string>>(() => ({
    'Total': 'Total',
    'Labor': 'Lost Labor',
    'HealthCare': 'Healthcare',
    'Crime_Other': 'Criminal Justice',
    'Household': 'Child Services & K-12',
  }), []);

  // Get field path for accessing data
  const getFieldPath = (locality: Locality, indicator: CostsMapIndicator, type: DisplayType) => {
    const basePath = 'opioidMetrics';
    let fieldName = indicator.toLowerCase();
    
    // Special case for Crime_Other to match the field names in the data
    if (fieldName === 'crime_other') {
      fieldName = 'crimeOther';
    }
    // Special case for HealthCare to match the field names in the data
    if (fieldName === 'healthcare') {
      fieldName = 'healthcare';
    }
    
    const typeSuffix = type === 'PerCapita' ? 'PerCapita' : 'Total';
    return `${basePath}.${fieldName}${typeSuffix}`;
  };

  // Get value from nested property path
  const getValueFromPath = (obj: any, path: string): number => {
    const value = path.split('.').reduce((o, key) => (o?.[key] !== undefined ? o[key] : 0), obj);
    return value || 0;
  };

  // Set up window resize handler
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    // Set initial width
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Debug: Monitor changes to selectedLocality prop
  useEffect(() => {
    console.log('ChoroplethMap: selectedLocality prop changed to:', selectedLocality);
  }, [selectedLocality]);

  // Drawing the map
  useEffect(() => {
    // Skip if SVG ref isn't available or localities aren't loaded
    if (!svgRef.current || localities.length === 0) return;

    console.log('ChoroplethMap: Drawing map with selectedLocality:', selectedLocality);

    const drawMap = async () => {
      try {
        // Set initialized state to true after first render
        setIsInitialized(true);

        // Load Virginia counties GeoJSON
        console.log('Attempting to load TopoJSON from: /virginia-counties.json');
        const response = await fetch('/virginia-counties.json');
        if (!response.ok) {
          console.error(`Failed to load map data: ${response.status} ${response.statusText}`);
          console.error(`URL attempted: ${response.url}`);
          const text = await response.text();
          console.error(`Response content (first 100 chars): ${text.substring(0, 100)}`);
          throw new Error(`Failed to load map data: ${response.status} ${response.statusText}`);
        }
        
        // Parse the response
        let topoData;
        try {
          const text = await response.text();
          console.log(`Response starts with: ${text.substring(0, 50)}`);
          topoData = JSON.parse(text);
        } catch (parseError) {
          console.error('Failed to parse JSON:', parseError);
          throw parseError;
        }
        
        // Debug the data structure
        console.log('Topology data loaded:', topoData);
        
        // Check if it's TopoJSON (has type: "Topology")
        let geoData;
        if (topoData.type === "Topology") {
          console.log('Converting TopoJSON to GeoJSON');
          // Get the first object in the TopoJSON
          const objectName = Object.keys(topoData.objects)[0];
          if (!objectName) {
            console.error('No objects found in TopoJSON');
            throw new Error('Invalid TopoJSON structure - no objects found');
          }
          
          // Convert TopoJSON to GeoJSON
          // Use type assertion to handle the result
          const featureResult = topojson.feature(topoData, topoData.objects[objectName]) as any;
          
          // Create a proper GeoJSON FeatureCollection
          if (featureResult.type === 'FeatureCollection') {
            geoData = featureResult;
          } else {
            // If it's a single feature, wrap it in a FeatureCollection
            geoData = {
              type: 'FeatureCollection',
              features: [featureResult]
            };
          }
          
          console.log('Converted to GeoJSON:', geoData);
        } else if (topoData.type === "FeatureCollection" && Array.isArray(topoData.features)) {
          // It's already GeoJSON
          geoData = topoData;
        } else {
          console.error('Invalid data structure - not TopoJSON or GeoJSON:', topoData);
          throw new Error('Invalid data structure - not TopoJSON or GeoJSON');
        }
        
        // Check if features array exists after conversion
        if (!geoData || !geoData.features || !Array.isArray(geoData.features)) {
          console.error('Invalid GeoJSON structure - missing features array:', geoData);
          throw new Error('Invalid GeoJSON structure - missing features array');
        }
        
        if (geoData.features.length === 0) {
          console.warn('GeoJSON features array is empty');
        }
        
        // Set up dimensions
        const isMobile = windowWidth <= 768;
        const width = isMobile ? windowWidth - 40 : 1050;
        const height = isMobile ? 500 : 500;
        
        // Create a color scale based on values from all localities
        const values = localities.map(locality => 
          getValueFromPath(locality, getFieldPath(locality, indicator, displayType))
        ).filter(val => val !== undefined && val !== null);
        
        const colorScale = d3.scaleQuantile<string>()
          .domain(values)
          .range(colors);
        
        // Clear previous SVG content
        d3.select(svgRef.current).selectAll("*").remove();
        
        // Create the SVG
        const svg = d3.select(svgRef.current)
          .attr("width", width)
          .attr("height", height)
          .attr("viewBox", [0, 0, width, height].join(" "))
          .attr("style", "max-width: 100%; height: auto;");
        
        // Add drop shadow filter
        const defs = svg.append("defs");
        const filter = defs.append("filter")
          .attr("id", "drop-shadow");
        
        // Very simple drop shadow
        filter.append("feDropShadow")
          .attr("dx", "0")
          .attr("dy", "2")
          .attr("stdDeviation", "2")
          .attr("flood-color", "black")
          .attr("flood-opacity", "0.3");
        
        // Create projection with initial position settings
        const projection = d3.geoAlbers()
          .scale(isMobile ? 4000 : 9000)
          .rotate([78, 0, 0])
          .center([-1.6, 38.1])
          .translate([width / 2, height / 2]);
        
        // Create path generator
        const path = d3.geoPath()
          .projection(projection);
        
        // Create a group for the map elements that will be transformed
        const mapGroup = svg.append("g")
          .attr("class", "map-group");
        
        // Store reference to the map group for use in zoom/pan functions
        mapGroupRef.current = mapGroup.node();
        
        // Add a simple title for accessibility
        svg.append("title")
          .text("Virginia counties map");
        
        // Draw counties in the map group
        const counties = mapGroup.append("g")
          .attr("class", "counties")
          .selectAll("path")
          .data(() => {
            // Reorder features so selected locality is drawn last (on top)
            if (!selectedLocality) return geoData.features;
            
            const sortedFeatures = [...geoData.features];
            const selectedIndex = sortedFeatures.findIndex((f: any) => {
              // Get FIPS code using various property names
              let fipsCode = f.properties.FIPS || f.properties.fips || f.properties.GEOID || 
                            f.properties.id || f.id;
              
              // Add prefix if needed
              if (fipsCode && typeof fipsCode === 'string' && fipsCode.length === 3) {
                fipsCode = `51${fipsCode}`;
              }
              
              // Get locality name
              const countyName = f.properties.NAME || f.properties.name;
              
              // Clean up locality FIPS code for comparison
              let locFips = selectedLocality.fips;
              
              if (locFips) {
                // Remove 'us-va-' prefix if present
                locFips = locFips.replace('us-va-', '');
                // Remove any remaining non-numeric characters
                locFips = locFips.toString().replace(/\D/g, '');
                // Ensure it's 5 digits
                locFips = locFips.padStart(3, '0');
                // Add state prefix if not present
                if (locFips.length === 3) {
                  locFips = `51${locFips}`;
                }
              }
              
              const fipsMatch = fipsCode && locFips === fipsCode;
              const nameMatch = countyName && selectedLocality.counties === countyName;
              
              return fipsMatch || nameMatch;
            });
            
            if (selectedIndex !== -1) {
              // Move selected locality to the end
              const [selectedFeature] = sortedFeatures.splice(selectedIndex, 1);
              sortedFeatures.push(selectedFeature);
            }
            
            return sortedFeatures;
          })
          .enter()
          .append("path")
          .attr("d", path as any)
          .attr("fill", (d: any) => {
            // Find matching locality by FIPS code or name
            // GeoJSON files can have different property names for FIPS codes
            let fipsCode = d.properties?.FIPS || d.properties?.fips || d.properties?.GEOID || 
                           d.properties?.id || d.id;
            
            // Get county name from properties
            const countyName = d.properties?.NAME || d.properties?.name || d.properties?.NAMELSAD;
            
            // Clean up FIPS code format
            if (fipsCode) {
              // Remove any non-numeric characters
              fipsCode = fipsCode.toString().replace(/\D/g, '');
              // Ensure it's 5 digits (add leading zeros if needed)
              fipsCode = fipsCode.padStart(3, '0');
              // Add state prefix if not present
              if (fipsCode.length === 3) {
                fipsCode = `51${fipsCode}`;
              }
            }
            
            // Try to find a matching locality by FIPS or name
            const locality = localities.find(loc => {
              // Clean up locality FIPS code for comparison
              let locFips = loc.fips;
              
              if (locFips) {
                // Remove 'us-va-' prefix if present
                locFips = locFips.replace('us-va-', '');
                // Remove any remaining non-numeric characters
                locFips = locFips.toString().replace(/\D/g, '');
                // Ensure it's 5 digits
                locFips = locFips.padStart(3, '0');
                // Add state prefix if not present
                if (locFips.length === 3) {
                  locFips = `51${locFips}`;
                }
              }
              
              const nameMatch = countyName && loc.counties === countyName;
              const fipsMatch = fipsCode && locFips === fipsCode;
              
              return fipsMatch || nameMatch;
            });
            
            if (!locality) {
              return "#ccc";
            }
            
            const value = getValueFromPath(
              locality, 
              getFieldPath(locality, indicator, displayType)
            );
            
            return value ? colorScale(value) : "#ccc";
          })
          .attr("stroke", (d: any) => {
            // Check if this is the selected locality
            if (!selectedLocality) return strokeColor; // Use strokeColor prop
            
            // Check different property variations for FIPS code match
            let fipsCode = d.properties.FIPS || d.properties.fips || d.properties.GEOID || 
                           d.properties.id || d.id;
                           
            // Add prefix if needed
            if (fipsCode && typeof fipsCode === 'string' && fipsCode.length === 3) {
              fipsCode = `51${fipsCode}`;
            }
            
            // Get locality name
            const countyName = d.properties.NAME || d.properties.name;
            
            // Clean up locality FIPS code for comparison
            let locFips = selectedLocality.fips;
            
            if (locFips) {
              // Remove 'us-va-' prefix if present
              locFips = locFips.replace('us-va-', '');
              // Remove any remaining non-numeric characters
              locFips = locFips.toString().replace(/\D/g, '');
              // Ensure it's 5 digits
              locFips = locFips.padStart(3, '0');
              // Add state prefix if not present
              if (locFips.length === 3) {
                locFips = `51${locFips}`;
              }
            }
            
            const fipsMatch = fipsCode && locFips === fipsCode;
            const nameMatch = countyName && selectedLocality.counties === countyName;
            
            if (fipsMatch || nameMatch) {
              return "#FFD900"; // Selected locality gets gold stroke
            }
            return strokeColor; // Other localities get strokeColor prop
          })
          .attr("stroke-opacity", 1)
          .attr("stroke-width", (d: any) => {
            // Highlight selected locality
            if (!selectedLocality) return 0.5;
            
            // Check different property variations for FIPS code match
            let fipsCode = d.properties.FIPS || d.properties.fips || d.properties.GEOID || 
                           d.properties.id || d.id;
                           
            // Add prefix if needed
            if (fipsCode && typeof fipsCode === 'string' && fipsCode.length === 3) {
              fipsCode = `51${fipsCode}`;
            }
            
            // Get locality name
            const countyName = d.properties.NAME || d.properties.name;
            
            // Clean up locality FIPS code for comparison
            let locFips = selectedLocality.fips;
            
            if (locFips) {
              // Remove 'us-va-' prefix if present
              locFips = locFips.replace('us-va-', '');
              // Remove any remaining non-numeric characters
              locFips = locFips.toString().replace(/\D/g, '');
              // Ensure it's 5 digits
              locFips = locFips.padStart(3, '0');
              // Add state prefix if not present
              if (locFips.length === 3) {
                locFips = `51${locFips}`;
              }
            }
            
            const fipsMatch = fipsCode && locFips === fipsCode;
            const nameMatch = countyName && selectedLocality.counties === countyName;
            
            if (fipsMatch || nameMatch) {
              return 2;
            }
            return 0.5;
          })
          .style("cursor", "pointer")
          .on("click", (event: any, d: any) => {
            // Get FIPS code using various property names
            let fipsCode = d.properties.FIPS || d.properties.fips || d.properties.GEOID || 
                          d.properties.id || d.id;
            
            // Add prefix if needed
            if (fipsCode && typeof fipsCode === 'string' && fipsCode.length === 3) {
              fipsCode = `51${fipsCode}`;
            }
            
            // Get locality name
            const countyName = d.properties.NAME || d.properties.name;
            
            console.log('Map click - FIPS:', fipsCode, 'County:', countyName);
            console.log('Available localities:', localities.map(l => ({ id: l._id, name: l.counties, fips: l.fips })));
            
            // Try to find matching locality
            const locality = localities.find(loc => {
              // Clean up locality FIPS code for comparison
              let locFips = loc.fips;
              
              if (locFips) {
                // Remove 'us-va-' prefix if present
                locFips = locFips.replace('us-va-', '');
                // Remove any remaining non-numeric characters
                locFips = locFips.toString().replace(/\D/g, '');
                // Ensure it's 5 digits
                locFips = locFips.padStart(3, '0');
                // Add state prefix if not present
                if (locFips.length === 3) {
                  locFips = `51${locFips}`;
                }
              }
              
              const fipsMatch = fipsCode && locFips === fipsCode;
              const nameMatch = countyName && loc.counties === countyName;
              
              console.log(`Comparing: ${loc.counties} - FIPS: ${locFips} vs ${fipsCode} (${fipsMatch}), Name: ${loc.counties} vs ${countyName} (${nameMatch})`);
              
              return fipsMatch || nameMatch;
            });
            
            console.log('Matched locality:', locality);
            
            if (locality && onLocalityClick) {
              console.log('Calling onLocalityClick with:', locality);
              onLocalityClick(locality);
            } else {
              console.log('No locality found or no onLocalityClick handler');
            }
          })
          .on("mouseover", (event: any, d: any) => {
            // Handle mouseover event
            // Get FIPS code using various property names
            let fipsCode = d.properties.FIPS || d.properties.fips || d.properties.GEOID || 
                          d.properties.id || d.id;
            
            // Add prefix if needed
            if (fipsCode && typeof fipsCode === 'string' && fipsCode.length === 3) {
              fipsCode = `51${fipsCode}`;
            }
            
            // Get locality name
            const countyName = d.properties.NAME || d.properties.name;
            
            // Try to find matching locality
            const locality = localities.find(loc => {
              // Clean up locality FIPS code for comparison
              let locFips = loc.fips;
              
              if (locFips) {
                // Remove 'us-va-' prefix if present
                locFips = locFips.replace('us-va-', '');
                // Remove any remaining non-numeric characters
                locFips = locFips.toString().replace(/\D/g, '');
                // Ensure it's 5 digits
                locFips = locFips.padStart(3, '0');
                // Add state prefix if not present
                if (locFips.length === 3) {
                  locFips = `51${locFips}`;
                }
              }
              
              const fipsMatch = fipsCode && locFips === fipsCode;
              const nameMatch = countyName && loc.counties === countyName;
              
              return fipsMatch || nameMatch;
            });
            
            if (locality) {
              const perCapitaValue = getValueFromPath(
                locality, 
                getFieldPath(locality, indicator, 'PerCapita')
              );
              
              const totalValue = getValueFromPath(
                locality, 
                getFieldPath(locality, indicator, 'Total')
              );
              
              setTooltipContent(`
                <div style="font-family: Inter; font-size: 12px; line-height: 180%; letter-spacing: -0.228px;">
                  <div style="color: #1E1E1E; font-weight: 700;">${locality.counties}</div>
                  <div style="color: #1E1E1E; font-weight: 400;"><span style="font-weight: 700;">$${formatNumber(perCapitaValue, '', ' per capita')}</span></div>
                  <div style="color: #1E1E1E; font-weight: 400;"><span style="font-weight: 700;">$${formatNumber(totalValue, '', ' total')}</span></div>
                </div>
              `);
              
              setTooltipPosition({ 
                x: event.pageX, 
                y: event.pageY
              });
              
              setTooltipVisible(true);
            }
          })
          .on("mouseout", () => {
            setTooltipVisible(false);
          });
          
        // No panning or zoom interactions enabled
        
        // Create legend and UI elements outside of the map group so they don't get transformed
        // These are fixed elements that shouldn't move with the map
        
        // Create legend
        const legendWidth = isMobile ? width : 165;
        const legendHeight = isMobile ? 40 : 85;
        const boxSize = 18; // Fixed width
        const boxHeight = 20; // Fixed height
        const spacing = isMobile ? 30 : 20;
        
        const legend = svg.append("g")
          .attr("transform", `translate(${isMobile ? 20 : 150}, ${isMobile ? height - legendHeight - 20 : 100})`);
        
        legend.append("rect")
          .attr("width", legendWidth)
          .attr("height", legendHeight + 10)
          .attr("fill", "white")
          .attr("stroke", "#ddd")
          .attr("stroke-width", 0);
        
        // Add sector name label above the legend
        legend.append("text")
          .attr("x", 10)
          .attr("y", -10)
          .attr("text-anchor", "start")
          .attr("font-family", "Inter")
          .attr("font-weight", "400")
          .attr("font-size", "14px")
          .attr("fill", "#1E1E1E")
          .attr("line-height", "170%")
          .attr("letter-spacing", "-0.266px")
          .text(`${indicatorDisplayNames[indicator]} Costs`);
        
        // Add colored boxes for each color in the scale
        colors.forEach((color, i) => {
          // For mobile, create a two-column grid
          const x = isMobile ? (i % 2) * (legendWidth / 2 - 10) : 10;
          const y = isMobile ? 10 + Math.floor(i / 2) * (spacing + 3) : 10 + i * (spacing + 3);
          
          legend.append("rect")
            .attr("x", x)
            .attr("y", y)
            .attr("width", boxSize)
            .attr("height", boxHeight)
            .attr("fill", color);
            
          // Add labels
          const min = colorScale.invertExtent(color)[0];
          const max = colorScale.invertExtent(color)[1];
          
          legend.append("text")
            .attr("x", x + boxSize + 5)
            .attr("y", y + boxHeight / 2 + 5)
            .attr("font-size", "14px")
            .attr("font-family", "Inter")
            .attr("font-weight", "400")
            .attr("fill", "#1E1E1E")
            .attr("line-height", "170%")
            .attr("letter-spacing", "-0.266px")
            .text(`$${Math.round(min).toLocaleString()} - $${Math.round(max).toLocaleString()} per person`);
        });
        

        
        // If a locality is selected, add an annotation
        if (selectedLocality) {
          console.log('Adding annotation for selected locality:', selectedLocality);
          
          // Find the corresponding feature in the geo data
          const feature = geoData.features.find((f: any) => {
            // Get FIPS code using various property names
            let fipsCode = f.properties.FIPS || f.properties.fips || f.properties.GEOID || 
                          f.properties.id || f.id;
            
            // Add prefix if needed
            if (fipsCode && typeof fipsCode === 'string' && fipsCode.length === 3) {
              fipsCode = `51${fipsCode}`;
            }
            
            // Get locality name
            const countyName = f.properties.NAME || f.properties.name;
            
            // Clean up locality FIPS code for comparison
            let locFips = selectedLocality.fips;
            
            if (locFips) {
              // Remove 'us-va-' prefix if present
              locFips = locFips.replace('us-va-', '');
              // Remove any remaining non-numeric characters
              locFips = locFips.toString().replace(/\D/g, '');
              // Ensure it's 5 digits
              locFips = locFips.padStart(3, '0');
              // Add state prefix if not present
              if (locFips.length === 3) {
                locFips = `51${locFips}`;
              }
            }
            
            const fipsMatch = fipsCode && locFips === fipsCode;
            const nameMatch = countyName && selectedLocality.counties === countyName;
            
            console.log(`Annotation matching: ${selectedLocality.counties} - FIPS: ${locFips} vs ${fipsCode} (${fipsMatch}), Name: ${selectedLocality.counties} vs ${countyName} (${nameMatch})`);
            
            return fipsMatch || nameMatch;
          });
          
          console.log('Found feature for annotation:', feature);
          
          if (feature) {
            // Calculate the centroid of the locality
            const centroid = path.centroid(feature);
            
            if (centroid && !isNaN(centroid[0]) && !isNaN(centroid[1])) {
              // Create the annotation - add it to the map group so it moves with the map
              const annotation = mapGroup.append("g")
                .attr("transform", `translate(${centroid[0]}, ${centroid[1]})`);
                
              // Tooltip content
              const perCapitaValue = getValueFromPath(
                selectedLocality, 
                getFieldPath(selectedLocality, indicator, 'PerCapita')
              );
              
              const totalValue = getValueFromPath(
                selectedLocality, 
                getFieldPath(selectedLocality, indicator, 'Total')
              );
              
              // Add tooltip background
              annotation.append("rect")
                .attr("x", -80)
                .attr("y", -80)
                .attr("width", 160)
                .attr("height", 70)
                .attr("fill", "white")
                .attr("rx", 4)
                .attr("ry", 4)
                .attr("stroke", "#E6E6E6")
                .attr("stroke-width", 1)
                .attr("filter", "url(#drop-shadow)");
                
              // Add locality name
              annotation.append("text")
                .attr("x", 0)
                .attr("y", -60)
                .attr("text-anchor", "middle")
                .attr("font-size", "12px")
                .attr("font-family", "Inter")
                .attr("font-weight", "700")
                .attr("fill", "#1E1E1E")
                .text(selectedLocality.counties);
                
              // Add per capita value
              annotation.append("text")
                .attr("x", 0)
                .attr("y", -40)
                .attr("text-anchor", "middle")
                .attr("font-size", "12px")
                .attr("font-family", "Inter")
                .attr("font-weight", "400")
                .attr("fill", "#1E1E1E")
                .text(`${formatNumber(perCapitaValue, '$', ' per person')}`);
                
              // Add total value
              annotation.append("text")
                .attr("x", 0)
                .attr("y", -20)
                .attr("text-anchor", "middle")
                .attr("font-size", "12px")
                .attr("font-family", "Inter")
                .attr("font-weight", "400")
                .attr("fill", "#1E1E1E")
                .text(`${formatNumber(totalValue, '$', ' total costs')}`);

              // Add triangular arrow pointing down
              annotation.append("polygon")
                .attr("points", "-12,-11 12,-11 0,1")
                .attr("fill", "white")
                .attr("stroke", "white") 
                .attr("stroke-width", 0.5)
            }
          }
        }
        
        setMapLoaded(true);
      } catch (error) {
        console.error("Error rendering map:", error);
      }
    };

    drawMap();
  }, [svgRef, localities, indicator, displayType, selectedLocality, colors, windowWidth, totalValue, indicatorDisplayNames, onLocalityClick, strokeColor]);

  return (
    <div className="relative">
      <svg 
        ref={svgRef} 
        className="w-full max-w-full" 
        aria-label={`Map showing ${indicatorDisplayNames[indicator]} costs in Virginia`}
        style={{ visibility: isInitialized ? 'visible' : 'hidden' }}
      />
      
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60">
          
        </div>
      )}
      
      {tooltipVisible && (
        <div 
          className="absolute p-2 bg-white border border-gray-300 shadow-md z-50 rounded-sm text-sm"
          style={{
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, -100%)',
            maxWidth: '200px',
            pointerEvents: 'none'
          }}
          dangerouslySetInnerHTML={{ __html: tooltipContent }}
        />
      )}
    </div>
  );
} 