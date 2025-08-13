# OnThisPage Block

A new page builder block that creates a horizontal navigation bar for on-page jump links, similar to the "On this page" navigation commonly found in documentation sites.

## Features

- **Full-width navigation bar** with a light beige background (`#F5F5F0`)
- **Icon and label** with a downward arrow icon and "On this page:" text
- **Multiple jump links** that editors can configure
- **Smooth scrolling** to destination elements on the page
- **Responsive design** that works on all screen sizes
- **Configurable margins** (top and bottom) for spacing control

## How It Works

The OnThisPage block creates a navigation bar that allows users to quickly jump to different sections of the page. When a user clicks on a link, the page smoothly scrolls to the element with the matching ID.

## Setup

### 1. Studio Schema

The block is already added to your Sanity Studio schema and will appear in the page builder as "On This Page".

### 2. React Component

The `OnThisPage` component is already integrated into your `BlockRenderer` and will automatically render when the block is added to a page.

### 3. TypeScript Types

The `OnThisPageProps` type is already added to your types file.

## Usage

### In Sanity Studio

1. **Add an "On This Page" block** to your page using the page builder
2. **Configure the OnThisPage block**:
   - **Page Links**: Add as many links as you need
     - **Link Title**: The text that will be displayed (e.g., "Where We Live Matters")
     - **Destination ID**: The ID of the element to jump to (e.g., "section-1")
   - **Margin Top**: Spacing above the block (None, Small, Medium, Large)
   - **Margin Bottom**: Spacing below the block (None, Small, Medium, Large)

3. **Add Section IDs to TextContent blocks** (optional but recommended):
   - In any TextContent block, add a "Section ID" field
   - Use the same ID value that you specified in the OnThisPage destination
   - This creates anchor points that the navigation can jump to

### Example Configuration

```json
{
  "_type": "onThisPage",
  "links": [
    {
      "title": "Where We Live Matters",
      "destinationId": "section-1"
    },
    {
      "title": "Households Pay Over Half of the Cost",
      "destinationId": "section-2"
    },
    {
      "title": "Lifesaving Strategies Need More Support",
      "destinationId": "section-3"
    },
    {
      "title": "Economic Return on Investment",
      "destinationId": "section-4"
    }
  ],
  "marginTop": "medium",
  "marginBottom": "medium"
}
```

### In Your Content

To make the jump links work, you need to add corresponding IDs to the elements you want to jump to. For example:

```html
<section id="section-1">
  <h2>Where We Live Matters</h2>
  <!-- Content here -->
</section>

<section id="section-2">
  <h2>Households Pay Over Half of the Cost</h2>
  <!-- Content here -->
</section>
```

## Styling

The component uses Tailwind CSS classes and matches the design from your mockup:

- **Background**: Light beige (`#F5F5F0`)
- **Icon**: Dark gray circle with white downward arrow
- **Text**: Dark gray (`#374151`) with medium font weight
- **Links**: Underlined with hover effects
- **Spacing**: Consistent spacing between elements

## Customization

You can customize the appearance by modifying the `OnThisPage.tsx` component:

- Change colors by updating the Tailwind classes
- Modify spacing by adjusting the `space-x-` classes
- Update the icon by changing the SVG path
- Adjust the background color or add borders

## Testing

A test page has been created at `/test-onthispage` that demonstrates the functionality with sample content and working jump links.

## Technical Details

- **Component**: `nextjs-app/app/components/blocks/OnThisPage.tsx`
- **Schema**: `studio/src/schemaTypes/objects/onThisPage.ts`
- **Types**: Added to `nextjs-app/app/types/locality.ts`
- **Integration**: Added to `BlockRenderer.tsx` and page schema
- **Thumbnail**: `studio/static/page-builder-thumbnails/onThisPage.svg`

## TextContent Section IDs

The TextContent block now includes an optional **Section ID** field that allows editors to create anchor points for on-page navigation:

### How It Works

1. **Add a Section ID** to any TextContent block in the studio
2. **Use the same ID** in your OnThisPage block's destination field
3. **Automatic linking** - the navigation will smoothly scroll to the TextContent block

### Benefits

- **No manual HTML editing** required
- **Consistent with your content workflow** - everything managed in Sanity Studio
- **Automatic validation** - IDs must follow proper naming conventions
- **Studio preview** shows the section ID for easy identification

### ID Naming Rules

- Use only letters, numbers, hyphens, and underscores
- Examples: `section-1`, `overview`, `cost_breakdown`, `data2023`
- Avoid spaces and special characters

## Browser Support

The smooth scrolling functionality uses the modern `scrollIntoView` API with `behavior: 'smooth'`. This is supported in all modern browsers. For older browsers, the scrolling will still work but may not be smooth.
