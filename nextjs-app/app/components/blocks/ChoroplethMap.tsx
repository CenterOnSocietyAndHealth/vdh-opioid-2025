'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
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
  onResetToVirginia?: () => void;
  leftAnnotation?: string;
  topAnnotation?: string;
  rightAnnotation?: string;
};

export default function ChoroplethMap({ 
  indicator, 
  displayType, 
  selectedLocality, 
  localities, 
  colors,
  strokeColor,
  totalValue,
  onLocalityClick,
  onResetToVirginia,
  leftAnnotation,
  topAnnotation,
  rightAnnotation
}: ChoroplethMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 800);
  const mapGroupRef = useRef<SVGGElement | null>(null);
  const countiesRef = useRef<d3.Selection<SVGGElement, unknown, null, undefined> | null>(null);
  const hoverTooltipRef = useRef<SVGGElement | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [transform, setTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hoveredLocality, setHoveredLocality] = useState<Locality | null>(null);

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
    'Total': 'All-Sector',
    'Labor': 'Lost Labor',
    'HealthCare': 'Health Care',
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

  // Helper function to check if a locality should be highlighted (selected or hovered)
  const isLocalityHighlighted = useCallback((locality: Locality | null | undefined): boolean => {
    if (!locality) return false;
    return Boolean((selectedLocality && selectedLocality._id === locality._id) || 
           (hoveredLocality && hoveredLocality._id === locality._id));
  }, [selectedLocality, hoveredLocality]);

  // Function to apply hover effects
  const applyHoverEffects = useCallback((currentHoveredLocality: Locality | null) => {
    if (!countiesRef.current) return;
    
    // Hide the selected locality's tooltip when hovering
    if (mapGroupRef.current) {
      d3.select(mapGroupRef.current).selectAll(".selected-locality-tooltip")
        .style("opacity", 0)
        .style("transition", "opacity 100ms ease-in-out");
    }
    
    countiesRef.current.selectAll("path")
      .style("opacity", (pathData: any) => {
        // Find the locality for this path
        let pathFipsCode = pathData.properties.FIPS || pathData.properties.fips || pathData.properties.GEOID || 
                         pathData.properties.id || pathData.id;
        
        if (pathFipsCode && typeof pathFipsCode === 'string' && pathFipsCode.length === 3) {
          pathFipsCode = `51${pathFipsCode}`;
        }
        
        const pathCountyName = pathData.properties.NAME || pathData.properties.name;
        
        const pathLocality = localities.find(loc => {
          let locFips = loc.fips;
          
          if (locFips) {
            locFips = locFips.replace('us-va-', '');
            locFips = locFips.toString().replace(/\D/g, '');
            locFips = locFips.padStart(3, '0');
            if (locFips.length === 3) {
              locFips = `51${locFips}`;
            }
          }
          
          const fipsMatch = pathFipsCode && locFips === pathFipsCode;
          const nameMatch = pathCountyName && loc.counties === pathCountyName;
          
          return fipsMatch || nameMatch;
        });
        
        // Return full opacity for hovered localities, 10% for selected locality, 10% for others
        const isSelected = selectedLocality && pathLocality && selectedLocality._id === pathLocality._id;
        const isHovered = currentHoveredLocality && pathLocality && currentHoveredLocality._id === pathLocality._id;
        
        if (isHovered) return 1;
        if (isSelected) return 0.10;
        return 0.10;
      })
      .style("transition", "opacity 100ms ease-in-out")
      .attr("stroke", (pathData: any) => {
        // Find the locality for this path
        let pathFipsCode = pathData.properties.FIPS || pathData.properties.fips || pathData.properties.GEOID || 
                         pathData.properties.id || pathData.id;
        
        if (pathFipsCode && typeof pathFipsCode === 'string' && pathFipsCode.length === 3) {
          pathFipsCode = `51${pathFipsCode}`;
        }
        
        const pathCountyName = pathData.properties.NAME || pathData.properties.name;
        
        const pathLocality = localities.find(loc => {
          let locFips = loc.fips;
          
          if (locFips) {
            locFips = locFips.replace('us-va-', '');
            locFips = locFips.toString().replace(/\D/g, '');
            locFips = locFips.padStart(3, '0');
            if (locFips.length === 3) {
              locFips = `51${locFips}`;
            }
          }
          
          const fipsMatch = pathFipsCode && locFips === pathFipsCode;
          const nameMatch = pathCountyName && loc.counties === pathCountyName;
          
          return fipsMatch || nameMatch;
        });
        
        // Set stroke color: yellow only for hovered localities, original strokeColor for others (including selected)
        const isSelected = selectedLocality && pathLocality && selectedLocality._id === pathLocality._id;
        const isHovered = currentHoveredLocality && pathLocality && currentHoveredLocality._id === pathLocality._id;
        
        return isHovered ? "#FFD900" : strokeColor;
      })
      .attr("stroke-width", (pathData: any) => {
        // Find the locality for this path
        let pathFipsCode = pathData.properties.FIPS || pathData.properties.fips || pathData.properties.GEOID || 
                         pathData.properties.id || pathData.id;
        
        if (pathFipsCode && typeof pathFipsCode === 'string' && pathFipsCode.length === 3) {
          pathFipsCode = `51${pathFipsCode}`;
        }
        
        const pathCountyName = pathData.properties.NAME || pathData.properties.name;
        
        const pathLocality = localities.find(loc => {
          let locFips = loc.fips;
          
          if (locFips) {
            locFips = locFips.replace('us-va-', '');
            locFips = locFips.toString().replace(/\D/g, '');
            locFips = locFips.padStart(3, '0');
            if (locFips.length === 3) {
              locFips = `51${locFips}`;
            }
          }
          
          const fipsMatch = pathFipsCode && locFips === pathFipsCode;
          const nameMatch = pathCountyName && loc.counties === pathCountyName;
          
          return fipsMatch || nameMatch;
        });
        
        // Set stroke width: 2 for hovered localities, 0.5 for others (including selected)
        const isSelected = selectedLocality && pathLocality && selectedLocality._id === pathLocality._id;
        const isHovered = currentHoveredLocality && pathLocality && currentHoveredLocality._id === pathLocality._id;
        
        return isHovered ? 2 : 0.5;
      });
  }, [selectedLocality, localities, strokeColor]);

  // Function to reset hover effects
  const resetHoverEffects = useCallback(() => {
    if (!countiesRef.current) return;
    
    // Show the selected locality's tooltip again when not hovering
    if (mapGroupRef.current) {
      d3.select(mapGroupRef.current).selectAll(".selected-locality-tooltip")
        .style("opacity", 1)
        .style("transition", "opacity 100ms ease-in-out");
    }
    
    countiesRef.current.selectAll("path")
      .style("opacity", (pathData: any) => {
        // Find the locality for this path
        let pathFipsCode = pathData.properties.FIPS || pathData.properties.fips || pathData.properties.GEOID || 
                         pathData.properties.id || pathData.id;
        
        if (pathFipsCode && typeof pathFipsCode === 'string' && pathFipsCode.length === 3) {
          pathFipsCode = `51${pathFipsCode}`;
        }
        
        const pathCountyName = pathData.properties.NAME || pathData.properties.name;
        
        const pathLocality = localities.find(loc => {
          let locFips = loc.fips;
          
          if (locFips) {
            locFips = locFips.replace('us-va-', '');
            locFips = locFips.toString().replace(/\D/g, '');
            locFips = locFips.padStart(3, '0');
            if (locFips.length === 3) {
              locFips = `51${locFips}`;
            }
          }
          
          const fipsMatch = pathFipsCode && locFips === pathFipsCode;
          const nameMatch = pathCountyName && loc.counties === pathCountyName;
          
          return fipsMatch || nameMatch;
        });
        
        // Restore original opacity: full for selected locality, 1 for others
        const isSelected = selectedLocality && pathLocality && selectedLocality._id === pathLocality._id;
        
        return isSelected ? 1 : 1;
      })
      .style("transition", "opacity 100ms ease-in-out")
      .attr("stroke", (pathData: any) => {
        // Find the locality for this path
        let pathFipsCode = pathData.properties.FIPS || pathData.properties.fips || pathData.properties.GEOID || 
                         pathData.properties.id || pathData.id;
        
        if (pathFipsCode && typeof pathFipsCode === 'string' && pathFipsCode.length === 3) {
          pathFipsCode = `51${pathFipsCode}`;
        }
        
        const pathCountyName = pathData.properties.NAME || pathData.properties.name;
        
        const pathLocality = localities.find(loc => {
          let locFips = loc.fips;
          
          if (locFips) {
            locFips = locFips.replace('us-va-', '');
            locFips = locFips.toString().replace(/\D/g, '');
            locFips = locFips.padStart(3, '0');
            if (locFips.length === 3) {
              locFips = `51${locFips}`;
            }
          }
          
          const fipsMatch = pathFipsCode && locFips === pathFipsCode;
          const nameMatch = pathCountyName && loc.counties === pathCountyName;
          
          return fipsMatch || nameMatch;
        });
        
        // Restore original stroke color: yellow for selected locality, strokeColor for others
        const isSelected = selectedLocality && pathLocality && selectedLocality._id === pathLocality._id;
        
        return isSelected ? "#FFD900" : strokeColor;
      })
      .attr("stroke-width", (pathData: any) => {
        // Find the locality for this path
        let pathFipsCode = pathData.properties.FIPS || pathData.properties.fips || pathData.properties.GEOID || 
                         pathData.properties.id || pathData.id;
        
        if (pathFipsCode && typeof pathFipsCode === 'string' && pathFipsCode.length === 3) {
          pathFipsCode = `51${pathFipsCode}`;
        }
        
        const pathCountyName = pathData.properties.NAME || pathData.properties.name;
        
        const pathLocality = localities.find(loc => {
          let locFips = loc.fips;
          
          if (locFips) {
            locFips = locFips.replace('us-va-', '');
            locFips = locFips.toString().replace(/\D/g, '');
            locFips = locFips.padStart(3, '0');
            if (locFips.length === 3) {
              locFips = `51${locFips}`;
            }
          }
          
          const fipsMatch = pathFipsCode && locFips === pathFipsCode;
          const nameMatch = pathCountyName && loc.counties === pathCountyName;
          
          return fipsMatch || nameMatch;
        });
        
        // Restore original stroke width: 2 for selected locality, 0.5 for others
        const isSelected = selectedLocality && pathLocality && selectedLocality._id === pathLocality._id;
        
        return isSelected ? 2 : 0.5;
      });
  }, [selectedLocality, localities, strokeColor]);

  // Function to create hover tooltip
  const createHoverTooltip = useCallback((locality: Locality, geoData: any, path: any) => {
    if (!mapGroupRef.current) return;
    
    // Don't show tooltip if this is the selected locality
    if (selectedLocality && selectedLocality._id === locality._id) {
      return;
    }
    
    // Remove existing hover tooltip
    if (hoverTooltipRef.current) {
      d3.select(hoverTooltipRef.current).remove();
      hoverTooltipRef.current = null;
    }
    
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
      let locFips = locality.fips;
      
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
      const nameMatch = countyName && locality.counties === countyName;
      
      return fipsMatch || nameMatch;
    });
    
    if (feature) {
      // Calculate the centroid of the locality
      const centroid = path.centroid(feature);
      
      if (centroid && !isNaN(centroid[0]) && !isNaN(centroid[1])) {
        // Create the hover tooltip - add it to the map group so it moves with the map
        const tooltip = d3.select(mapGroupRef.current).append("g")
          .attr("class", "hover-tooltip")
          .attr("transform", `translate(${centroid[0]}, ${centroid[1]})`)
          .style("pointer-events", "none");
        
        // Store reference for removal
        hoverTooltipRef.current = tooltip.node();
        
        // Tooltip content
        const perCapitaValue = getValueFromPath(
          locality, 
          getFieldPath(locality, indicator, 'PerCapita')
        );
        
        const totalValue = getValueFromPath(
          locality, 
          getFieldPath(locality, indicator, 'Total')
        );
        
        // Add tooltip background
        tooltip.append("rect")
          .attr("x", -80)
          .attr("y", -80)
          .attr("width", 160)
          .attr("height", 70)
          .attr("fill", "white")
          .attr("rx", 4)
          .attr("ry", 4)
          .attr("stroke", "#E6E6E6")
          .attr("stroke-width", 1)
          .attr("filter", "url(#drop-shadow)")
          .style("pointer-events", "none");
          
        // Add locality name
        tooltip.append("text")
          .attr("x", 0)
          .attr("y", -60)
          .attr("text-anchor", "middle")
          .attr("font-size", "12px")
          .attr("font-family", "Inter")
          .attr("font-weight", "700")
          .attr("fill", "#1E1E1E")
          .style("pointer-events", "none")
          .text(locality.counties);
          
        // Add per capita value
        tooltip.append("text")
          .attr("x", 0)
          .attr("y", -40)
          .attr("text-anchor", "middle")
          .attr("font-size", "12px")
          .attr("font-family", "Inter")
          .attr("font-weight", "400")
          .attr("fill", "#1E1E1E")
          .style("pointer-events", "none")
          .text(`${formatNumber(perCapitaValue, '$', ' per person')}`);
          
        // Add total value
        tooltip.append("text")
          .attr("x", 0)
          .attr("y", -20)
          .attr("text-anchor", "middle")
          .attr("font-size", "12px")
          .attr("font-family", "Inter")
          .attr("font-weight", "400")
          .attr("fill", "#1E1E1E")
          .style("pointer-events", "none")
          .text(`${formatNumber(totalValue, '$', ' total costs')}`);

        // Add triangular arrow pointing down
        tooltip.append("polygon")
          .attr("points", "-12,-11 12,-11 0,1")
          .attr("fill", "white")
          .attr("stroke", "white") 
          .attr("stroke-width", 0.5)
          .style("pointer-events", "none");
      }
    }
  }, [indicator, selectedLocality]);

  // Function to remove hover tooltip
  const removeHoverTooltip = useCallback(() => {
    if (hoverTooltipRef.current) {
      d3.select(hoverTooltipRef.current).remove();
      hoverTooltipRef.current = null;
    }
  }, []);

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

  // Drawing the map
  useEffect(() => {
    // Skip if SVG ref isn't available or localities aren't loaded
    if (!svgRef.current || localities.length === 0) return;

    // Function to wrap text within a specified width
    const wrapText = (text: any, width: number) => {
      text.each(function(this: SVGTextElement) {
        const textElement = d3.select(this);
        const originalText = textElement.text();
        if (!originalText) return;
        
        const words = originalText.split(/\s+/).reverse();
        let word;
        let line: string[] = [];
        let lineNumber = 0;
        const lineHeight = 1.5; // 150% line height
        const y = textElement.attr("y");
        const dy = parseFloat(textElement.attr("dy")) || 0;
        
        // Clear the text and start with first tspan
        textElement.text(null);
        let tspan = textElement.append("tspan")
          .attr("x", textElement.attr("x"))
          .attr("y", y)
          .attr("dy", dy + "em");

        while (word = words.pop()) {
          line.push(word);
          tspan.text(line.join(" "));
          const bbox = (tspan.node() as SVGTSpanElement).getBBox();
          if (bbox.width > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = textElement.append("tspan")
              .attr("x", textElement.attr("x"))
              .attr("y", y)
              .attr("dy", ++lineNumber * lineHeight + dy + "em")
              .text(word);
          }
        }
      });
    };

    const drawMap = async () => {
      try {
        // Set initialized state to true after first render
        setIsInitialized(true);

        // Load Virginia counties GeoJSON
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
        

        
        // Check if it's TopoJSON (has type: "Topology")
        let geoData;
        if (topoData.type === "Topology") {
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
        const width = isMobile ? windowWidth - 40 : 1080;
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
        
        // Clear any pending hover timeout
        if (hoverTimeoutRef.current) {
          clearTimeout(hoverTimeoutRef.current);
          hoverTimeoutRef.current = null;
        }
        
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
          .scale(isMobile ? 12000 : 9000) // Increased mobile zoom for better locality visibility
          .rotate([78, 0, 0])
          .center([-1.45, 38.1]);
        
        // Adjust projection for mobile
        if (isMobile) {
          if (selectedLocality) {
            // Find the selected locality feature to get its centroid
            const selectedFeature = geoData.features.find((f: any) => {
              let fipsCode = f.properties.FIPS || f.properties.fips || f.properties.GEOID || 
                            f.properties.id || f.id;
              if (fipsCode && typeof fipsCode === 'string' && fipsCode.length === 3) {
                fipsCode = `51${fipsCode}`;
              }
              
              const countyName = f.properties.NAME || f.properties.name;
              
              let locFips = selectedLocality.fips;
              if (locFips) {
                locFips = locFips.replace('us-va-', '');
                locFips = locFips.toString().replace(/\D/g, '');
                locFips = locFips.padStart(3, '0');
                if (locFips.length === 3) {
                  locFips = `51${locFips}`;
                }
              }
              
              const fipsMatch = fipsCode && locFips === fipsCode;
              const nameMatch = countyName && selectedLocality.counties === countyName;
              
              return fipsMatch || nameMatch;
            });
            
            if (selectedFeature) {
              // Calculate the bounds of the selected locality using a clean projection
              const tempProjection = d3.geoAlbers()
                .scale(isMobile ? 12000 : 9000)
                .rotate([78, 0, 0])
                .center([-1.6, 38.1])
                .translate([0, 0]); // No initial translation
              
              const tempPath = d3.geoPath().projection(tempProjection);
              const bounds = tempPath.bounds(selectedFeature);
              
              // Calculate the center of the selected locality
              const centerX = (bounds[0][0] + bounds[1][0]) / 2;
              const centerY = (bounds[0][1] + bounds[1][1]) / 2;
              
              // Set the translation to center the locality in the viewport
              projection.translate([width / 2 - centerX, height / 2 - centerY]);
            } else {
              // If no selected locality found, center on Richmond City
              const richmondFeature = geoData.features.find((f: any) => {
                let fipsCode = f.properties.FIPS || f.properties.fips || f.properties.GEOID || 
                              f.properties.id || f.id;
                if (fipsCode && typeof fipsCode === 'string' && fipsCode.length === 3) {
                  fipsCode = `51${fipsCode}`;
                }
                
                const countyName = f.properties.NAME || f.properties.name;
                
                // Look for Richmond City by FIPS code 51760 or name
                const fipsMatch = fipsCode === '51760';
                const nameMatch = countyName === 'Richmond City';
                
                return fipsMatch || nameMatch;
              });
              
              if (richmondFeature) {
                // Calculate the bounds of Richmond City using a clean projection
                const tempProjection = d3.geoAlbers()
                  .scale(isMobile ? 12000 : 9000)
                  .rotate([78, 0, 0])
                  .center([-1.6, 38.1])
                  .translate([0, 0]); // No initial translation
                
                const tempPath = d3.geoPath().projection(tempProjection);
                const bounds = tempPath.bounds(richmondFeature);
                
                // Calculate the center of Richmond City
                const centerX = (bounds[0][0] + bounds[1][0]) / 2;
                const centerY = (bounds[0][1] + bounds[1][1]) / 2;
                
                // Set the translation to center Richmond City in the viewport
                projection.translate([width / 2 - centerX, height / 2 - centerY]);
              } else {
                // Fallback to default center if Richmond City not found
                projection.translate([width / 2, height / 2]);
              }
            }
          } else {
            // No locality selected on mobile - center on Richmond City
            const richmondFeature = geoData.features.find((f: any) => {
              let fipsCode = f.properties.FIPS || f.properties.fips || f.properties.GEOID || 
                            f.properties.id || f.id;
              if (fipsCode && typeof fipsCode === 'string' && fipsCode.length === 3) {
                fipsCode = `51${fipsCode}`;
              }
              
              const countyName = f.properties.NAME || f.properties.name;
              
              // Look for Richmond City by FIPS code 51760 or name
              const fipsMatch = fipsCode === '51760';
              const nameMatch = countyName === 'Richmond City';
              
              return fipsMatch || nameMatch;
            });
            
            if (richmondFeature) {
              // Calculate the bounds of Richmond City using a clean projection
              const tempProjection = d3.geoAlbers()
                .scale(isMobile ? 12000 : 9000)
                .rotate([78, 0, 0])
                .center([-1.6, 38.1])
                .translate([0, 0]); // No initial translation
              
              const tempPath = d3.geoPath().projection(tempProjection);
              const bounds = tempPath.bounds(richmondFeature);
              
              // Calculate the center of Richmond City
              const centerX = (bounds[0][0] + bounds[1][0]) / 2;
              const centerY = (bounds[0][1] + bounds[1][1]) / 2;
              
              // Set the translation to center Richmond City in the viewport
              projection.translate([width / 2 - centerX, height / 2 - centerY]);
            } else {
              // Fallback to default center if Richmond City not found
              projection.translate([width / 2, height / 2]);
            }
          }
        } else {
          // For desktop, use default center
          projection.translate([width / 2, height / 2]);
        }
        
        // Create path generator
        const path = d3.geoPath()
          .projection(projection);
        
        // Create a group for the map elements that will be transformed
        const mapGroup = svg.append("g")
          .attr("class", "map-group");
        
        // Store reference to the map group for use in zoom/pan functions
        mapGroupRef.current = mapGroup.node();
        
        // Add background click handler to reset to Virginia when clicking outside counties
        svg.on("click", (event) => {
          // Check if the click was on a county path
          const target = event.target as SVGElement;
          const isCountyClick = target.closest('.counties path');
          
          // If not clicking on a county and reset function is provided, reset to Virginia
          if (!isCountyClick && onResetToVirginia) {
            console.log('Background clicked - resetting to Virginia');
            onResetToVirginia();
          }
        });
        
        
        // Draw counties in the map group
        const counties = mapGroup.append("g")
          .attr("class", "counties");
        
        // Store counties selection in ref for hover effects
        countiesRef.current = counties;
        
        const countiesPaths = counties.selectAll("path")
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
            
            // Include localities with 0 values in the color scale
            return value !== undefined && value !== null ? colorScale(value) : "#ccc";
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
            // Stop event propagation to prevent background click handler from firing
            event.stopPropagation();
            
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
            
            console.log('Matched locality:', locality);
            
            if (locality && onLocalityClick) {
              console.log('Calling onLocalityClick with:', locality);
              onLocalityClick(locality);
            } else {
              console.log('No locality found or no onLocalityClick handler');
            }
          })
          .on("mouseenter", (event: any, d: any) => {
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
              // Clear any pending hover timeout
              if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
                hoverTimeoutRef.current = null;
              }
              
              setHoveredLocality(locality);
              applyHoverEffects(locality);
              createHoverTooltip(locality, geoData, path);
            }
          })
          .on("mouseleave", (event: any, d: any) => {
            // Clear any existing timeout
            if (hoverTimeoutRef.current) {
              clearTimeout(hoverTimeoutRef.current);
            }
            
            // Set a small delay before resetting hover effects to prevent flashing
            hoverTimeoutRef.current = setTimeout(() => {
              setHoveredLocality(null);
              resetHoverEffects();
              removeHoverTooltip();
              hoverTimeoutRef.current = null;
            }, 50); // 50ms delay
          })
          
        // Add panning functionality on mobile (zoom disabled)
        if (isMobile) {
          const zoom = d3.zoom<SVGSVGElement, unknown>()
            .scaleExtent([1, 1]) // Disable zooming (fixed at 1x)
            .translateExtent([[-width * 1.5, -height * 0.5], [width * 2.5, height * 1.5]]) // Limit panning with more horizontal range
            .on('zoom', (event) => {
              mapGroup.attr('transform', event.transform);
            });
          
          // Apply zoom to the SVG
          svg.call(zoom as any);
        }
        
        // Create legend and UI elements outside of the map group so they don't get transformed
        // These are fixed elements that shouldn't move with the map
        
        // Create legend
        const legendWidth = isMobile ? width : 165;
        const legendHeight = isMobile ? 40 : 85;
        const boxSize = 18; // Fixed width
        const boxHeight = 20; // Fixed height
        const spacing = isMobile ? 25 : 20;
        
        const legend = svg.append("g")
          .attr("transform", `translate(${isMobile ? -10 : 40}, ${isMobile ? height - legendHeight - 0 : height - legendHeight - 360})`);
        
        legend.append("rect")
          .attr("width", isMobile ? legendWidth + 25 : legendWidth)
          .attr("x", isMobile ? -5 : 0)
          .attr("y", isMobile ? -35 : 0)
          .attr("height", isMobile ? legendHeight + 35 : legendHeight + 10)
          .attr("fill", isMobile ? "#FAF9F8" : "none")
          .attr("stroke", "#ddd")
          .attr("stroke-width", 0);
        
        // Add descriptive legend label similar to mockup
        const legendTitle = isMobile
          ? (selectedLocality 
              ? `${indicatorDisplayNames[indicator]} Costs per person for ${selectedLocality.counties}`
              : `${indicatorDisplayNames[indicator]} Costs per person`)
          : `${indicatorDisplayNames[indicator]} Costs`;
        
        legend.append("text")
          .attr("x", 10)
          .attr("y", -10)
          .attr("text-anchor", "start")
          .attr("font-family", "Inter")
          .attr("font-weight", "700")
          .attr("font-size", "14px")
          .attr("fill", "#1E1E1E")
          .attr("line-height", "170%")
          .attr("letter-spacing", "-0.266px")
          .text(legendTitle);
        
        // Add colored boxes for each color in the scale
        colors.forEach((color, i) => {
          // For mobile, display all scales in a single row with tighter spacing
          const mobileBoxSpacing = (legendWidth * 0.95) / colors.length + 12; // Reduced spacing for mobile + 8px extra
          const x = isMobile ? 10 + i * mobileBoxSpacing : 10;
          const y = isMobile ? 10 : 10 + i * (spacing + 3);
          
          legend.append("rect")
            .attr("x", x)
            .attr("y", y)
            .attr("width", boxSize)
            .attr("height", boxHeight)
            .attr("fill", color);
            
          // Add labels
          const min = colorScale.invertExtent(color)[0];
          const max = colorScale.invertExtent(color)[1];
          
          // On mobile, replace the highest value with "+" symbol
          let labelText;
          if (isMobile && i === colors.length - 1) {
            // This is the highest value block on mobile - show "+" symbol
            labelText = `$${Math.round(min).toLocaleString()}+`;
          } else {
            labelText = `$${Math.round(min).toLocaleString()} - $${Math.round(max).toLocaleString()}${isMobile ? '' : ' per person'}`;
          }
          
          legend.append("text")
            .attr("x", isMobile ? x + boxSize + 2 : x + boxSize + 5) // Closer labels on mobile
            .attr("y", y + boxHeight / 2 + 5)
            .attr("font-size", isMobile ? "12px" : "14px")
            .attr("font-family", "Inter")
            .attr("font-weight", "400")
            .attr("fill", "#1E1E1E")
            .attr("line-height", "170%")
            .attr("letter-spacing", "-0.266px")
            .text(labelText);
        });
        
        // Add desktop-only annotations if provided and not on mobile
        if (!isMobile && (leftAnnotation || topAnnotation || rightAnnotation)) {
          // Create annotations group inside the map group so they move with the map
          // and appear behind tooltips
          const annotationsGroup = mapGroup.append("g")
            .attr("class", "map-annotations")
            .style("pointer-events", "none");
          
          // Left annotation
          if (leftAnnotation) {
            const leftText = annotationsGroup.append("text")
              .attr("x", 50)
              .attr("y", height / 2)
              .attr("text-anchor", "start")
              .attr("font-family", "Inter")
              .attr("font-size", "14px")
              .attr("font-weight", "400")
              .attr("fill", "#1E1E1E")
              .attr("line-height", "150%")
              .attr("letter-spacing", "-0.266px")
              .text(leftAnnotation);
            wrapText(leftText, 200);
          }
          
          // Top annotation
          if (topAnnotation) {
            const topText = annotationsGroup.append("text")
              .attr("x", width / 2 - 200)
              .attr("y", 80)
              .attr("text-anchor", "start")
              .attr("font-family", "Inter")
              .attr("font-size", "14px")
              .attr("font-weight", "400")
              .attr("fill", "#1E1E1E")
              .attr("line-height", "150%")
              .attr("letter-spacing", "-0.266px")
              .text(topAnnotation);
            wrapText(topText, 200);
          }
          
          // Right annotation
          if (rightAnnotation) {
            const rightText = annotationsGroup.append("text")
              .attr("x", width - 200)
              .attr("y", height / 2 - 160)
              .attr("text-anchor", "start")
              .attr("font-family", "Inter")
              .attr("font-size", "14px")
              .attr("font-weight", "400")
              .attr("fill", "#1E1E1E")
              .attr("line-height", "150%")
              .attr("letter-spacing", "-0.266px")
              .text(rightAnnotation);
            wrapText(rightText, 200);
          }
        }

        
        // If a locality is selected, add an annotation
        if (selectedLocality) {
          
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
            
            
            return fipsMatch || nameMatch;
          });
          
          
          if (feature) {
            // Calculate the centroid of the locality
            const centroid = path.centroid(feature);
            
            if (centroid && !isNaN(centroid[0]) && !isNaN(centroid[1])) {
              // Create the annotation - add it to the map group so it moves with the map
              const annotation = mapGroup.append("g")
                .attr("class", "selected-locality-tooltip")
                .attr("transform", `translate(${centroid[0]}, ${centroid[1]})`)
                .style("pointer-events", "none");
                
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
                .attr("filter", "url(#drop-shadow)")
                .style("pointer-events", "none");
                
              // Add locality name
              annotation.append("text")
                .attr("x", 0)
                .attr("y", -60)
                .attr("text-anchor", "middle")
                .attr("font-size", "12px")
                .attr("font-family", "Inter")
                .attr("font-weight", "700")
                .attr("fill", "#1E1E1E")
                .style("pointer-events", "none")
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
                .style("pointer-events", "none")
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
                .style("pointer-events", "none")
                .text(`${formatNumber(totalValue, '$', ' total costs')}`);

              // Add triangular arrow pointing down
              annotation.append("polygon")
                .attr("points", "-12,-11 12,-11 0,1")
                .attr("fill", "white")
                .attr("stroke", "white") 
                .attr("stroke-width", 0.5)
                .style("pointer-events", "none")
            }
          }
        }
        
        setMapLoaded(true);
      } catch (error) {
        console.error("Error rendering map:", error);
      }
    };

    drawMap();
  }, [svgRef, localities, indicator, displayType, selectedLocality, colors, windowWidth, totalValue, indicatorDisplayNames, onLocalityClick, onResetToVirginia, strokeColor, applyHoverEffects, resetHoverEffects, createHoverTooltip, removeHoverTooltip, leftAnnotation, topAnnotation, rightAnnotation]);

  return (
    <div 
      className="relative"
      role="region"
      aria-label={`Interactive choropleth map visualization showing ${indicatorDisplayNames[indicator]} ${displayType === 'PerCapita' ? 'per capita' : 'total'} costs across Virginia localities. Each locality is colored based on its cost value. ${selectedLocality ? `Currently selected: ${selectedLocality.counties.trim()}` : 'No locality is currently selected.'} Click on any locality to select it, or click outside to reset to Virginia view.`}
      aria-describedby="choropleth-map-description"
    >
      <svg 
        ref={svgRef} 
        className="w-full max-w-full" 
        style={{ visibility: isInitialized ? 'visible' : 'hidden' }}
        aria-hidden="true"
      />
      
      {/* Hidden description for screen readers */}
      <div id="choropleth-map-description" className="sr-only">
        Interactive map of Virginia showing {indicatorDisplayNames[indicator]} {displayType === 'PerCapita' ? 'per capita' : 'total'} costs. Each locality is colored according to its cost value, with darker colors indicating higher costs. Hover over localities to see detailed information including locality name and cost values. {selectedLocality ? `The selected locality ${selectedLocality.counties.trim()} is highlighted with a gold border.` : 'No specific locality is currently selected.'} The map includes a color legend showing the cost ranges. On mobile devices, you can pan the map to explore different areas.
      </div>
      
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          
        </div>
      )}
      
    </div>
  );
} 