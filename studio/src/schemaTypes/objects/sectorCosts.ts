import {defineField, defineType} from 'sanity'
import { LuDollarSign } from "react-icons/lu";

export const sectorCosts = defineType({
  name: 'sectorCosts',
  title: 'Sector Costs',
  type: 'object',
  icon: LuDollarSign,
  fields: [
    defineField({
      name: 'allSectorsContent',
      title: 'All Sectors Content',
      type: 'blockContent',
      description: 'Content displayed when "All Sectors" is selected',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lostLaborContent',
      title: 'Lost Labor Content',
      type: 'blockContent',
      description: 'Content displayed when "Lost Labor" is selected',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'healthcareContent',
      title: 'Healthcare Content',
      type: 'blockContent',
      description: 'Content displayed when "Healthcare" is selected',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'childServicesContent',
      title: 'Child Services & K12 Content',
      type: 'blockContent',
      description: 'Content displayed when "Child Services & K12" is selected',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'criminalJusticeContent',
      title: 'Criminal Justice Content',
      type: 'blockContent',
      description: 'Content displayed when "Criminal Justice" is selected',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sectionId',
      title: 'Section ID',
      type: 'string',
      description: 'Optional: Add an ID to this section for on-page navigation links (e.g., "section-1", "overview")',
      validation: (Rule) => Rule.regex(/^[a-zA-Z0-9-_]+$/).warning('Please use only letters, numbers, hyphens, and underscores'),
    }),
    defineField({
      name: 'textAlignment',
      title: 'Text Alignment',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Center', value: 'center'},
          {title: 'Right', value: 'right'},
        ],
      },
      initialValue: 'left',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          {title: 'None', value: 'transparent'},
          {title: 'Light Gray', value: '#f0f0f0'},
          {title: 'White', value: '#ffffff'},
          {title: 'Light Blue', value: '#e6f3ff'},
          {title: 'Light Green', value: '#f0f8f0'},
          {title: 'Light Yellow', value: '#fffbf0'},
          {title: 'Custom', value: 'custom'},
        ],
      },
      initialValue: 'transparent',
    }),
    defineField({
      name: 'customBackgroundColor',
      title: 'Custom Background Color',
      type: 'string',
      description: 'Enter a hex color code (e.g., #ff0000)',
      hidden: ({parent}) => parent?.backgroundColor !== 'custom',
      validation: (Rule) => Rule.regex(/^#[0-9A-Fa-f]{6}$/).warning('Please enter a valid hex color code'),
    }),
    defineField({
      name: 'marginTop',
      title: 'Margin Top',
      type: 'string',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Small', value: 'small'},
          {title: 'Medium', value: 'medium'},
          {title: 'Large', value: 'large'},
        ],
      },
      initialValue: 'none',
    }),
    defineField({
      name: 'marginBottom',
      title: 'Margin Bottom',
      type: 'string',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Small', value: 'small'},
          {title: 'Medium', value: 'medium'},
          {title: 'Large', value: 'large'},
        ],
      },
      initialValue: 'none',
    }),
    defineField({
      name: 'maxWidth',
      title: 'Max Width',
      type: 'number',
      description: 'Set maximum width in pixels (leave empty for full width)',
    }),
  ],
  preview: {
    select: {
      allSectorsContent: 'allSectorsContent',
      sectionId: 'sectionId'
    },
    prepare({ allSectorsContent, sectionId }) {
      // Find the first block that is a heading of any type
      const firstHeading = allSectorsContent?.find((block: any) => 
        block._type === 'block' && 
        (block.style === 'h1' || block.style === 'h2' || block.style === 'h3' || block.style === 'h4')
      )
      
      let title = 'Sector Costs'
      if (firstHeading) {
        title = firstHeading.children?.[0]?.text || 'Sector Costs'
      } else {
        // If no heading found, get first paragraph
        const firstParagraph = allSectorsContent?.find((block: any) => block._type === 'block' && block.style === 'normal')
        if (firstParagraph) {
          const text = firstParagraph.children?.[0]?.text || ''
          title = text.length > 50 ? text.substring(0, 50) + '...' : text || 'Sector Costs'
        }
      }

      return {
        title: title,
        subtitle: sectionId ? `ID: ${sectionId}` : 'Dynamic content based on selected sector',
        media: LuDollarSign
      }
    },
  },
  options: {
    modal: {
      type: 'dialog',
      width: 'auto'
    }
  }
})
