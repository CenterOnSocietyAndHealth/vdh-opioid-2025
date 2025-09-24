import {defineField, defineType} from 'sanity'
import { MdScatterPlot } from "react-icons/md";

export const jitterPlot = defineType({
  name: 'jitterPlot',
  title: 'Jitter Plot',
  type: 'object',
  icon: MdScatterPlot,
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
    prepare() {
      return {
        title: 'Jitter Plot',
        subtitle: 'Interactive scatter plot showing cost distribution',
        media: MdScatterPlot
      }
    },
  },
})
