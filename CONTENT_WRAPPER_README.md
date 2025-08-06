# Content Wrapper Component

The Content Wrapper component is a new addition to the page builder that allows you to wrap multiple content blocks (like TextContent, LocalitySelector, etc.) with a configurable background color and width settings.

## Features

- **Background Color**: Choose from predefined colors or enter a custom hex color
- **Background Width**: Control how wide the background extends (full width, container width, or narrow)
- **Content Width**: Control the width of the content inside the wrapper (full width, container width, narrow, or custom pixel width)
- **Padding**: Adjust the internal padding (none, small, medium, large)
- **Margins**: Control top and bottom margins (none, small, medium, large)

## How to Use

1. In Sanity Studio, add a "Content Wrapper" block to your page builder
2. Configure the wrapper settings:
   - **Background Color**: Choose from Light Gray, White, Light Blue, Light Green, Light Yellow, or Custom
   - **Background Width**: 
     - Full Width: Extends to the edge of the browser
     - Container Width: Uses the standard container width
     - Narrow: Uses a narrower width
   - **Content Width**: 
     - Full Width: Content uses full available width
     - Container Width: Content uses standard container width
     - Narrow: Content uses narrower width
     - Custom: Set a specific pixel width
   - **Padding**: Choose the internal spacing
   - **Margins**: Set top and bottom spacing

3. Add content blocks inside the wrapper:
   - Text Content
   - Locality Selector
   - Costs Maps
   - Costs Breakdown
   - Accordion

## Use Cases

### Full Width Background with Narrow Content
- Set Background Width to "Full Width"
- Set Content Width to "Narrow" or "Custom"
- This creates a full-width colored background with centered, narrower content

### Aside-like Styling
- Set Background Width to "Container Width"
- Set Content Width to "Narrow"
- Add padding for spacing
- This creates an aside-like appearance

### Section Dividers
- Use different background colors to visually separate sections
- Combine with margins to create clear section breaks

## Migration from Aside TextContent

The old `isAside` functionality in TextContent has been removed. To recreate aside-like styling:

1. Use a Content Wrapper instead
2. Set the background color as desired
3. Add TextContent blocks inside the wrapper
4. Configure the width settings to achieve the desired layout

## Technical Details

- The component uses Tailwind CSS classes for styling
- Background colors are validated to ensure they are valid hex codes
- The component supports nested BlockRenderer functionality
- All string values are cleaned to prevent corruption from invisible Unicode characters
