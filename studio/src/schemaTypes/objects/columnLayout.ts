import {defineField, defineType} from 'sanity'
import { HiOutlineViewColumns } from "react-icons/hi2";


export const columnLayout = defineType({
  name: 'columnLayout',
  title: 'Column Layout',
  type: 'object',
  icon: HiOutlineViewColumns,
  fields: [
    defineField({
      name: 'columns',
      title: 'Number of Columns',
      type: 'number',
      options: {
        list: [
          {title: 'Two Columns', value: 2},
          {title: 'Three Columns', value: 3},
        ],
      },
      initialValue: 2,
    }),
    defineField({
      name: 'column1Width',
      title: 'Column 1 Width (%)',
      type: 'number',
      description: 'Width percentage for column 1 (defaults to equal distribution)',
      validation: (Rule) => Rule.min(10).max(90).warning('Width should be between 10% and 90%'),
      initialValue: undefined,
    }),
    defineField({
      name: 'column1',
      title: 'Column 1',
      type: 'array',
      of: [
        {
          type: 'textContent',
          options: {
            modal: {
              type: 'dialog',
              width: 'large'
            }
          }
        },
        {
          type: 'localitySelector',
          options: {
            modal: {
              type: 'dialog',
              width: 'large'
            }
          }
        },
        {
          type: 'imageBlock',
          options: {
            modal: {
              type: 'dialog',
              width: 'auto'
            }
          }
        },
        { type: 'jitterPlot' },
      ],
    }),
    defineField({
      name: 'column2Width',
      title: 'Column 2 Width (%)',
      type: 'number',
      description: 'Width percentage for column 2 (defaults to equal distribution)',
      validation: (Rule) => Rule.min(10).max(90).warning('Width should be between 10% and 90%'),
      initialValue: undefined,
    }),
    defineField({
      name: 'column2',
      title: 'Column 2',
      type: 'array',
      of: [
        {
          type: 'textContent',
          options: {
            modal: {
              type: 'dialog',
              width: 'large'
            }
          }
        },
        {
          type: 'localitySelector',
          options: {
            modal: {
              type: 'dialog',
              width: 'large'
            }
          }
        },
        {
          type: 'imageBlock',
          options: {
            modal: {
              type: 'dialog',
              width: 'auto'
            }
          }
        },
        { type: 'jitterPlot' },
      ],
    }),
    defineField({
      name: 'column3Width',
      title: 'Column 3 Width (%)',
      type: 'number',
      description: 'Width percentage for column 3 (defaults to equal distribution)',
      validation: (Rule) => Rule.min(10).max(90).warning('Width should be between 10% and 90%'),
      initialValue: undefined,
      hidden: ({parent}) => parent?.columns !== 3,
    }),
    defineField({
      name: 'column3',
      title: 'Column 3',
      type: 'array',
      of: [
        {
          type: 'textContent',
          options: {
            modal: {
              type: 'dialog',
              width: 'large'
            }
          }
        },
        {
          type: 'localitySelector',
          options: {
            modal: {
              type: 'dialog',
              width: 'large'
            }
          }
        },
        {
          type: 'imageBlock',
          options: {
            modal: {
              type: 'dialog',
              width: 'auto'
            }
          }
        },
        { type: 'jitterPlot' },
      ],
      hidden: ({parent}) => parent?.columns !== 3,
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
      title: 'Maximum Width',
      type: 'number',
      description: 'Maximum width in pixels. Leave empty for full width.',
      validation: (Rule) => Rule.min(100).max(2000),
      initialValue: undefined,
    }),
    defineField({
      name: 'containerClass',
      title: 'Container CSS Class',
      type: 'string',
      description: 'Additional CSS class to apply to the container. Useful for custom styling.',
      validation: (Rule) => Rule.max(100).warning('Keep class names concise'),
      initialValue: undefined,
    }),
  ],
  preview: {
    select: {
      columns: 'columns',
    },
    prepare({columns}) {
      return {
        title: `${columns} Column Layout`,
        media: HiOutlineViewColumns
      }
    },
  },
  options: {
    collapsible: true,
    collapsed: false,
  }
}) 