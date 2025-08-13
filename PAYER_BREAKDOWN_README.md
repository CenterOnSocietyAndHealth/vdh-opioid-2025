# PayerBreakdown Component

A new page builder block component that displays a horizontal bar chart showing the breakdown of opioid epidemic costs by payer type in Virginia.

## Features

- **Horizontal Bar Chart**: Visual representation of three payer categories with automatic percentage calculations
- **Three Fixed Payer Types**:
  - Families & Businesses
  - Federal (Government)
  - State/Local (Government)
- **Government Grouping**: Federal and State/Local segments are visually grouped under a "Government" label with bracket lines
- **Automatic Calculations**: Percentages are calculated automatically based on the dollar values provided
- **Dollar Value Formatting**: Values are automatically abbreviated (e.g., $2.68B, $1.65B, $695M)
- **Customizable Colors**: Each payer segment can have its own background color and text color
- **Editable Content**: Title and subtitle can be customized by content editors
- **Responsive Design**: Adapts to different screen sizes
- **Interactive Elements**: Expandable sections for data description and sources

## Usage in Sanity Studio

Content editors can add this block to any page using the page builder. The block will appear as "Payer Breakdown" in the block selection menu.

### Editable Fields

1. **Title** (required): Main heading for the chart
   - Default: "Virginia families and businesses would benefit the most from better outcomes"

2. **Subtitle** (required): Secondary text below the title
   - Default: "Opioid Epidemic Costs by Payer for Virginia In 2023"

3. **Families & Businesses Value** (required): Dollar amount for families and businesses
   - Default: 2680000000 ($2.68B)
   - Enter the full number (e.g., 2680000000 for $2.68B)

4. **Families & Businesses Color** (required): Background color for the families segment
   - Default: #4A5D23 (dark olive green)

5. **Families & Businesses Text Color** (required): Text color for the families segment
   - Default: #FFFFFF (white)

6. **Federal Value** (required): Dollar amount for federal government
   - Default: 1650000000 ($1.65B)

7. **Federal Color** (required): Background color for the federal segment
   - Default: #6B7C32 (medium green)

8. **Federal Text Color** (required): Text color for the federal segment
   - Default: #FFFFFF (white)

9. **State/Local Value** (required): Dollar amount for state and local government
   - Default: 695000000 ($695M)

10. **State/Local Color** (required): Background color for the state/local segment
    - Default: #8B9C42 (light green)

11. **State/Local Text Color** (required): Text color for the state/local segment
    - Default: #FFFFFF (white)

9. **Margin Top/Bottom**: Spacing options (none, small, medium, large)
   - Default: medium

## Technical Implementation

### Component Files

- **React Component**: `nextjs-app/app/components/blocks/PayerBreakdown.tsx`
- **TypeScript Types**: `nextjs-app/app/types/locality.ts` (PayerBreakdownProps)
- **Sanity Schema**: `studio/src/schemaTypes/objects/payerBreakdown.ts`
- **Block Renderer**: Added to `nextjs-app/app/components/BlockRenderer.tsx`

### Key Features

- **Automatic Percentage Calculation**: Percentages are calculated based on the total of all three values
- **Responsive Layout**: Uses Tailwind CSS classes for responsive design
- **Accessibility**: Proper semantic HTML structure and ARIA labels
- **Performance**: Lightweight component with no external dependencies beyond React and Tailwind

### Styling

The component uses Tailwind CSS classes and follows the existing design system:
- Consistent spacing with margin utilities
- Color scheme that matches the mockup
- Typography that follows the established patterns
- Responsive breakpoints for mobile and desktop

## Example Output

The component renders a horizontal bar chart with:
- Title and subtitle at the top
- Main chart showing three colored segments (all same height)
- "Government" label with bracket lines spanning the federal and state/local segments
- Percentage and abbreviated dollar values displayed on each segment
- Color-coded legend below the chart
- Expandable sections for additional information

## Testing

A test page is available at `/test-payer-breakdown` that demonstrates the component with sample data matching the mockup.

## Integration

The component is fully integrated into the existing system:
- Added to the Sanity schema
- Available in the page builder
- Properly typed with TypeScript
- Follows the established component patterns
- Includes proper error handling and validation
