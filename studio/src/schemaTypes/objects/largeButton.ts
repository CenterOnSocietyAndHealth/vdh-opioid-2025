import {defineField, defineType} from 'sanity'
import {DownloadIcon} from '@sanity/icons'

export const largeButton = defineType({
  name: 'largeButton',
  title: 'Large Button',
  type: 'object',
  icon: 'button',
  fields: [
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'Download Report for',
      description: 'The main button text (e.g., "Download Report for")',
    }),

    defineField({
      name: 'action',
      title: 'Action',
      type: 'string',
      options: {
        list: [
          {title: 'Download', value: 'download'},
          {title: 'View', value: 'view'},
          {title: 'Open', value: 'open'},
          {title: 'Custom', value: 'custom'},
        ],
      },
      initialValue: 'download',
      description: 'The type of action this button performs',
    }),
    defineField({
      name: 'customAction',
      title: 'Custom Action Text',
      type: 'string',
      description: 'Custom action text if "Custom" is selected above',
      hidden: ({parent}) => parent?.action !== 'custom',
    }),
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      options: {
        list: [
          {title: 'External URL', value: 'url'},
          {title: 'Internal Page', value: 'page'},
        ],
      },
      initialValue: 'url',
      description: 'Choose whether to link to an external URL or an internal page',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'The external URL the button will link to or download from',
      hidden: ({parent}) => parent?.linkType !== 'url',
    }),
    defineField({
      name: 'page',
      title: 'Page',
      type: 'reference',
      to: [{type: 'page'}],
      description: 'The internal page the button will link to',
      hidden: ({parent}) => parent?.linkType !== 'page',
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in New Tab',
      type: 'boolean',
      description: 'Open the link in a new tab/window',
      initialValue: false,
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
      buttonText: 'buttonText',
      action: 'action',
    },
    prepare({ buttonText, action }) {
      const actionText = action === 'custom' ? 'Custom' : action;
      return {
        title: 'Large Button',
        subtitle: `${actionText}: ${buttonText}`,
        media: 'button'
      }
    },
  },
})
