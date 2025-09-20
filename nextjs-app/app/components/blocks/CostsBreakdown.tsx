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

// Helper to format cost values as $3.41B, $891M, etc.
function formatCostAbbr(value: number, precision: number = 3): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toPrecision(precision)} Billion`;
  } else if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toPrecision(precision)} Million`;
  } else if (value >= 1_000) {
    return `$${(value / 1_000).toPrecision(precision)} Thousand`;
  }
  return `$${value}`;
}

// Helper to format cost values as $3.41B, $891M, etc. (short form)
function formatCostShort(value: number, precision: number = 3): string {
  if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toPrecision(precision)}B`;
  } else if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toPrecision(precision)}M`;
  } else if (value >= 1_000) {
    return `$${(value / 1_000).toPrecision(precision)}K`;
  }
  return `$${value}`;
}

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
  const [hoveredTooltipIndex, setHoveredTooltipIndex] = useState<number | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{left: number, top: number} | null>(null);
  
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
      .style('flex-direction', 'column')
      .style('align-items', 'center')
      .style('padding', '0')
      .style('margin-bottom', '20px')
      .html(`
        <div class="text-[24px] font-normal mb-4">${totalCostSubtitle || 'Annual Cost'}</div>
        <div style="display: flex; align-items: center; width: 100%;">
          <span style="flex: 1; height: 20px; border-top: 1px solid #000; border-left: 1px solid #000; margin-right: 36px; margin-top: 20px;"></span>
          <span class="text-[24px]" style="white-space: nowrap; font-weight: 700;">
            ${(() => {
              const num = typeof totalCost === 'string' ? Number(totalCost.replace(/[^\d.]/g, '')) : totalCost;
              return !isNaN(num) && num > 0 ? formatCostAbbr(num, 2) : totalCost;
            })()}
          </span>
          <span style="flex: 1; height: 20px; border-top: 1px solid #000; border-right: 1px solid #000; margin-left: 36px; margin-top: 20px;"></span>
        </div>
      `);
      
    // Create blocks container with horizontal scroll for small screens
    const blocksContainer = container.append('div')
      .style('display', 'flex')
      .style('width', '100%')
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
        .style('padding', containerWidth < 640 ? '20px 10px' : '20px 10px')
        .style('flex', containerWidth < 768
          ? `0 0 ${blockWidth}px`
          : (i === costSectors.length - 1
              ? '1 1 0%'
              : `0 0 ${(percentOfTotal * 100).toFixed(4)}%`)
        )
        .style('min-width', containerWidth < 768 ? `${blockWidth}px` : '0')
        .style('cursor', 'pointer')
        .style('position', 'relative')
        .style('margin-right', i !== costSectors.length - 1 ? '5px' : '0')
        .on('mouseenter', function() {
          if (sector.showLabelAsTooltip) {
            const rect = (this as HTMLElement).getBoundingClientRect();
            const parentRect = chartRef.current?.getBoundingClientRect();
            setTooltipPosition({
              left: rect.left - (parentRect?.left || 0) + rect.width / 2,
              top: rect.top - (parentRect?.top || 0),
            });
            setHoveredTooltipIndex(i);
          }
          setActiveIndex(i)
        })
        .on('mouseleave', function() {
          if (sector.showLabelAsTooltip) {
            setHoveredTooltipIndex(null);
            setTooltipPosition(null);
          }
          setActiveIndex(null)
        });
      
      // Add value with scaled font size only if not showLabelAsTooltip
      if (!sector.showLabelAsTooltip) {
        block.append('div')
          .attr('class', 'font-bold mb-2')
          .style('font-size', '18px')
          .style('white-space', 'nowrap')
          .style('overflow', 'hidden')
          .style('text-overflow', 'ellipsis')
          .text(formatCostShort(sector.value));
      }
      
      // Add title and subtitle with possibly smaller text on mobile, or as tooltip only
      if (!sector.showLabelAsTooltip) {
        block.append('div')
          .style('white-space', 'normal')
          .style('word-wrap', 'break-word')
          .attr('class', containerWidth < 640 ? 'text-sm' : '')
          .html(`
            <div class="text-[18px]">${sector.title}</div>
            ${sector.subtitle ? `<div class="text-sm opacity-80">(${sector.subtitle})</div>` : ''}
          `);
      }
    });
  }, [costSectors, chartWidth, totalCost, totalCostSubtitle]);
  
  const totalValue = d3.sum(costSectors, d => d.value);
  return (
    <div className="max-w-[1311px] mx-auto">
      <div ref={chartRef} className="w-full h-auto" style={{position: 'relative'}}>
        {/* Custom Tooltip for blocks with showLabelAsTooltip */}
        {hoveredTooltipIndex !== null && tooltipPosition && costSectors[hoveredTooltipIndex] && costSectors[hoveredTooltipIndex].showLabelAsTooltip && (
          <div
            style={{
              position: 'absolute',
              left: tooltipPosition.left,
              top: tooltipPosition.top + 5, // adjust as needed
              transform: 'translate(-50%, -100%)',
              zIndex: 50,
              pointerEvents: 'none',
            }}
          >
            <div style={{
              background: '#fff',
              borderRadius: 0,
              boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              padding: '16px 16px',
              minWidth: 170,
              textAlign: 'left',
              fontSize: 16,
              fontWeight: 400,
            }}>
              <div style={{fontWeight: 700, fontSize: 18, marginBottom: 4}}>{formatCostAbbr(costSectors[hoveredTooltipIndex].value)}</div>
              <div style={{fontWeight: 500, fontSize: 18}}>{costSectors[hoveredTooltipIndex].title}</div>
              {costSectors[hoveredTooltipIndex].subtitle && (
                <div style={{fontSize: 14, color: '#444', marginTop: 2}}>{costSectors[hoveredTooltipIndex].subtitle}</div>
              )}
            </div>
            {/* Arrow */}
            <div style={{
              width: 0,
              height: 0,
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
              borderTop: '12px solid #fff',
              margin: '0 auto',
              marginTop: -2,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.10))',
            }} />
          </div>
        )}
      </div>
      
      {/* Render all sector descriptions and aside in a grid */}
      <div className="mt-6 grid gap-8 md:grid-cols-3 mb-12">
        {/* Breakdown descriptions in a nested 2-col grid */}
        <div className="md:col-span-2">
          <div className="grid gap-12 md:grid-cols-2 mr-4">
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
                      borderRadius: '0px',
                      marginLeft: idx !== 0 ? 4 : 0,
                    }}
                  />
                );
                accumulated += width;
                return segment;
              });
              return (
                <div key={i} className="mb-0">
                  {/* Title */}
                  <h3 className="text-lg font-bold mb-2 mt-0">{sector.title} - {formatCostShort(sector.value)}</h3>
                  {/* Mini-graph bar */}
                  <div className="mb-2 w-full h-2 flex overflow-hidden" style={{minWidth: 80}}>
                    {miniBarSegments}
                  </div>
                  {/* Description as plain text */}
                  <div className="font-[400] text-[16px] mt-3">{sector.description}</div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Aside (1/3 column on desktop, below on mobile) */}
        {block.aside && (
          <div className="bg-[#F3F2EC] p-6 pt-8 pr-8 h-full aside-container">
            <PortableText value={block.aside} />
          </div>
        )}
      </div>
      
      {source && (
        <div className="mt-4 text-sm text-gray-500">
          Sources: {source}
        </div>
      )}
    </div>
  );
} 