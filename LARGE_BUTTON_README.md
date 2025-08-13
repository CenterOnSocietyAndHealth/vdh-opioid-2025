# LargeButton Component

A prominent, customizable button component for the VDH Opioid Cost Calculator page builder. This component renders a large, rounded button with an icon and locality-specific text, perfect for call-to-action elements like downloading reports.

## 🎯 Features

- **Prominent Design**: Large, rounded button with customizable colors and styling
- **Download Icon**: Built-in download icon that matches the mockup design
- **Dynamic Text**: Configurable button text for different purposes
- **Multiple Actions**: Support for download, view, open, and custom actions
- **Customizable Styling**: Configurable button colors, text colors, and margins
- **Interactive States**: Hover effects, focus states, and disabled state handling
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Proper focus management and keyboard navigation

## 📝 Content Editor Fields

### Required Fields

1. **Button Text** (required): The main button text
   - Default: "Download Report for"
   - Description: The main button text (e.g., "Download Report for")



2. **Button Color** (required): Background color for the button
   - Default: #4682B4 (medium blue)
   - Description: Background color for the button (hex code)

3. **Text Color** (required): Color for the button text and icon
   - Default: #FFFFFF (white)
   - Description: Color for text in the button (hex code)

### Optional Fields

4. **Action** (optional): The type of action this button performs
   - Options: Download, View, Open, Custom
   - Default: download
   - Description: The type of action this button performs

5. **Custom Action Text** (optional): Custom action text if "Custom" is selected
   - Description: Custom action text if "Custom" is selected above
   - Hidden unless action is set to "custom"

6. **URL** (optional): The URL the button will link to or download from
   - Description: The URL the button will link to or download from

7. **Margin Top/Bottom**: Spacing options (none, small, medium, large)
   - Default: medium

## 🎨 Visual Design

The button features:
- **Rounded corners**: Pill-like shape with `rounded-full` class
- **Download icon**: SVG icon positioned to the left of the text
- **Hover effects**: Subtle scale animation and shadow enhancement
- **Focus states**: Ring outline for keyboard navigation
- **Custom shadows**: Dynamic shadows based on button color
- **Responsive sizing**: Appropriate padding and font sizes

## 🔧 Technical Implementation

### Component Structure

```tsx
'use client';

import React from 'react';
import { LargeButtonProps } from '@/app/types/locality';

export default function LargeButton({ block }: LargeButtonProps) {
  // Component implementation
}
```

### Key Features

- **Client Component**: Uses `'use client'` directive for interactivity
- **Dynamic Styling**: Inline styles for colors and shadows
- **Event Handling**: Click handlers for different action types
- **Conditional Rendering**: Warning message when URL is not configured
- **Accessibility**: Proper button semantics and focus management

### Action Handling

- **Download**: Creates temporary link element for file download
- **View/Open**: Opens URL in new tab
- **Custom**: Uses custom action text if provided
- **No URL**: Shows warning message and disables button

## 📱 Usage Examples

### Basic Download Button

```tsx
<LargeButton 
  block={{
    buttonText: "Download Report",
    buttonColor: "#4682B4",
    textColor: "#FFFFFF",
    action: "download",
    url: "https://example.com/report.pdf"
  }} 
/>
```

### Custom Action Button

```tsx
<LargeButton 
  block={{
    buttonText: "View Full Report",
    buttonColor: "#10B981",
    textColor: "#FFFFFF",
    action: "custom",
    customAction: "View Full Report",
    url: "https://example.com/full-report"
  }} 
/>
```

### View Action Button

```tsx
<LargeButton 
  block={{
    buttonText: "Open Dashboard",
    buttonColor: "#8B5CF6",
    textColor: "#FFFFFF",
    action: "view",
    url: "https://example.com/dashboard"
  }} 
/>
```

## 🎨 Customization Options

### Color Schemes

- **Primary Blue**: #4682B4 (default)
- **Success Green**: #10B981
- **Purple**: #8B5CF6
- **Red**: #EF4444
- **Any hex color**: Fully customizable

### Text Variations

- "Download Report"
- "View Full Report"
- "Open Dashboard"
- Custom action text

### Margin Options

- **None**: mt-0, mb-0
- **Small**: mt-[20px], mb-[20px]
- **Medium**: mt-[40px], mb-[40px] (default)
- **Large**: mt-[60px], mb-[60px]

## 🔍 Testing

A test page is available at `/test-large-button` that demonstrates:
- Basic button functionality
- Different action types
- Color variations
- Error states (missing URL)

## 📋 Sanity Studio Integration

### Schema Registration

The component is registered in:
- `studio/src/schemaTypes/objects/largeButton.ts`
- `studio/src/schemaTypes/index.ts`
- `studio/src/schemaTypes/documents/page.ts`

### Thumbnail

A thumbnail SVG and WebP file are available at:
- `studio/static/page-builder-thumbnails/largeButton.svg`
- `studio/static/page-builder-thumbnails/largeButton.webp`

### Block Renderer

The component is registered in the BlockRenderer at:
- `nextjs-app/app/components/BlockRenderer.tsx`

## 🚀 Future Enhancements

Potential improvements could include:
- **Icon Customization**: Allow editors to choose different icons
- **Size Variants**: Small, medium, large button sizes
- **Animation Options**: Different hover and click animations
- **Conditional Display**: Show/hide based on user permissions or data availability
- **Analytics Tracking**: Built-in click tracking for button interactions

## 📚 Related Components

- **PayerBreakdown**: Another custom page builder block
- **OnThisPage**: Navigation component for page sections
- **ContentWrapper**: Container component for content blocks
- **BlockRenderer**: Main component for rendering page builder blocks
