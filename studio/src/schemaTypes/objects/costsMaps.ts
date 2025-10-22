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
    defineField({
      name: 'totalSources',
      title: 'Total Cost Sources',
      type: 'blockContent',
      description: 'Sources information for the Total Cost tab',
    }),
    defineField({
      name: 'laborSources',
      title: 'Lost Labor Sources',
      type: 'blockContent',
      description: 'Sources information for the Lost Labor tab',
    }),
    defineField({
      name: 'healthcareSources',
      title: 'Health Care Sources',
      type: 'blockContent',
      description: 'Sources information for the Health Care tab',
    }),
    defineField({
      name: 'crimeOtherSources',
      title: 'Crime/Other Sources',
      type: 'blockContent',
      description: 'Sources information for the Crime/Other tab',
    }),
    defineField({
      name: 'householdSources',
      title: 'Household Sources',
      type: 'blockContent',
      description: 'Sources information for the Household tab',
    }),
    // Annotation fields for Total sector
    defineField({
      name: 'totalLeftAnnotation',
      title: 'Total - Left Annotation',
      type: 'string',
      description: 'Left annotation text for Total sector map (desktop only)',
    }),
    defineField({
      name: 'totalTopAnnotation',
      title: 'Total - Top Annotation',
      type: 'string',
      description: 'Top annotation text for Total sector map (desktop only)',
    }),
    defineField({
      name: 'totalRightAnnotation',
      title: 'Total - Right Annotation',
      type: 'string',
      description: 'Right annotation text for Total sector map (desktop only)',
    }),
    // Annotation fields for Labor sector
    defineField({
      name: 'laborLeftAnnotation',
      title: 'Labor - Left Annotation',
      type: 'string',
      description: 'Left annotation text for Labor sector map (desktop only)',
    }),
    defineField({
      name: 'laborTopAnnotation',
      title: 'Labor - Top Annotation',
      type: 'string',
      description: 'Top annotation text for Labor sector map (desktop only)',
    }),
    defineField({
      name: 'laborRightAnnotation',
      title: 'Labor - Right Annotation',
      type: 'string',
      description: 'Right annotation text for Labor sector map (desktop only)',
    }),
    // Annotation fields for Healthcare sector
    defineField({
      name: 'healthcareLeftAnnotation',
      title: 'Healthcare - Left Annotation',
      type: 'string',
      description: 'Left annotation text for Healthcare sector map (desktop only)',
    }),
    defineField({
      name: 'healthcareTopAnnotation',
      title: 'Healthcare - Top Annotation',
      type: 'string',
      description: 'Top annotation text for Healthcare sector map (desktop only)',
    }),
    defineField({
      name: 'healthcareRightAnnotation',
      title: 'Healthcare - Right Annotation',
      type: 'string',
      description: 'Right annotation text for Healthcare sector map (desktop only)',
    }),
    // Annotation fields for Crime_Other sector
    defineField({
      name: 'crimeOtherLeftAnnotation',
      title: 'Crime/Other - Left Annotation',
      type: 'string',
      description: 'Left annotation text for Crime/Other sector map (desktop only)',
    }),
    defineField({
      name: 'crimeOtherTopAnnotation',
      title: 'Crime/Other - Top Annotation',
      type: 'string',
      description: 'Top annotation text for Crime/Other sector map (desktop only)',
    }),
    defineField({
      name: 'crimeOtherRightAnnotation',
      title: 'Crime/Other - Right Annotation',
      type: 'string',
      description: 'Right annotation text for Crime/Other sector map (desktop only)',
    }),
    // Annotation fields for Household sector
    defineField({
      name: 'householdLeftAnnotation',
      title: 'Household - Left Annotation',
      type: 'string',
      description: 'Left annotation text for Household sector map (desktop only)',
    }),
    defineField({
      name: 'householdTopAnnotation',
      title: 'Household - Top Annotation',
      type: 'string',
      description: 'Top annotation text for Household sector map (desktop only)',
    }),
    defineField({
      name: 'householdRightAnnotation',
      title: 'Household - Right Annotation',
      type: 'string',
      description: 'Right annotation text for Household sector map (desktop only)',
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