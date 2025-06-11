import { useEffect, useRef, useState } from 'react';
import { PortableText } from '@portabletext/react';
import * as d3 from 'd3';
import { CostsBreakdownProps } from '@/app/types/locality';

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

export default function CostsBreakdown({ block }: CostsBreakdownProps) {
  const { 
    totalCost, 
    totalCostSubtitle, 
    source, 
    costSectors,
  } = block;
  
  const chartRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [chartWidth, setChartWidth] = useState(0);
  
  useEffect(() => {
    if (!chartRef.current) return;
    
    // Function to handle resize
    const handleResize = () => {
      if (chartRef.current) {
        setChartWidth(chartRef.current.clientWidth);
      }
    };
    
    // Initial size
    handleResize();
    
    // Add resize listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  useEffect(() => {
    if (!chartRef.current || !costSectors.length || chartWidth === 0) return;
    
    // Clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();
    
    // Chart dimensions
    const containerWidth = chartWidth;
    const containerHeight = 250; // Fixed height for the chart area
    
    // Create container div with display:flex
    const container = d3.select(chartRef.current)
      .append('div')
      .style('display', 'flex')
      .style('flex-direction', 'column')
      .style('width', '100%');
      
    // Create top header with total cost line
    container.append('div')
      .style('display', 'flex')
      .style('justify-content', 'space-between')
      .style('padding', '0 10px')
      .style('border-bottom', '1px solid #ccc')
      .style('margin-bottom', '20px')
      .html(`
        <div class="text-4xl font-bold">${totalCost}</div>
        <div class="text-lg">${totalCostSubtitle || 'Annual Cost'}</div>
      `);
      
    // Create blocks container with horizontal scroll for small screens
    const blocksContainer = container.append('div')
      .style('display', 'flex')
      .style('gap', '5px')
      .style('width', '100%')
      .style('overflow-x', 'auto') // Allow horizontal scroll if needed
      .style('padding-bottom', '10px'); // Space for scrollbar
    
    // Calculate total for percentage calculation
    const totalValue = d3.sum(costSectors, d => d.value);
    
    // Create a block for each sector
    costSectors.forEach((sector, i) => {
      const percentOfTotal = sector.value / totalValue;
      
      // Use percentage-based width with a minimum to ensure readability
      // We'll use slightly less than the exact percentage to account for gaps
      const blockWidth = Math.max(Math.floor(percentOfTotal * 97), 
                                  containerWidth < 640 ? 150 : 100); // Minimum width in pixels
      
      const block = blocksContainer.append('div')
        .style('background-color', sector.color)
        .style('color', sector.textColor || '#fff')
        .style('border-radius', '0px')
        .style('padding', containerWidth < 640 ? '8px' : '8px')
        .style('flex', containerWidth < 768 ? 
               `0 0 ${blockWidth}px` : // Fixed min-width on mobile
               `0 0 ${Math.max(percentOfTotal * 98.5, 0)}%`) // Percentage-based on desktop
        .style('min-width', containerWidth < 768 ? `${blockWidth}px` : '0')
        .style('cursor', 'pointer')
        .style('position', 'relative')
        .on('mouseenter', () => setActiveIndex(i))
        .on('mouseleave', () => setActiveIndex(null));
      
      // Add value with scaled font size
      block.append('div')
        .attr('class', containerWidth < 640 ? 'text-[16px] font-bold mb-1' : 'text-[16px] font-bold mb-2')
        .style('white-space', 'nowrap')
        .style('overflow', 'hidden')
        .style('text-overflow', 'ellipsis')
        .text(`$${sector.value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`);
        
      // Add title and subtitle with possibly smaller text on mobile
      block.append('div')
        .style('white-space', 'normal')
        .style('word-wrap', 'break-word')
        .attr('class', containerWidth < 640 ? 'text-sm' : '')
        .html(`
          <div class="font-medium">${sector.title}</div>
          ${sector.subtitle ? `<div class="text-sm opacity-80">(${sector.subtitle})</div>` : ''}
        `);
    });
  }, [costSectors, chartWidth, totalCost, totalCostSubtitle]);
  
  const totalValue = d3.sum(costSectors, d => d.value);
  return (
    <div>
      <div ref={chartRef} className="w-full h-auto"></div>
      
      {/* Render aside/sidebar if present */}
      {block.aside && (
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <PortableText value={block.aside} />
        </div>
      )}
      
      {/* Render all sector descriptions below the chart */}
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {costSectors.map((sector, i) => {
          const percentOfTotal = sector.value / totalValue;
          // For mini-graph: build an array of widths/colors for all sectors
          let accumulated = 0;
          const miniBarSegments = costSectors.map((s, idx) => {
            const width = (s.value / totalValue) * 100;
            const color = idx === i ? sector.color : '#E3E2D8';
            const segment = (
              <div
                key={idx}
                style={{
                  width: `${width}%`,
                  backgroundColor: color,
                  height: '100%',
                  display: 'inline-block',
                  borderTopLeftRadius: idx === 0 ? 4 : 0,
                  borderBottomLeftRadius: idx === 0 ? 4 : 0,
                  borderTopRightRadius: idx === costSectors.length - 1 ? 4 : 0,
                  borderBottomRightRadius: idx === costSectors.length - 1 ? 4 : 0,
                }}
              />
            );
            accumulated += width;
            return segment;
          });
          return (
            <div key={i} className="mb-8">
              {/* Mini-graph bar */}
              <div className="mb-2 w-full h-2 flex rounded overflow-hidden" style={{minWidth: 80, maxWidth: 240}}>
                {miniBarSegments}
              </div>
              {/* Title */}
              <h3 className="text-lg font-bold mb-2">{sector.title} - ${sector.value.toLocaleString('en-US', { maximumFractionDigits: 0 })}</h3>
              {/* Description */}
              <div className="text-base">{sector.description && <PortableText value={sector.description} />}</div>
            </div>
          );
        })}
      </div>
      
      {source && (
        <div className="mt-4 text-sm text-gray-500">
          Sources: {source}
        </div>
      )}
    </div>
  );
} 