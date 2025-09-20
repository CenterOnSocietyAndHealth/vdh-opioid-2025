import {defineField, defineType} from 'sanity'
import { LuUsers } from "react-icons/lu";

export const localityDemographics = defineType({
  name: 'localityDemographics',
  title: 'Locality Demographics',
  type: 'object',
  icon: LuUsers,
  fields: [
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
      sectionId: 'sectionId'
    },
    prepare({ sectionId }) {
      return {
        title: 'Locality Demographics',
        subtitle: sectionId ? `ID: ${sectionId}` : 'Displays population, OUD deaths, OUD cases, and cases per 100k',
        media: LuUsers
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
