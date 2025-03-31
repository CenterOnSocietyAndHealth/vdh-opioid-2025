import {defineField, defineType} from 'sanity'
import { FaMapLocationDot } from "react-icons/fa6";


export const localitySelector = defineType({
  name: 'localitySelector',
  title: 'Locality Selector',
  type: 'object',
  icon: FaMapLocationDot,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      initialValue: 'SEARCH:',
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
      initialValue: 'By Locality (County or Independent City)',
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
      title: 'heading',
    },
    prepare({title}) {
      return {
        title: title || 'Locality Selector',
        media: FaMapLocationDot
      }
    },
  },
}) 