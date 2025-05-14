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
    marginTop = 'medium', 
    marginBottom = 'medium'
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
  
  return (
    <div className={`${marginMap[marginTop]} ${marginBottomMap[marginBottom]}`}>
      <div ref={chartRef} className="w-full h-auto"></div>
      
      {activeIndex !== null && costSectors[activeIndex].description && (
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-3">{costSectors[activeIndex].title}</h3>
          <PortableText value={costSectors[activeIndex].description} />
        </div>
      )}
      
      {source && (
        <div className="mt-4 text-sm text-gray-500">
          Sources: {source}
        </div>
      )}
    </div>
  );
} 