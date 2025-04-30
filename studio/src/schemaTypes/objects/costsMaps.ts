import {defineField, defineType} from 'sanity'
import { MdOutlineMap } from "react-icons/md";
import { blockContent } from './blockContent';

export const costsMaps = defineType({
  name: 'costsMaps',
  title: 'Costs Maps',
  type: 'object',
  icon: MdOutlineMap,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      initialValue: 'Economic Burden of Opioids',
    }),
    defineField({
      name: 'defaultIndicator',
      title: 'Default Indicator',
      type: 'string',
      options: {
        list: [
          {title: 'Total', value: 'Total'},
          {title: 'Labor', value: 'Labor'},
          {title: 'HealthCare', value: 'HealthCare'},
          {title: 'Crime_Other', value: 'Crime_Other'},
          {title: 'Household', value: 'Household'},
        ],
      },
      initialValue: 'Total',
    }),
    defineField({
      name: 'type',
      title: 'Display Type',
      type: 'string',
      options: {
        list: [
          {title: 'Per Capita', value: 'PerCapita'},
          {title: 'Total', value: 'Total'},
        ],
      },
      initialValue: 'PerCapita',
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
      name: 'totalDescription',
      title: 'Total Cost Description',
      type: 'blockContent',
      description: 'Detailed description for the Total Cost tab',
    }),
    defineField({
      name: 'laborDescription',
      title: 'Lost Labor Description',
      type: 'blockContent',
      description: 'Detailed description for the Lost Labor tab',
    }),
    defineField({
      name: 'healthcareDescription',
      title: 'Health Care Description',
      type: 'blockContent',
      description: 'Detailed description for the Health Care tab',
    }),
    defineField({
      name: 'crimeOtherDescription',
      title: 'Crime/Other Description',
      type: 'blockContent',
      description: 'Detailed description for the Crime/Other tab',
    }),
    defineField({
      name: 'householdDescription',
      title: 'Household Description',
      type: 'blockContent',
      description: 'Detailed description for the Household tab',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      defaultIndicator: 'defaultIndicator',
    },
    prepare({title, defaultIndicator}) {
      return {
        title: title || 'Costs Maps',
        subtitle: `Default: ${defaultIndicator || 'Total'}`,
        media: MdOutlineMap
      }
    },
  },
}) 