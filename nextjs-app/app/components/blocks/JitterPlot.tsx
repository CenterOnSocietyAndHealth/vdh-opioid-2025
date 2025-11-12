'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import * as d3 from 'd3';
import { useLocality } from '@/app/contexts/LocalityContext';
import { useSector } from '@/app/contexts/SectorContext';
import { Locality } from '@/app/types/locality';
import { getValidKeyOrDefault } from '@/app/client-utils';
import DataTableDescription, { DataTableColumn, DataTableRow } from '@/app/components/blocks/DataTableDescription';
import SourcesAccordion from './SourcesAccordion';

// Types for the component
type JitterPlotProps = {
  block: {
    marginTop?: 'none' | 'small' | 'medium' | 'large';
    marginBottom?: 'none' | 'small' | 'medium' | 'large';
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
  };
  localities: Locality[];
  pageId: string;
};

// Mapping for the margin classes
const marginMap: Record<string, string> = {
  none: 'mt-0',
  small: 'mt-4',
  medium: 'mt-8',
  large: 'mt-16',
};

const marginBottomMap: Record<string, string> = {
  none: 'mb-0',
  small: 'mb-4',
  medium: 'mb-8',
  large: 'mb-16',
};

// Mapping between SectorSelector sectors and data field names
const sectorToFieldMapping: Record<string, string> = {
  'All Sectors': 'totalPerCapita',
  'Lost Labor': 'laborPerCapita',
  'Health Care': 'healthcarePerCapita',
  'Child Services & K-12': 'householdPerCapita',
  'Criminal Justice': 'crimeOtherPerCapita',
};

// Mapping between SectorSelector sectors and total cost field names
const sectorToTotalFieldMapping: Record<string, string> = {
  'All Sectors': 'totalTotal',
  'Lost Labor': 'laborTotal',
  'Health Care': 'healthcareTotal',
  'Child Services & K-12': 'householdTotal',
  'Criminal Justice': 'crimeOtherTotal',
};

// Display names for sectors
const sectorDisplayNames: Record<string, string> = {
  'All Sectors': 'All-Sector',
  'Lost Labor': 'Lost Labor',
  'Health Care': 'Health Care',
  'Child Services & K-12': 'Child Services & K-12',
  'Criminal Justice': 'Criminal Justice',
};

// Color scheme for the plot
const colors = {
  background: '#f8f9fa',
  grid: '#e9ecef',
  dots: 'rgba(29, 50, 101, 0.60)', // Semi-transparent blue
  selectedDot: '#dc2626', // Red for selected locality
  averageLine: '#000000', // Black for average line
    text: '#747474',
  subtitle: '#6b7280',
  gradientLeft: '#dfecc4', // Light blue for gradient start
  gradientRight: '#315674', // Darker blue for gradient end
};

