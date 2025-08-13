import PayerBreakdown from '../components/blocks/PayerBreakdown';

export default function TestPayerBreakdownPage() {
  const testBlock = {
    title: "Virginia families and businesses would benefit the most from better outcomes",
    subtitle: "Opioid Epidemic Costs by Payer for Virginia In 2023",
    familiesBusinessesValue: 2680000000, // $2.68B
    familiesBusinessesColor: "#4A5D23", // Dark olive green
    familiesBusinessesTextColor: "#FFFFFF", // White text
    federalValue: 1650000000, // $1.65B
    federalColor: "#6B7C32", // Medium green
    federalTextColor: "#FFFFFF", // White text
    stateLocalValue: 695000000, // $695M
    stateLocalColor: "#8B9C42", // Light green
    stateLocalTextColor: "#FFFFFF", // White text
    marginTop: "medium" as const,
    marginBottom: "medium" as const,
  };

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">PayerBreakdown Component Test</h1>
        <PayerBreakdown block={testBlock} />
      </div>
    </div>
  );
}
