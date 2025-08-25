import SectorSelector from '@/app/components/blocks/SectorSelector';
import TextContent from '@/app/components/blocks/TextContent';
import CostsMaps from '@/app/components/blocks/CostsMaps';
import { SectorProvider } from '@/app/contexts/SectorContext';

export default function TestSectorPage() {
  return (
    <SectorProvider>
      <div className="container mx-auto p-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Sector Selector Test Page</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">Sector Selector</h2>
            <SectorSelector 
              block={{
                marginTop: 'none',
                marginBottom: 'medium'
              }}
            />
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Text Content (with sector context)</h2>
            <TextContent 
              block={{
                content: [
                  {
                    _type: 'block',
                    children: [
                      {
                        _type: 'span',
                        text: 'This text content component will show the selected sector in the console. Try changing the sector above to see the context update.'
                      }
                    ]
                  }
                ],
                marginTop: 'none',
                marginBottom: 'medium'
              }}
              selectedLocality={null}
            />
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Costs Maps (with sector context)</h2>
            <CostsMaps 
              block={{
                type: 'PerCapita',
                defaultIndicator: 'Total',
                marginTop: 'none',
                marginBottom: 'medium'
              }}
              localities={[]}
              pageId="test-page"
            />
          </section>
        </div>
      </div>
    </SectorProvider>
  );
}
