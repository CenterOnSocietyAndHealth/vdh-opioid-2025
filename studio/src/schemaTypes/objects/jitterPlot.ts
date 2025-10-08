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
    defineField({
      name: 'totalDescription',
      title: 'All Sectors Description',
      type: 'blockContent',
      description: 'Description for the All Sectors jitter plot data table',
    }),
    defineField({
      name: 'laborDescription',
      title: 'Lost Labor Description',
      type: 'blockContent',
      description: 'Description for the Lost Labor jitter plot data table',
    }),
    defineField({
      name: 'healthcareDescription',
      title: 'Health Care Description',
      type: 'blockContent',
      description: 'Description for the Health Care jitter plot data table',
    }),
    defineField({
      name: 'crimeOtherDescription',
      title: 'Criminal Justice Description',
      type: 'blockContent',
      description: 'Description for the Criminal Justice jitter plot data table',
    }),
    defineField({
      name: 'householdDescription',
      title: 'Child Services & K-12 Description',
      type: 'blockContent',
      description: 'Description for the Child Services & K-12 jitter plot data table',
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
