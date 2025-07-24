# Definition Feature

This feature allows content editors to add definitions to highlighted text in the rich text editor. When users hover over the highlighted text, a popup appears with the definition.

## How to Use

### In the Sanity Studio Editor

1. **Select Text**: Highlight the word or phrase you want to define
2. **Add Definition**: Click the definition button (question mark icon) in the rich text toolbar
3. **Fill in Details**:
   - **Term**: The term being defined (auto-filled from selected text)
   - **Definition**: The definition of the term
4. **Save**: The definition will be saved and the text will be highlighted with a dotted underline

### Visual Appearance

- **Highlighted Text**: Dotted underline
- **Cursor**: Changes to question mark (help cursor) on hover
- **Popup**: Light gray background with rounded corners
- **Icon**: Black question mark in a circle
- **Arrow**: Points down to the highlighted text

## Technical Implementation

### Schema Changes

The definition feature adds a new annotation type to the `blockContent` schema:

```typescript
{
  name: 'definition',
  type: 'object',
  title: 'Definition',
  fields: [
    {
      name: 'term',
      title: 'Term',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'definition',
      title: 'Definition',
      type: 'text',
      validation: (Rule) => Rule.required(),
    },
  ],
}
```

### Components

- **DefinitionPopup**: React component that renders the popup with hover functionality
- **TextContent**: Updated to include the definition mark in PortableText components

### TypeScript Types

The following types have been updated to include the definition annotation:
- `BlockContent`
- `InfoSection`
- `Definition` (new type)

## Example Usage

In the rich text editor, you can now:

1. Type: "Anyone can misuse opioids in ways that harm the social and economic environment around us can influence our risk. We can improve outcomes in every community by investing in **evidence-based opioid care**."

2. Select "evidence-based opioid care"

3. Add a definition with:
   - Term: "Evidence-based opioid care"
   - Definition: "approaches that scientific research has proven effective in improving health outcomes. They include a range of care options, from harm reduction measures to psychotherapy to medication-based opioid treatment, among others."

4. The text will appear with a dotted underline and show the definition popup on hover.

## Styling

The popup uses Tailwind CSS classes for styling:
- Light gray background (`bg-gray-100`)
- Rounded corners (`rounded-lg`)
- Shadow (`shadow-lg`)
- Responsive positioning
- Question mark icon with black background
- Arrow pointing to the highlighted text 