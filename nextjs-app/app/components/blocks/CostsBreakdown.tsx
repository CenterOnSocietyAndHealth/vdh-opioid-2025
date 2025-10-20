import { useEffect, useRef, useState } from 'react';
import { PortableText } from 'next-sanity';
import * as d3 from 'd3';
import { animate, stagger } from 'animejs';
import { CostsBreakdownProps } from '@/app/types/locality';
import { getValidKeyOrDefault } from '@/app/client-utils';
import DataTableDescription, { DataTableColumn } from './DataTableDescription';
import SourcesAccordion from './SourcesAccordion';

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
    chartDescription,
    sources,
    costSectors,
    mobileAside,
    asideLink,
    marginTop = 'none',
    marginBottom = 'none'
  } = block;

  const safeMarginTop = getValidKeyOrDefault(marginTop, marginMap, 'none')
  const safeMarginBottom = getValidKeyOrDefault(marginBottom, marginBottomMap, 'none')
  
  const chartRef = useRef<HTMLDivElement>(null);
  const totalCostsRef = useRef<HTMLDivElement>(null);
  const leftSpanRef = useRef<HTMLSpanElement>(null);
  const rightSpanRef = useRef<HTMLSpanElement>(null);
  const h3Ref = useRef<HTMLHeadingElement>(null);
  const mobileTitleRef = useRef<HTMLDivElement>(null);
  const mobileBarsRef = useRef<HTMLDivElement>(null);

  // Virginia population constant
  const VIRGINIA_POPULATION = 8734685;

  // Calculate total value for percentage calculations
  const totalValue = d3.sum(costSectors, d => d.value);

  // Define columns for the data table
  const tableColumns: DataTableColumn[] = [
    { key: 'sector', label: 'Sector', align: 'left', format: 'text' },
    { key: 'total', label: 'Total', align: 'right', format: 'currency' },
    { key: 'perCapita', label: 'Per Capita', align: 'right', format: 'currency' },
    { key: 'percentageOfTotal', label: 'Percentage of Total', align: 'right', format: 'percentage' }
  ];

  // Transform costSectors data into table format
  const tableData = costSectors.map(sector => ({
    sector: sector.title,
    total: sector.value,
    perCapita: Math.round(sector.value / VIRGINIA_POPULATION),
    percentageOfTotal: Math.round((sector.value / totalValue) * 100)
  }));

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
    const headerDiv = container.append('div')
      .style('display', 'flex')
      .style('flex-direction', 'column')
      .style('align-items', 'center')
      .style('padding', '0')
      .style('margin-bottom', '20px')
      .attr('class', 'desktop-header')
      .html(`
        <div style="display: flex; align-items: center; width: 100%;">
          <span class="left-span" style="flex: 1; height: 20px; border-top: 1px solid #000; border-left: 1px solid #000; margin-right: 36px; margin-top: 20px; opacity: 0;"></span>
          <h3 class="desktop-h3 text-[24px]" style="white-space: nowrap; font-weight: 700; opacity: 0;">
            ${(() => {
              const num = typeof totalCost === 'string' ? Number(totalCost.replace(/[^\d.]/g, '')) : totalCost;
              return !isNaN(num) && num > 0 ? formatCostAbbr(num, 2) : totalCost;
            })()}
          </h3>
          <span class="right-span" style="flex: 1; height: 20px; border-top: 1px solid #000; border-right: 1px solid #000; margin-left: 36px; margin-top: 20px; opacity: 0;"></span>
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
        .style('padding', '0')
        .style('flex', '0 0 0px') // Start with 0 width for animation
        .style('min-width', '0px')
        .style('height', '90px') // Fixed height for desktop bars
        .style('cursor', 'pointer')
        .style('position', 'relative')
        .style('margin-right', i !== costSectors.length - 1 ? '5px' : '0')
        .style('opacity', '0') // Start hidden for animation
        .style('display', 'flex')
        .style('align-items', 'center')
        .style('justify-content', 'flex-start')
        .attr('class', 'cost-block') // Use consistent class for D3 selection
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
      
      // Add text content container for left-aligned two-line layout
      if (!sector.showLabelAsTooltip) {
        const textContainer = block.append('div')
          .style('padding', '10px')
          .style('display', 'flex')
          .style('flex-direction', 'column')
          .style('justify-content', 'center')
          .style('align-items', 'flex-start')
          .style('height', '100%')
          .style('min-width', '0')
          .style('flex', '1');

        // Add value on top line
        textContainer.append('div')
          .attr('class', 'font-[600]')
          .style('font-size', '18px')
          .style('white-space', 'nowrap')
          .style('overflow', 'hidden')
          .style('text-overflow', 'ellipsis')
          .style('width', '100%')
          .text('$0'); // Start with $0 for animation

        // Add title on bottom line
        textContainer.append('div')
          .style('font-size', '16px')
          .style('white-space', 'nowrap')
          .style('overflow', 'hidden')
          .style('text-overflow', 'ellipsis')
          .style('width', '100%')
          .style('margin-top', '2px')
          .text(sector.title);

        // Add subtitle if it exists
        if (sector.subtitle) {
          textContainer.append('div')
            .style('font-size', '14px')
            .style('opacity', '0.8')
            .style('white-space', 'nowrap')
            .style('overflow', 'hidden')
            .style('text-overflow', 'ellipsis')
            .style('width', '100%')
            .style('margin-top', '1px')
            .text(`(${sector.subtitle})`);
        }
      }
    });
  }, [costSectors, chartWidth, totalCost, totalCostSubtitle]);

  // Animation effect
  useEffect(() => {
    if (!costSectors.length) return;

    // Animate desktop bars/blocks sequentially
    const animateDesktopBars = () => {
      if (!chartRef.current || chartWidth === 0) return;
      
      // Use D3 to animate the bars sequentially
      const bars = d3.selectAll('.cost-block');
      
      // Set initial state for all bars
      bars
        .style('opacity', 0)
        .style('flex', '0 0 0px')
        .style('min-width', '0px');

      // Animate bars one by one
      const animateBar = (index: number) => {
        if (index >= costSectors.length) {
          // All bars are done, animate the total costs header
          animateDesktopTotalCosts();
          return;
        }

        const bar = d3.select(bars.nodes()[index]);
        const sector = costSectors[index];
        const totalDuration = 2400;
        // const duration = totalDuration * sector.value / totalValue;

        const duration = 800;
        console.log('duration', duration);
        // Animate the bar fade-in quickly
        bar
          .transition()
          .duration(0)
          .ease(d3.easeQuadOut)
          .style('opacity', 1)
          .on('end', () => {
            // After fade-in, start the width animation
            bar
              .transition()
              .duration(duration) // Slower width animation
              .ease(d3.easeQuadOut)
              .style('flex', () => {
                const percentOfTotal = sector.value / totalValue;
                const blockWidth = Math.max(Math.floor(percentOfTotal * 97), 
                                          chartWidth < 640 ? 150 : 100);
                return chartWidth < 768
                  ? `0 0 ${blockWidth}px`
                  : (index === costSectors.length - 1
                      ? '1 1 0%'
                      : `0 0 ${(percentOfTotal * 100).toFixed(4)}%`);
              })
              .style('min-width', () => {
                const percentOfTotal = sector.value / totalValue;
                const blockWidth = Math.max(Math.floor(percentOfTotal * 97), 
                                          chartWidth < 640 ? 150 : 100);
                return chartWidth < 768 ? `${blockWidth}px` : '0';
              })
              .on('end', () => {
                // After width animation finishes, start the next bar
                animateBar(index + 1);
              });
          });

        // Animate the value counting for this bar (slower to match width animation)
        if (!sector.showLabelAsTooltip) {
          const valueElement = bar.select('.font-\\[600\\]');
          if (!valueElement.empty()) {
            const targetValue = sector.value;
            
            valueElement
              .transition()
              .duration(duration) // Match the slower width animation
              .ease(d3.easeQuadOut)
              .tween('text', function() {
                const current = d3.select(this);
                return function(t) {
                  const currentValue = Math.floor(targetValue * t);
                  current.text(formatCostShort(currentValue));
                };
              });
          }
        }
      };

      // Start with the first bar
      animateBar(0);
    };

    // Animate desktop total costs header
    const animateDesktopTotalCosts = () => {
      // Only animate the cost line elements, not the h2
      animate(['.left-span', '.right-span', '.desktop-h3'], {
        opacity: [0, 1],
        duration: 400,
        easing: 'easeOutQuart'
      });
    };

    // Animate mobile elements
    const animateMobileElements = () => {
      // Animate mobile title first
      if (mobileTitleRef.current) {
        animate(mobileTitleRef.current, {
          opacity: [0, 1],
          translateY: ['-20px', '0px'],
          duration: 600,
          easing: 'easeOutQuart',
          complete: () => {
            // After title, animate mobile bars
            animateMobileBars();
          }
        });
      }
    };

    // Animate mobile bars sequentially
    const animateMobileBars = () => {
      const mobileSectors = d3.selectAll('.mobile-sector');
      
      // Set initial state for all sectors
      mobileSectors
        .style('opacity', 0)
        .style('transform', 'translateX(-30px)');

      // Animate sectors one by one
      const animateSector = (index: number) => {
        if (index >= costSectors.length) {
          // All sectors are done, animate the bar widths
          animateMobileBarWidths();
          return;
        }

        const sector = d3.select(mobileSectors.nodes()[index]);
        
        sector
          .transition()
          .duration(200) // Faster fade-in
          .ease(d3.easeQuadOut)
          .style('opacity', 1)
          .style('transform', 'translateX(0px)')
          .on('end', () => {
            // After this sector finishes, start the next one
            animateSector(index + 1);
          });
      };

      // Start with the first sector
      animateSector(0);
    };

    // Animate mobile bar widths sequentially
    const animateMobileBarWidths = () => {
      const mobileBars = d3.selectAll('.mobile-bar');
      const mobileValues = d3.selectAll('.mobile-value');
      
      // Set initial state for all bars
      mobileBars.style('width', '0%');
      mobileValues.text('$0');

      // Animate bars one by one
      const animateBar = (index: number) => {
        if (index >= costSectors.length) {
          return; // All bars are done
        }

        const bar = d3.select(mobileBars.nodes()[index]);
        const value = d3.select(mobileValues.nodes()[index]);
        const sector = costSectors[index];
        
        const percentOfTotal = (sector.value / totalValue) * 100;
        const maxPercent = (costSectors[0].value / totalValue) * 100;
        const targetWidth = `${(percentOfTotal / maxPercent) * 100}%`;

        // Animate bar width (slower)
        bar
          .transition()
          .duration(800) // Slower width animation
          .ease(d3.easeQuadOut)
          .style('width', targetWidth)
          .on('end', () => {
            // After this bar finishes, start the next one
            animateBar(index + 1);
          });

        // Animate value counting (match width animation timing)
        value
          .transition()
          .duration(800) // Match the slower width animation
          .ease(d3.easeQuadOut)
          .tween('text', function() {
            const current = d3.select(this);
            const targetValue = sector.value;
            return function(t) {
              const currentValue = Math.floor(targetValue * t);
              current.text(formatCostShort(currentValue));
            };
          });
      };

      // Start with the first bar
      animateBar(0);
    };

    // Start animations after a small delay to ensure DOM is ready
    setTimeout(() => {
      animateDesktopBars();
      animateMobileElements();
    }, 100);
  }, [costSectors, chartWidth, totalValue]);

  return (
    <div className={`max-w-[1311px] mx-auto ${marginMap[safeMarginTop as keyof typeof marginMap]} ${marginBottomMap[safeMarginBottom as keyof typeof marginBottomMap]}`}>
      {/* Desktop Title */}
      <div className="hidden md:block text-center mb-5">
        <h2 className="text-[24px] font-normal mb-2">{totalCostSubtitle || 'Annual Cost'}</h2>
      </div>
      
      {/* Desktop: Large D3 Chart */}
      <div ref={chartRef} className="w-full hidden md:block" style={{position: 'relative', minHeight: '160px'}}>
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

      {/* Mobile: Simplified layout with title and small bars */}
      <div className="md:hidden" style={{minHeight: '600px'}}>

        {/* Mobile Aside */}
        {mobileAside && (
          <div className="bg-[#F3F2EC] p-4 pb-0.5 mb-6 mobile-aside">
            <div
              style={{
                color: '#1E1E1E',
                fontSize: '14px',
                fontWeight: 400,
              }}
            >
              <PortableText value={mobileAside} />
            </div>
          </div>
        )}

        {/* Title Section */}
        <div ref={mobileTitleRef} className="text-center mb-6" style={{opacity: 0, transform: 'translateY(-20px)'}}>
          <h2 className="text-2xl font-normal mb-2 text-gray-800">
            {totalCostSubtitle || 'The Opioid Epidemic Cost Virginians'}
          </h2>
          <div className="flex items-center justify-center mb-4">
            <h3 className="text-2xl font-bold whitespace-nowrap">
              {(() => {
                const num = typeof totalCost === 'string' ? Number(totalCost.replace(/[^\d.]/g, '')) : totalCost;
                return !isNaN(num) && num > 0 ? formatCostShort(num, 2) + ' Spread Across Four Sectors' : totalCost;
              })()}
            </h3>
          </div>
        </div>

        {/* Mobile Sector List */}
        <div ref={mobileBarsRef} className="space-y-6">
          {costSectors.map((sector, i) => {
            const percentOfTotal = (sector.value / totalValue) * 100;
            // Calculate the maximum percentage (first item's percentage)
            const maxPercent = (costSectors[0].value / totalValue) * 100;
            // Scale all bars so the first one is 100%
            const scaledWidth = (percentOfTotal / maxPercent) * 100;
            
            return (
              <div key={i} className="bg-white py-0 px-4 mobile-sector" style={{opacity: 0, transform: 'translateX(-30px)'}}>
                {/* Sector Bar */}
                <div className="mb-2">
                  <div className="w-full h-[30px] overflow-hidden">
                    <div
                      className="h-full mobile-bar"
                      style={{
                        width: '0%', // Start at 0 width for animation
                        backgroundColor: sector.color
                      }}
                    />
                  </div>
                </div>
                
                {/* Sector Title and Cost */}
                <div className="mb-2">
                  <h4 className="text-[14px] font-normal text-[#1E1E1E]">
                    <span className="mr-2 font-bold">{sector.title}</span> <span className="mobile-value">$0</span>
                  </h4>
                </div>
                
                {/* Sector Description */}
                <p className="text-sm text-[#1E1E1E] leading-[130%] font-[400]">
                  {sector.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Data Table Description Component */}
      {chartDescription && (
        <div className="mt-0 mx-4 md:mx-0">
          <DataTableDescription
            title="Data Table/This Chart Described"
            description={chartDescription}
            columns={tableColumns}
            data={tableData}
          />
        </div>
      )}
      
      {/* Sources Accordion Component */}
      {sources && (
        <div className="mt-0 mx-4 md:mx-0">
          <SourcesAccordion
            title="Sources"
            sources={sources}
          />
        </div>
      )}
      
      {/* Desktop: Render all sector descriptions and aside in a grid */}
      <div className="hidden md:grid mt-6 gap-8 md:grid-cols-3 mb-12">
        {/* Breakdown descriptions in a nested 2-col grid */}
        <div className="md:col-span-2">
          <div className="grid gap-x-12 gap-y-6 md:grid-cols-2 mr-4">
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
                  <p 
                    className="mb-2 mt-0 text-left"
                    style={{
                      color: '#1E1E1E',
                      fontFamily: 'Inter',
                      fontSize: '16px',
                      fontStyle: 'normal',
                      fontWeight: 700,
                      lineHeight: '130%',
                      letterSpacing: '-0.16px'
                    }}
                  >
                    {sector.title} - {formatCostShort(sector.value)}
                  </p>
                  {/* Mini-graph bar */}
                  <div className="mb-2 w-full h-2 flex overflow-hidden" style={{minWidth: 80}}>
                    {miniBarSegments}
                  </div>
                  {/* Description as plain text */}
                  <div 
                    className="mt-3"
                    style={{
                      fontFamily: 'Inter',
                      fontWeight: 300,
                      color: '#1E1E1E',
                      fontSize: '16px',
                      lineHeight: '130%'
                    }}
                  >
                    {sector.description}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {/* Aside (1/3 column on desktop, below on mobile) */}
        {block.aside && (
          <div className="bg-[#F3F2EC] p-[30px] h-full aside-container flex flex-col">
            <div className="flex-1">
              <PortableText value={block.aside} />
            </div>
            {/* Aside Link */}
            {asideLink && (
              <div className="mt-6">
                <a
                  href={asideLink.internalPage ? `/${asideLink.internalPage.slug}` : asideLink.url}
                  className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity"
                  style={{
                    color: '#000',
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontStyle: 'normal',
                    fontWeight: 400,
                    lineHeight: 'normal',
                    textDecorationLine: 'underline',
                  }}
                >
                  {asideLink.title} ––&gt;
                </a>
              </div>
            )}
          </div>
        )}
      </div>
      
    </div>
  );
} 