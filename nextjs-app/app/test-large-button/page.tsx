import LargeButton from '../components/blocks/LargeButton';

export default function TestLargeButtonPage() {
  const testBlock = {
    buttonText: "Download Report",
    buttonColor: "#4682B4",
    textColor: "#FFFFFF",
    action: "download" as const,
    url: "https://example.com/report.pdf",
    marginTop: "medium" as const,
    marginBottom: "medium" as const,
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">LargeButton Component Test</h1>
        <LargeButton block={testBlock} />
        
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-4">Test Variations</h2>
          
          <div className="space-y-8">
            {/* Custom action button */}
            <LargeButton 
              block={{
                ...testBlock,
                buttonText: "View Full Report",
                action: "custom" as const,
                customAction: "View Full Report",
                buttonColor: "#10B981",
                url: "https://example.com/full-report"
              }} 
            />
            
            {/* View action button */}
            <LargeButton 
              block={{
                ...testBlock,
                buttonText: "Open Dashboard",
                action: "view" as const,
                buttonColor: "#8B5CF6",
                url: "https://example.com/view-report"
              }} 
            />
            
            {/* Button without URL (should show warning) */}
            <LargeButton 
              block={{
                ...testBlock,
                buttonColor: "#EF4444",
                url: undefined
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
