'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  totalValue: number;
};

export default function ChoroplethMap({ 
  indicator, 
  displayType, 
  selectedLocality, 
  localities, 
  colors,
  totalValue
}: ChoroplethMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);
  const mapGroupRef = useRef<SVGGElement | null>(null);
  const [transform, setTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);

  // Function to format numbers in a readable way
  function formatNumber(num: number, prefix = "", suffix = "") {
    if (num === undefined || num === null) return "N/A";
    const value = Number(num.toPrecision(3));
    if (value >= 1e9) return `${prefix}` + (value / 1e9).toFixed(1) + ' Billion' + `${suffix}`;
    if (value >= 1e6) return `${prefix}` + (value / 1e6).toFixed(1) + ' Million' + `${suffix}`;
    if (value >= 1e3) return `${prefix}` + (value / 1e3).toFixed(1) + 'K' + `${suffix}`;
    return `${prefix}` + Math.round(value) + `${suffix}`;
  }

  // Indicator display names
  const indicatorDisplayNames: Record<CostsMapIndicator, string> = {
    'Total': 'Total',
    'Labor': 'Lost Labor',
    'HealthCare': 'Health Care',
    'Crime_Other': 'Crime / Other',
    'Household': 'Household',
  };

  // Get field path for accessing data
  const getFieldPath = (locality: Locality, indicator: CostsMapIndicator, type: DisplayType) => {
    const basePath = 'opioidMetrics';
    let indicatorLower = indicator.toLowerCase();
    
    // Special case for Crime_Other to match the field names in the data
    if (indicatorLower === 'crime_other') {
      indicatorLower = 'crimeOther';
    }
    
    const typeSuffix = type === 'PerCapita' ? 'PerCapita' : 'Total';
    return `${basePath}.${indicatorLower}${typeSuffix}`;
  };

  // Get value from nested property path
  const getValueFromPath = (obj: any, path: string): number => {
    return path.split('.').reduce((o, key) => (o?.[key] !== undefined ? o[key] : 0), obj) || 0;
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

  // Drawing the map
  useEffect(() => {
    // Skip if SVG ref isn't available or localities aren't loaded
    if (!svgRef.current || localities.length === 0) return;

    const drawMap = async () => {
      try {
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
        const width = isMobile ? windowWidth - 40 : 800;
        const height = isMobile ? 500 : 400;
        
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
        
        // Create projection with initial position settings
        const projection = d3.geoAlbers()
          .scale(isMobile ? 4000 : 5700)
          .rotate([78, 0, 0])
          .center([-2.3, 37.7])
          .translate([width / 2, height / 2]);
        
        // Create path generator
        const path = d3.geoPath()
          .projection(projection);
        
        // Create a group for the map elements that will be transformed
        const mapGroup = svg.append("g")
          .attr("class", "map-group");
        
        // Store reference to the map group for use in zoom/pan functions
        mapGroupRef.current = mapGroup.node();
        
        // Create zoom behavior
        const zoom = d3.zoom<SVGSVGElement, unknown>()
          .scaleExtent([1, 8])
          .on("zoom", (event) => {
            if (mapGroupRef.current) {
              const newTransform = event.transform;
              setTransform(newTransform);
              mapGroup.attr("transform", newTransform.toString());
            }
          });
        
        // Apply zoom behavior to SVG
        svg.call(zoom as any)
          .call((zoom as any).transform, d3.zoomIdentity)
          .append("title")
          .text("Drag to pan, scroll to zoom");
        
        // Add cursor styles to indicate the map is interactive
        svg.style("cursor", "grab");
        
        // Draw counties in the map group
        const counties = mapGroup.append("g")
          .attr("class", "counties")
          .selectAll("path")
          .data(geoData.features)
          .enter()
          .append("path")
          .attr("d", path as any)
          .attr("fill", (d: any) => {
            // Find matching locality by FIPS code or name
            // GeoJSON files can have different property names for FIPS codes
            let fipsCode = d.properties.FIPS || d.properties.fips || d.properties.GEOID || 
                           d.properties.id || d.id;
            
            // Sometimes FIPS codes might need a prefix (e.g., "51" for Virginia)
            if (fipsCode && typeof fipsCode === 'string' && !fipsCode.startsWith('51') && fipsCode.length === 3) {
              fipsCode = `51${fipsCode}`;
            }
            
            // Try to find a matching locality by FIPS or name
            const locality = localities.find(loc => 
              (fipsCode && loc.fips === fipsCode) || 
              (d.properties.NAME && loc.counties === d.properties.NAME) ||
              (d.properties.name && loc.counties === d.properties.name)
            );
            
            if (!locality) {
              console.log(`No match found for: ${d.properties.NAME || d.properties.name}, FIPS: ${fipsCode}`);
              return "#ccc";
            }
            
            const value = getValueFromPath(
              locality, 
              getFieldPath(locality, indicator, displayType)
            );
            
            return value ? colorScale(value) : "#ccc";
          })
          .attr("stroke", "#000")
          .attr("stroke-width", 0.5)
          .attr("stroke-opacity", 1)
          .attr("stroke-width", (d: any) => {
            // Highlight selected locality
            if (!selectedLocality) return 0.5;
            
            // Check different property variations for FIPS code match
            let fipsCode = d.properties.FIPS || d.properties.fips || d.properties.GEOID || 
                           d.properties.id || d.id;
                           
            // Add prefix if needed
            if (fipsCode && typeof fipsCode === 'string' && !fipsCode.startsWith('51') && fipsCode.length === 3) {
              fipsCode = `51${fipsCode}`;
            }
            
            // Check for match by FIPS or name
            if ((fipsCode && selectedLocality.fips === fipsCode) || 
                (d.properties.NAME && selectedLocality.counties === d.properties.NAME) ||
                (d.properties.name && selectedLocality.counties === d.properties.name)) {
              return 2;
            }
            return 0.5;
          })
          .on("mouseover", (event: any, d: any) => {
            // Handle mouseover event
            // Get FIPS code using various property names
            let fipsCode = d.properties.FIPS || d.properties.fips || d.properties.GEOID || 
                          d.properties.id || d.id;
            
            // Add prefix if needed
            if (fipsCode && typeof fipsCode === 'string' && !fipsCode.startsWith('51') && fipsCode.length === 3) {
              fipsCode = `51${fipsCode}`;
            }
            
            // Get locality name
            const countyName = d.properties.NAME || d.properties.name;
            
            // Try to find matching locality
            const locality = localities.find(loc => 
              (fipsCode && loc.fips === fipsCode) || 
              (countyName && loc.counties === countyName)
            );
            
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
                <strong>${locality.counties}</strong><br/>
                $${Math.round(perCapitaValue).toLocaleString()} per capita<br/>
                $${Math.round(totalValue).toLocaleString()} total
              `);
              
              setTooltipPosition({ 
                x: event.pageX, 
                y: event.pageY - 80 
              });
              
              setTooltipVisible(true);
            }
          })
          .on("mouseout", () => {
            setTooltipVisible(false);
          });
          
        // Update cursor style on mousedown/mouseup to indicate grabbing action
        svg.on("mousedown", function() {
          d3.select(this).style("cursor", "grabbing");
        })
        .on("mouseup", function() {
          d3.select(this).style("cursor", "grab");
        });
        
        // Create legend and UI elements outside of the map group so they don't get transformed
        // These are fixed elements that shouldn't move with the map
        
        // Create legend
        const legendWidth = isMobile ? width : 165;
        const legendHeight = isMobile ? 40 : 85;
        const boxSize = isMobile ? 24 : 12;
        const spacing = isMobile ? 30 : 20;
        
        const legend = svg.append("g")
          .attr("transform", `translate(${isMobile ? 20 : 10}, ${isMobile ? height - legendHeight - 20 : 140})`);
        
        legend.append("rect")
          .attr("width", legendWidth)
          .attr("height", legendHeight + 10)
          .attr("fill", "white")
          .attr("stroke", "#ddd")
          .attr("stroke-width", 0);
        
        // Add colored boxes for each color in the scale
        colors.forEach((color, i) => {
          // For mobile, create a two-column grid
          const x = isMobile ? (i % 2) * (legendWidth / 2 - 10) : 10;
          const y = isMobile ? 10 + Math.floor(i / 2) * spacing : 10 + i * spacing;
          
          legend.append("rect")
            .attr("x", x)
            .attr("y", y)
            .attr("width", boxSize)
            .attr("height", boxSize)
            .attr("fill", color);
            
          // Add labels
          const min = colorScale.invertExtent(color)[0];
          const max = colorScale.invertExtent(color)[1];
          
          legend.append("text")
            .attr("x", x + boxSize + 5)
            .attr("y", y + boxSize / 2 + 5)
            .attr("font-size", isMobile ? "12px" : "10px")
            .attr("letter-spacing", "0.5px")
            .attr("font-weight", "700")
            .text(`$${Math.round(min).toLocaleString()} - $${Math.round(max).toLocaleString()} per person`);
        });
        
        // Add title
        const title = svg.append("g")
          .attr("transform", `translate(${isMobile ? 20 : 20}, ${isMobile ? 50 : 30})`);
        
        title.append("rect")
          .attr("width", isMobile ? width - 40 : 250)
          .attr("height", isMobile ? 130 : 110)
          .attr("fill", "white")
          .attr("stroke", "#ddd")
          .attr("stroke-width", 1);
        
        title.append("text")
          .attr("x", 10)
          .attr("y", 25)
          .attr("font-size", isMobile ? "18px" : "16px")
          .attr("font-weight", "bold")
          .text(`${indicatorDisplayNames[indicator]} Costs`);
          
        title.append("text")
          .attr("x", 10)
          .attr("y", 50)
          .attr("font-size", isMobile ? "18px" : "16px")
          .attr("font-weight", "bold")
          .text("in Virginia");
        
        title.append("text")
          .attr("x", 10)
          .attr("y", 80)
          .attr("font-size", isMobile ? "16px" : "14px")
          .text(formatNumber(totalValue, "$"));
          
        title.append("text")
          .attr("x", 10)
          .attr("y", 100)
          .attr("font-size", isMobile ? "12px" : "10px")
          .text("Economic Burden of Opioids in Virginia, 2021");
        
        // Add zoom controls
        const zoomControls = svg.append("g")
          .attr("transform", `translate(${width - 60}, ${height - 60})`);
          
        // Zoom in button
        const zoomInButton = zoomControls.append("g")
          .attr("class", "zoom-button zoom-in")
          .style("cursor", "pointer")
          .on("click", () => {
            svg.transition().duration(300).call(
              (zoom.scaleBy as any), 1.3
            );
          });
        
        zoomInButton.append("circle")
          .attr("r", 15)
          .attr("fill", "white")
          .attr("stroke", "#666")
          .attr("stroke-width", 1);
          
        zoomInButton.append("text")
          .attr("text-anchor", "middle")
          .attr("dy", "0.3em")
          .attr("font-size", "20px")
          .attr("font-weight", "bold")
          .text("+");
        
        // Zoom out button
        const zoomOutButton = zoomControls.append("g")
          .attr("class", "zoom-button zoom-out")
          .attr("transform", "translate(0, 35)")
          .style("cursor", "pointer")
          .on("click", () => {
            svg.transition().duration(300).call(
              (zoom.scaleBy as any), 0.7
            );
          });
          
        zoomOutButton.append("circle")
          .attr("r", 15)
          .attr("fill", "white")
          .attr("stroke", "#666")
          .attr("stroke-width", 1);
          
        zoomOutButton.append("text")
          .attr("text-anchor", "middle")
          .attr("dy", "0.3em")
          .attr("font-size", "20px")
          .attr("font-weight", "bold")
          .text("−");
        
        // Reset button
        const resetButton = zoomControls.append("g")
          .attr("class", "zoom-button reset")
          .attr("transform", "translate(0, 70)")
          .style("cursor", "pointer")
          .on("click", () => {
            svg.transition().duration(300).call(
              (zoom.transform as any), d3.zoomIdentity
            );
          });
          
        resetButton.append("circle")
          .attr("r", 15)
          .attr("fill", "white")
          .attr("stroke", "#666")
          .attr("stroke-width", 1);
          
        resetButton.append("text")
          .attr("text-anchor", "middle")
          .attr("font-size", "10px")
          .attr("dy", "0.3em")
          .attr("font-weight", "bold")
          .text("RESET");
        
        // If a locality is selected, add an annotation
        if (selectedLocality) {
          // Find the corresponding feature in the geo data
          const feature = geoData.features.find((f: any) => {
            // Get FIPS code using various property names
            let fipsCode = f.properties.FIPS || f.properties.fips || f.properties.GEOID || 
                          f.properties.id || f.id;
            
            // Add prefix if needed
            if (fipsCode && typeof fipsCode === 'string' && !fipsCode.startsWith('51') && fipsCode.length === 3) {
              fipsCode = `51${fipsCode}`;
            }
            
            // Get locality name
            const countyName = f.properties.NAME || f.properties.name;
            
            // Check for match by FIPS or name
            return (fipsCode && selectedLocality.fips === fipsCode) || 
                   (countyName && selectedLocality.counties === countyName);
          });
          
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
                .attr("x", -60)
                .attr("y", -80)
                .attr("width", 120)
                .attr("height", 60)
                .attr("fill", "white")
                .attr("stroke", "black")
                .attr("stroke-width", 0.5);
                
              // Add locality name
              annotation.append("text")
                .attr("x", 0)
                .attr("y", -60)
                .attr("text-anchor", "middle")
                .attr("font-size", "12px")
                .attr("font-weight", "bold")
                .text(selectedLocality.counties);
                
              // Add values
              annotation.append("text")
                .attr("x", 0)
                .attr("y", -45)
                .attr("text-anchor", "middle")
                .attr("font-size", "10px")
                .text(`$${Math.round(perCapitaValue).toLocaleString()} per capita`);
                
              annotation.append("text")
                .attr("x", 0)
                .attr("y", -30)
                .attr("text-anchor", "middle")
                .attr("font-size", "10px")
                .text(`$${Math.round(totalValue).toLocaleString()} total`);
            }
          }
        }
        
        // Add instruction text
        svg.append("text")
          .attr("x", width / 2)
          .attr("y", height - 10)
          .attr("text-anchor", "middle")
          .attr("font-size", "10px")
          .attr("fill", "#666")
          .text("Drag to pan, use scroll wheel or buttons to zoom");
        
        setMapLoaded(true);
      } catch (error) {
        console.error("Error rendering map:", error);
      }
    };

    drawMap();
  }, [svgRef, localities, indicator, displayType, selectedLocality, colors, windowWidth, totalValue]);

  return (
    <div className="relative">
      <svg ref={svgRef} className="w-full max-w-full" aria-label={`Map showing ${indicatorDisplayNames[indicator]} costs in Virginia`} />
      
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60">
          <p>Loading map...</p>
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