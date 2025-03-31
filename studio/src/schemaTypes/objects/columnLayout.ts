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
      ],
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
      ],
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