export default function JitterPlot({ block, localities, pageId }: JitterPlotProps) {
  const { selectedLocality, setSelectedLocality } = useLocality();
  const { selectedSector } = useSector();
  const [mounted, setMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number | null>(null);
  // Default to true when a locality is selected (not Virginia)
  const [showNeighborsOnly, setShowNeighborsOnly] = useState(() => {
    // This will be evaluated on initial render, but selectedLocality might not be available yet
    // So we'll use useEffect to set it properly
    return false;
  });
  const svgRef = useRef<SVGSVGElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);

  // Set mounted state once component is mounted on client
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Default to "Neighbors only" when a locality is selected
  useEffect(() => {
    if (selectedLocality && selectedLocality.counties !== 'Virginia') {
      setShowNeighborsOnly(true);
    } else {
      setShowNeighborsOnly(false);
    }
  }, [selectedLocality]);

  // Get the margin values from block props
  const marginTop = block.marginTop || 'none';
  const marginBottom = block.marginBottom || 'none';
  const safeMarginTop = getValidKeyOrDefault(marginTop, marginMap, 'none')
  const safeMarginBottom = getValidKeyOrDefault(marginBottom, marginBottomMap, 'none')

  // Process data for the current sector
  const plotData = useMemo(() => {
    if (!localities || !mounted) return { values: [], average: 0, selectedValue: 0 };

    const fieldName = sectorToFieldMapping[selectedSector];
    if (!fieldName) return { values: [], average: 0, selectedValue: 0 };

    // Calculate Virginia average from ALL localities (not filtered)
    // Use a population-weighted average of per-capita values to reflect differing locality sizes
    const allVirginiaLocalities = localities.filter(loc => loc.counties !== 'Virginia');
    const weightedData = allVirginiaLocalities
      .map(loc => {
        const perCapitaRaw = loc.opioidMetrics?.[fieldName as keyof typeof loc.opioidMetrics] || 0;
        const perCapita = typeof perCapitaRaw === 'number' ? perCapitaRaw : 0;
        const populationRaw = loc.demographics?.totalPopulation || 0;
        const population = typeof populationRaw === 'number' ? populationRaw : 0;
        return { perCapita, population };
      })
      .filter(d => d.perCapita >= 0 && d.population > 0);

    const totalPopulation = weightedData.reduce((sum, d) => sum + d.population, 0);
    const virginiaAverage = totalPopulation > 0
      ? weightedData.reduce((sum, d) => sum + d.perCapita * d.population, 0) / totalPopulation
      : 0;


    // Filter localities based on neighbor filtering for display
    let filteredLocalities = localities.filter(loc => loc.counties !== 'Virginia');
    
    if (showNeighborsOnly && selectedLocality && selectedLocality.counties !== 'Virginia') {
      const selectedRegion = selectedLocality.regions?.cooperCtrRegion;
      if (selectedRegion) {
        filteredLocalities = filteredLocalities.filter(loc => 
          loc.regions?.cooperCtrRegion === selectedRegion
        );
      } else {
        // If no region is found for the selected locality, show no localities
        filteredLocalities = [];
      }
    }

    // Get values for filtered localities (for display)
    const values = filteredLocalities
      .map(loc => {
        const value = loc.opioidMetrics?.[fieldName as keyof typeof loc.opioidMetrics] || 0;
        const numericValue = typeof value === 'number' ? value : 0;
        return {
          value: numericValue,
          locality: loc,
          isSelected: selectedLocality?._id === loc._id,
        };
      })
      .filter(item => item.value >= 0); // Include localities with 0 values (zero cost is valid data)

    // Get selected locality value
    const selectedValue = selectedLocality && selectedLocality.counties !== 'Virginia'
      ? (() => {
          const value = selectedLocality.opioidMetrics?.[fieldName as keyof typeof selectedLocality.opioidMetrics] || 0;
          return typeof value === 'number' ? value : 0;
        })()
      : virginiaAverage;

    return { values, average: virginiaAverage, selectedValue };
  }, [localities, selectedSector, selectedLocality, mounted, showNeighborsOnly]);

  // Create deterministic jitter based on locality ID with better distribution
  function getDeterministicJitter(localityId: string): number {
    // Create a more robust hash function for better distribution
    let hash = 0;
    for (let i = 0; i < localityId.length; i++) {
      const char = localityId.charCodeAt(i);
      hash = ((hash << 5) - hash + char) & 0xffffffff;
    }
    
    // Use a larger modulus and multiple by a prime for better distribution
    const normalized = ((Math.abs(hash) * 2654435761) % 1000000) / 1000000; // 0 to 1
    return (normalized - 0.5); // -0.5 to 0.5 for uniform distribution
  }

  // Calculate statistics for titles
  const { title, subtitle, percentageDifference } = useMemo(() => {
    const sectorDisplayName = sectorDisplayNames[selectedSector] || 'Costs';
    const isVirginiaSelected = !selectedLocality || selectedLocality.counties === 'Virginia';
    
    if (isVirginiaSelected) {
      return {
        title: `${sectorDisplayName} costs in Virginia averaged $${Math.round(plotData.average).toLocaleString()} per person.`,
        subtitle: `${sectorDisplayName} Cost Per Person of the Opioid Epidemic for All Virginia Localities, 2023`,
        percentageDifference: null,
      };
    } else {
      const diff = ((plotData.selectedValue - plotData.average) / plotData.average) * 100;
      const moreOrLess = diff > 0 ? 'more' : 'less';
      const absDiff = Math.abs(Math.round(diff));
      const countyName = selectedLocality.counties.trim();
      
      return {
        title: `${sectorDisplayName} costs in ${countyName} were ${absDiff}% ${moreOrLess} than the average community.`,
        subtitle: `${sectorDisplayName} Cost Per Person of the Opioid Epidemic for ${countyName}, 2023`,
        percentageDifference: diff,
      };
    }
  }, [selectedSector, selectedLocality, plotData]);

  // Get the description for the current sector
  const getCurrentDescription = () => {
    switch (selectedSector) {
      case 'All Sectors':
        return block.totalDescription;
      case 'Lost Labor':
        return block.laborDescription;
      case 'Health Care':
        return block.healthcareDescription;
      case 'Child Services & K-12':
        return block.householdDescription;
      case 'Criminal Justice':
        return block.crimeOtherDescription;
      default:
        return null;
    }
  };

  // Get the sources for the current sector
  const getCurrentSources = () => {
    switch (selectedSector) {
      case 'All Sectors':
        return block.totalSources;
      case 'Lost Labor':
        return block.laborSources;
      case 'Health Care':
        return block.healthcareSources;
      case 'Child Services & K-12':
        return block.householdSources;
      case 'Criminal Justice':
        return block.crimeOtherSources;
      default:
        return null;
    }
  };

  // Prepare data for the DataTableDescription
  const prepareTableData = (): DataTableRow[] => {
    if (!localities || localities.length === 0) return [];

    const perCapitaFieldName = sectorToFieldMapping[selectedSector];
    const totalFieldName = sectorToTotalFieldMapping[selectedSector];
    
    if (!perCapitaFieldName || !totalFieldName) return [];

    return localities
      .filter(loc => loc.counties !== 'Virginia') // Exclude Virginia from the table
      .map(locality => {
        const perCapitaRaw = locality.opioidMetrics?.[perCapitaFieldName as keyof typeof locality.opioidMetrics];
        const totalRaw = locality.opioidMetrics?.[totalFieldName as keyof typeof locality.opioidMetrics];
        
        const perCapitaValue = typeof perCapitaRaw === 'number' ? perCapitaRaw : 0;
        const totalValue = typeof totalRaw === 'number' ? totalRaw : 0;

        return {
          id: locality._id,
          locality: locality.counties || 'Unknown',
          total: totalValue,
          perCapita: perCapitaValue,
        };
      });
  };

  // Define columns for the data table
  const tableColumns: DataTableColumn[] = [
    { key: 'locality', label: 'Locality', align: 'left', format: 'text' },
    { key: 'total', label: 'Total Cost', align: 'right', format: 'currency' },
    { key: 'perCapita', label: 'Per Capita Cost', align: 'right', format: 'currency' },
  ];

  // D3 chart rendering
  useEffect(() => {
    if (!mounted || !chartRef.current || !svgRef.current || plotData.values.length === 0) return;

    const container = chartRef.current;
    const svg = d3.select(svgRef.current);
    
    // Clear previous chart and tooltip
    svg.selectAll('*').remove();
    d3.selectAll('.jitter-plot-tooltip').remove();

    // Chart dimensions
    const containerWidth = container.clientWidth;
    const containerHeight = 362; // Fixed height for chart area
    const margin = { top: 20, right: 20, bottom: 60, left: 20 };
    const chartWidth = containerWidth - margin.left - margin.right;
    const chartHeight = containerHeight - margin.top - margin.bottom;

    // Set SVG dimensions
    svg
      .attr('width', containerWidth)
      .attr('height', containerHeight)
      .style('background', '#ffffff');

    // Create main chart group
    const chartGroup = svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // Calculate data range
    const maxValue = Math.max(...plotData.values.map(v => v.value), plotData.average);
    
    // Create scales
    const xScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([0, chartWidth]);

    const yScale = d3.scaleLinear()
      .domain([-1, 1])
      .range([chartHeight * 0.5, chartHeight * 0.1]);

    // Add gradient bar background
    const gradientDef = svg.append('defs')
      .append('linearGradient')
      .attr('id', 'costGradient')
      .attr('x1', '0%')
      .attr('x2', '100%')
      .attr('y1', '0%')
      .attr('y2', '0%');

    gradientDef.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', colors.gradientLeft);

    gradientDef.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', colors.gradientRight);

    // Add gradient bar with animation
    const gradientBar = chartGroup.selectAll('.gradient-bar')
      .data([maxValue])
      .join(
        enter => {
          const rect = enter.append('rect')
            .attr('class', 'gradient-bar')
            .attr('x', 0)
            .attr('y', chartHeight / 2)
            .attr('width', chartWidth)
            .attr('height', 12)
            .attr('stroke', 'rgb(49, 86, 116)')
            .attr('stroke-width', 1)
            .attr('fill', 'url(#costGradient)')
            .style('opacity', 0);
          
          rect.transition()
            .duration(500)
            .style('opacity', 1);
          
          return rect;
        },
        update => {
          update.transition()
            .duration(500)
            .attr('width', chartWidth);
          return update;
        },
        exit => {
          exit.transition()
            .duration(500)
            .style('opacity', 0)
            .remove();
          return exit;
        }
      );

    // Create jitter data with deterministic positioning
    const jitterData = plotData.values.map(item => ({
      ...item,
      jitter: getDeterministicJitter(item.locality._id)
    }));

    // Separate selected and non-selected dots
    const nonSelectedData = jitterData.filter(d => !d.isSelected);
    const selectedData = jitterData.filter(d => d.isSelected);

    // Layer for hover-selected guides
    const hoverLayer = chartGroup.append('g').attr('class', 'hover-layer');

    const renderHoverSelection = (d: any) => {
      hoverLayer.selectAll('*').remove();
      const selectedX = xScale(d.value);
      const selectedJitter = getDeterministicJitter(d.locality._id);
      const selectedY = yScale(selectedJitter);

      // Determine text alignment based on position
      const chartPosition = selectedX / chartWidth;
      const textAnchor: 'start' | 'middle' | 'end' = chartPosition < 0.2 ? 'start' : chartPosition > 0.8 ? 'end' : 'middle';
      const textX = textAnchor === 'start' ? Math.max(0, selectedX - 50) :
                   textAnchor === 'end' ? Math.min(chartWidth, selectedX + 50) :
                   selectedX;

      const g = hoverLayer.append('g').attr('class', 'hover-selected-line');
      g.append('line')
        .attr('x1', selectedX)
        .attr('x2', selectedX)
        .attr('y1', selectedY)
        .attr('y2', (chartHeight/2) + 65)
        .attr('stroke', colors.selectedDot)
        .attr('stroke-width', 1);

      g.append('text')
        .attr('x', textX)
        .attr('y', (chartHeight/2 + 85))
        .attr('text-anchor', textAnchor)
        .attr('font-size', '16px')
        .attr('fill', '#1E1E1E')
        .attr('font-weight', '500')
        .text(d.locality.counties.trim());

      g.append('text')
        .attr('x', textX)
        .attr('y', (chartHeight/2 + 105))
        .attr('text-anchor', textAnchor)
        .attr('font-size', '16px')
        .attr('fill', '#1E1E1E')
        .attr('font-weight', '500')
        .text(`${sectorDisplayNames[selectedSector]} Costs`);

      g.append('text')
        .attr('x', textX)
        .attr('y', (chartHeight/2 + 125))
        .attr('text-anchor', textAnchor)
        .attr('font-size', '16px')
        .attr('fill', '#1E1E1E')
        .attr('font-weight', '700')
        .text(`$${Math.round(d.value).toLocaleString()}/person`);

      const population = typeof d.locality.demographics?.totalPopulation === 'number' ? d.locality.demographics.totalPopulation : 0;
      g.append('text')
        .attr('x', textX)
        .attr('y', (chartHeight/2 + 145))
        .attr('text-anchor', textAnchor)
        .attr('font-size', '16px')
        .attr('fill', '#1E1E1E')
        .text(`($${Math.round(d.value * population).toLocaleString()} total cost)`);
    };

    // Add non-selected dots first (so they appear behind)
    const dots = chartGroup.selectAll('.dot')
      .data(nonSelectedData, (d: any) => d.locality._id)
      .join(
        enter => {
          const circles = enter.append('circle')
            .attr('class', 'dot')
            .attr('cx', d => xScale(d.value))
            .attr('cy', d => yScale(d.jitter))
            .attr('r', 0)
            .attr('fill', colors.dots)
            .attr('stroke', 'none')
            .attr('stroke-width', 0)
            .style('cursor', 'pointer');
          
          circles.transition()
            .duration(500)
            .attr('r', 8);
          
          return circles;
        },
        update => {
          update.transition()
            .duration(500)
            .attr('cx', d => xScale(d.value))
            .attr('cy', d => yScale(d.jitter))
            .attr('r', 8);
          return update;
        },
        exit => {
          exit.transition()
            .duration(500)
            .attr('r', 0)
            .remove();
          return exit;
        }
      )
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('stroke', '#FFD900')
          .attr('stroke-width', 2);
        // Hide selected locality label to prevent overlap
        chartGroup.selectAll('.selected-line').style('display', 'none');
        renderHoverSelection(d);
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .attr('stroke', 'none')
          .attr('stroke-width', 0);
        hoverLayer.selectAll('*').remove();
        // Restore selected locality label
        chartGroup.selectAll('.selected-line').style('display', null);
      });

    // Add selected dots last (so they appear in front)
    if (selectedData.length > 0) {
      const selectedDots = chartGroup.selectAll('.selected-dot')
        .data(selectedData, (d: any) => d.locality._id)
        .join(
          enter => {
            const circles = enter.append('circle')
              .attr('class', 'selected-dot')
              .attr('cx', d => xScale(d.value))
              .attr('cy', d => yScale(d.jitter))
              .attr('r', 0)
              .attr('fill', colors.selectedDot)
              .attr('stroke', 'none')
              .attr('stroke-width', 0)
              .style('cursor', 'pointer');
            
            circles.transition()
              .duration(500)
              .attr('r', 8);
            
            return circles;
          },
          update => {
            update.transition()
              .duration(500)
              .attr('cx', d => xScale(d.value))
              .attr('cy', d => yScale(d.jitter))
              .attr('r', 8);
            return update;
          },
          exit => {
            exit.transition()
              .duration(500)
              .attr('r', 0)
              .remove();
            return exit;
          }
        )
        .on('mouseover', function(event, d) {
          d3.select(this)
            .attr('stroke', '#FFD900')
            .attr('stroke-width', 2);
          // Hide selected locality label to prevent overlap
          chartGroup.selectAll('.selected-line').style('display', 'none');
          renderHoverSelection(d);
        })
        .on('mouseout', function(event, d) {
          d3.select(this)
            .attr('stroke', 'none')
            .attr('stroke-width', 0);
          hoverLayer.selectAll('*').remove();
          // Restore selected locality label
          chartGroup.selectAll('.selected-line').style('display', null);
        });
    }

    // Add average line
    const averageX = xScale(plotData.average);
    const averageLine = chartGroup.selectAll('.average-line')
      .data([plotData.average])
      .join(
        enter => {
          const g = enter.append('g').attr('class', 'average-line');
          g.append('line')
            .attr('x1', averageX)
            .attr('x2', averageX)
            .attr('y1', chartHeight * 0.1)
            .attr('y2', chartHeight * 0.5)
            .attr('stroke', colors.averageLine)
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '2,2')
            .style('opacity', 0)
            .transition()
            .duration(500)
            .style('opacity', 1);
          return g;
        },
        update => update.select('line')
          .transition()
          .duration(500)
          .attr('x1', averageX)
          .attr('x2', averageX),
        exit => exit
          .transition()
          .duration(500)
          .style('opacity', 0)
          .remove()
      );

    // Add average labels
    const averageLabels = averageLine.selectAll('.average-label')
      .data([plotData.average])
      .join(
        enter => {
          const g = enter.append('g').attr('class', 'average-label');
          g.append('text')
            .attr('x', averageX)
            .attr('y', 5)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('fill', colors.text)
            .attr('font-weight', '500')
            .text('Virginia Average/Person')
            .style('opacity', 0)
            .transition()
            .duration(500)
            .style('opacity', 1);
          
          g.append('text')
            .attr('x', averageX)
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .attr('fill', colors.text)
            .attr('font-weight', '700')
            .text(`$${Math.round(plotData.average).toLocaleString()}`)
            .style('opacity', 0)
            .transition()
            .duration(500)
            .style('opacity', 1);
          return g;
        },
        update => {
          update.selectAll('text')
            .transition()
            .duration(500)
            .attr('x', averageX);
          return update;
        },
        exit => exit
          .transition()
          .duration(500)
          .style('opacity', 0)
          .remove()
      );

    // Add selected locality line if applicable
    if (selectedLocality && selectedLocality.counties !== 'Virginia' && plotData.selectedValue >= 0) {
      const selectedX = xScale(plotData.selectedValue);
      const selectedJitter = getDeterministicJitter(selectedLocality._id);
      const selectedY = yScale(selectedJitter);
      const selectedLine = chartGroup.selectAll('.selected-line')
        .data([plotData.selectedValue])
        .join(
          enter => {
            const g = enter.append('g').attr('class', 'selected-line');
            return g;
          },
          update => update,
          exit => exit.remove()
        );

      // Determine text alignment based on position
      // Use start alignment for values in the first 20% of the chart
      // Use end alignment for values in the last 20% of the chart
      // Use middle alignment for values in the middle 60%
      const chartPosition = selectedX / chartWidth;
      const textAnchor = chartPosition < 0.2 ? 'start' : chartPosition > 0.8 ? 'end' : 'middle';
      
      // Adjust x position for start/end alignment to prevent overflow
      const textX = textAnchor === 'start' ? Math.max(0, selectedX - 50) : 
                   textAnchor === 'end' ? Math.min(chartWidth, selectedX + 50) : 
                   selectedX;

      selectedLine.append('line')
        .attr('x1', selectedX)
        .attr('x2', selectedX)
        .attr('y1', selectedY)
        .attr('y2', (chartHeight/2) + 65)
        .attr('stroke', colors.selectedDot)
        .attr('stroke-width', 1);

      selectedLine.append('text')
        .attr('x', textX)
        .attr('y', (chartHeight/2 + 85))
        .attr('text-anchor', textAnchor)
        .attr('font-size', '16px')
        .attr('fill', '#1E1E1E')
        .attr('font-weight', '500')
        .text(selectedLocality.counties.trim());

      selectedLine.append('text')
        .attr('x', textX)
        .attr('y', (chartHeight/2 + 105))
        .attr('text-anchor', textAnchor)
        .attr('font-size', '16px')
        .attr('fill', '#1E1E1E')
        .attr('font-weight', '500')
        .text(`${sectorDisplayNames[selectedSector]} Costs`);

      selectedLine.append('text')
        .attr('x', textX)
        .attr('y', (chartHeight/2 + 125))
        .attr('text-anchor', textAnchor)
        .attr('font-size', '16px')
        .attr('fill', '#1E1E1E')
        .attr('font-weight', '700')
        .text(`$${Math.round(plotData.selectedValue).toLocaleString()}/person`);

      selectedLine.append('text')
        .attr('x', textX)
        .attr('y', (chartHeight/2 + 145))
        .attr('text-anchor', textAnchor)
        .attr('font-size', '16px')
        .attr('fill', '#1E1E1E')
        .text(`($${Math.round(plotData.selectedValue * (selectedLocality.demographics?.totalPopulation || 0)).toLocaleString()} total cost)`);
    }

    // Add x-axis labels with animation
    const xAxisGroup = chartGroup.selectAll('.x-axis')
      .data([maxValue])
      .join(
        enter => {
          const g = enter.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0, ${(chartHeight/2 + 40)})`);
          
          g.append('text')
            .attr('x', 0)
            .attr('y', 0)
            .attr('font-size', '14px')
            .attr('fill', '#000000')
            .text('$0');

          g.append('text')
            .attr('x', 0)
            .attr('y', 15)
            .attr('text-anchor', 'start')
            .attr('font-size', '14px')
            .attr('fill', '#000000')
            .text('cost per person');

          g.append('text')
            .attr('x', chartWidth)
            .attr('y', 0)
            .attr('text-anchor', 'end')
            .attr('font-size', '14px')
            .attr('fill', '#000000')
            .text(`$${Math.round(maxValue).toLocaleString()}`)
            .style('opacity', 0)
            .transition()
            .duration(500)
            .style('opacity', 1);

          g.append('text')
            .attr('x', chartWidth)
            .attr('y', 15)
            .attr('text-anchor', 'end')
            .attr('font-size', '14px')
            .attr('fill', '#000000')
            .text('cost per person')
            .style('opacity', 0)
            .transition()
            .duration(500)
            .style('opacity', 1);
          
          return g;
        },
        update => {
          update.selectAll('text')
            .filter((d, i) => i >= 2) // Only animate the right-side labels
            .transition()
            .duration(500)
            .text((d, i) => i === 2 ? `$${Math.round(maxValue).toLocaleString()}` : 'cost per person');
          return update;
        },
        exit => exit
          .transition()
          .duration(500)
          .style('opacity', 0)
          .remove()
      );

    // Add legend
    const legendGroup = chartGroup.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${chartWidth - 125}, ${(chartHeight + 45)})`);

    legendGroup.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 8)
      .attr('fill', colors.dots);

    legendGroup.append('text')
      .attr('x', 15)
      .attr('y', 5)
      .attr('font-size', '14px')
      .attr('fill', '#1e1e1e')
      .text('Virginia Localities');

  }, [mounted, plotData, selectedLocality, windowWidth, selectedSector, showNeighborsOnly]);

  // Don't render until mounted on the client
  if (!mounted) {
    return (
      <div className={`${marginMap[safeMarginTop as keyof typeof marginMap]} ${marginBottomMap[safeMarginBottom as keyof typeof marginBottomMap]}`}>
        <div className="relative mx-auto p-4">
          <div className="w-full h-[400px] bg-gray-100 flex items-center justify-center">
            <p>Loading chart...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${marginMap[safeMarginTop as keyof typeof marginMap]} ${marginBottomMap[safeMarginBottom as keyof typeof marginBottomMap]}`}>
      <div className="relative mx-auto max-w-[800px] p-4">
        {/* Title */}
        <h3
          className="mb-2 mx-auto text-center text-xl lg:text-2xl font-normal leading-[130%] max-w-[600px]"
          style={{
            color: '#1E1E1E',
            fontFamily: 'DM Sans',
            letterSpacing: '-0.38px',
          }}
        >
          {(() => {
            const sectorName = sectorDisplayNames[selectedSector] || 'Costs';
            const isVirginiaSelected = !selectedLocality || selectedLocality.counties === 'Virginia';
            if (isVirginiaSelected) {
              return (
                <>
                  <span style={{ fontWeight: 700 }}>{sectorName}</span> costs in <span style={{ fontWeight: 700 }}>Virginia</span> averaged ${Math.round(plotData.average).toLocaleString()} per person.
                </>
              );
            }
            const moreOrLess = (percentageDifference || 0) > 0 ? 'more' : 'less';
            const localityName = selectedLocality?.counties?.trim() || '';
            const absDiff = Math.abs(Math.round(percentageDifference || 0));
            const sectorLower = sectorName === 'All-Sector' ? 'all-sector costs' : sectorName.toLowerCase();
            return (
              <>
                <span style={{ fontWeight: 700 }}>{localityName}</span> paid {absDiff}% {moreOrLess} per person for <span style={{ fontWeight: 700 }}>{sectorLower}</span> than the average Virginia community
              </>
            );
          })()}
        </h3>

        {/* Subtitle */}
        <h4
          className="mb-4 mx-auto text-center text-base font-normal lg:font-bold leading-[130%] max-w-none lg:letter-spacing-[-0.304px]"
          style={{
            color: '#1E1E1E',
            fontFamily: 'Inter',
          }}
        >
          {subtitle}
        </h4>

        {/* Chart Container */}
        <div 
          ref={chartRef}
          className="bg-white border border-gray-200 p-0 pt-6 relative"
          style={{ minHeight: '400px' }}
          role="region"
          aria-label={`Interactive jitter plot visualization showing ${sectorDisplayNames[selectedSector] || 'cost'} data for Virginia localities. Each dot represents a locality with its per capita cost. ${plotData.values.length} localities displayed. Average cost: $${Math.round(plotData.average).toLocaleString()} per person.${selectedLocality && selectedLocality.counties !== 'Virginia' ? ` Selected locality ${selectedLocality.counties.trim()} has $${Math.round(plotData.selectedValue).toLocaleString()} per person.` : ''}`}
          aria-describedby="jitter-plot-description"
        >
          <svg ref={svgRef}></svg>
          
          {/* Filter Options - positioned in lower left */}
          {selectedLocality && selectedLocality.counties !== 'Virginia' && (
          <div className="absolute bottom-4 left-4 flex flex-col sm:flex-row gap-0 md:gap-4 transition-opacity duration-300">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="all-localities"
                name="locality-filter"
                checked={!showNeighborsOnly}
                onChange={() => setShowNeighborsOnly(false)}
                className="w-4 h-4 text-[#747474] bg-gray-100 border-[#747474] focus:ring-blue-500 transition-colors duration-200"
                style={{
                  accentColor: '#747474'
                }}
              />
              <label htmlFor="all-localities" className="text-sm font-medium text-gray-700 cursor-pointer transition-colors duration-200">
                All Localities
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="neighbors-only"
                name="locality-filter"
                checked={showNeighborsOnly}
                onChange={() => setShowNeighborsOnly(true)}
                className="w-4 h-4 text-[#747474] bg-gray-100 border-[#747474] focus:ring-blue-500 transition-colors duration-200"
                style={{
                  accentColor: '#747474'
                }}
                disabled={!selectedLocality || selectedLocality.counties === 'Virginia'}
              />
              <label 
                htmlFor="neighbors-only" 
                className={`text-sm font-medium cursor-pointer transition-colors duration-200 ${
                  !selectedLocality || selectedLocality.counties === 'Virginia' 
                    ? 'text-gray-400' 
                    : 'text-gray-700'
                }`}
              >
                Neighbors Only
              </label>
            </div>
          </div>
          )}
          
          {/* Hidden description for screen readers */}
          <div id="jitter-plot-description" className="sr-only">
            Interactive jitter plot visualization. Each dot represents a Virginia locality positioned horizontally by per capita cost. Dots are jittered vertically for better visibility. Hovering a dot shows the locality label and a guide line at its value. The dashed line shows the Virginia average. {selectedLocality && selectedLocality.counties !== 'Virginia' ? `The red dot represents the selected locality ${selectedLocality.counties.trim()}.` : 'No specific locality is currently selected.'}
          </div>
        </div>

        {/* DataTableDescription for the current sector */}
        {getCurrentDescription() && (
          <div className="px-0 mt-4">
            <DataTableDescription
              title="Chart Description/Data Table"
              description={getCurrentDescription() || undefined}
              columns={tableColumns}
              data={prepareTableData()}
              backgroundColor="bg-transparent"
              highlightRowId={selectedLocality?._id}
            />
          </div>
        )}

        {/* SourcesAccordion for the current sector */}
        {getCurrentSources() && (
          <div className="px-0 mt-0">
            <SourcesAccordion
              title="Sources"
              sources={getCurrentSources() || undefined}
              backgroundColor="bg-transparent"
            />
          </div>
        )}
      </div>
    </div>
  );
}
