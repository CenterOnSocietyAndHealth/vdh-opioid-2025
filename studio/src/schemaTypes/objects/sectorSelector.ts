import {defineField, defineType} from 'sanity'
import { FaLayerGroup } from "react-icons/fa6";

export const sectorSelector = defineType({
  name: 'sectorSelector',
  title: 'Sector Selector',
  type: 'object',
  icon: FaLayerGroup,
  fields: [
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
      initialValue: 'medium',
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
      initialValue: 'medium',
    }),
  ],
  preview: {
    select: {
      title: 'marginTop',
    },
    prepare({title}) {
      return {
        title: 'Sector Selector',
        subtitle: `Margin: ${title || 'medium'}`,
        media: FaLayerGroup
      }
    },
  },
})
