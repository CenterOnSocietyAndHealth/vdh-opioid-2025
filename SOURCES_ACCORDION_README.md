# Sources Accordion Component

A new accordion-style component that displays sources information in a collapsible format, similar to the DataTableDescription component but focused specifically on sources content.

## Features

- **Accordion Interface**: Click to expand/collapse sources information
- **Left Indent Border**: Visual styling with a left border line as shown in the mockup
- **Rich Text Support**: Full PortableText support for sources content including headings, lists, links, and formatting
- **Flexible Usage**: Can be used both as a standalone Sanity block and within data visualization components
- **Consistent Styling**: Matches the text styles and behavior of the DataTableDescription component

## Usage

### As a Sanity Block

The component is available in the Sanity Studio page builder under "Sources Accordion". It includes:

- **Title**: The accordion header text (defaults to "Sources")
- **Sources Content**: Rich text field for sources information
- **Background Color**: Choose from white, light gray, or transparent
- **Margins**: Configurable top and bottom margins

### As a React Component

```tsx
import SourcesAccordion from '@/app/components/blocks/SourcesAccordion';

// Basic usage
<SourcesAccordion
  title="Sources"
  sources={portableTextContent}
  backgroundColor="bg-white"
/>

// With custom styling
<SourcesAccordion
  title="Data Sources"
  sources={[
    {
      _type: 'block',
      style: 'normal',
      children: [
        {
          _type: 'span',
          text: 'Computed by VCU\'s Center on Society and Health and non-profit organization Altarum.'
        }
      ]
    }
  ]}
  backgroundColor="bg-gray-50"
/>
```

### In Data Visualization Components

The component can be imported and used within other components that need to display sources information:

```tsx
import SourcesAccordion from '@/app/components/blocks/SourcesAccordion';

export default function MyDataVizComponent({ data }) {
  return (
    <div>
      {/* Your visualization content */}
      
      {/* Sources section */}
      <SourcesAccordion
        title="Sources"
        sources={data.sources}
      />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Sources"` | The title displayed in the accordion header |
| `sources` | `any[]` | `undefined` | PortableText content for the sources information |
| `backgroundColor` | `string` | `"bg-white"` | CSS class for background color |

## Styling

The component uses the same styling patterns as the DataTableDescription component:

- **Header**: Small text with chevron icon
- **Content**: Left-indented with border line
- **Typography**: Consistent with existing design system
- **Animations**: Smooth expand/collapse transitions

## Files Created

- `/nextjs-app/app/components/blocks/SourcesAccordion.tsx` - Main component
- `/nextjs-app/app/components/blocks/SourcesAccordionBlock.tsx` - Sanity block wrapper
- `/studio/src/schemaTypes/objects/sourcesAccordion.ts` - Sanity schema
- `/studio/static/page-builder-thumbnails/sourcesAccordion.svg` - Studio thumbnail

## Integration

The component is automatically registered in:
- Sanity Studio schema (`studio/src/schemaTypes/index.ts`)
- Page builder (`studio/src/schemaTypes/documents/page.ts`)
- Block renderer (`nextjs-app/app/components/BlockRenderer.tsx`)

## Example Content Structure

The sources content supports rich text formatting including:

- **Headings**: H1-H4 for section organization
- **Paragraphs**: Regular text content
- **Lists**: Bulleted and numbered lists
- **Links**: External and internal links
- **Formatting**: Bold, italic, and other text styles

Example sources content might include:
- Data source descriptions
- Methodology information
- Citation details
- Links to external resources
- Additional context and notes
