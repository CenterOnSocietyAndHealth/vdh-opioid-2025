import {defineField, defineType} from 'sanity'
import {DownloadIcon} from '@sanity/icons'

export const downloadButton = defineType({
  name: 'downloadButton',
  title: 'Download Button',
  type: 'object',
  icon: DownloadIcon,
  fields: [
    defineField({
      name: 'buttonText',
      title: 'Button Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
      initialValue: 'Download File',
      description: 'The text displayed on the button',
    }),
    defineField({
      name: 'file',
      title: 'File to Download',
      type: 'file',
      validation: (Rule) => Rule.required(),
      description: 'Upload the file that will be downloaded when the button is clicked',
      options: {
        accept: '.pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.zip,.rar'
      }
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
      fileName: 'file.asset.originalFilename',
    },
    prepare({ buttonText, fileName }) {
      return {
        title: 'Download Button',
        subtitle: `${buttonText}${fileName ? ` - ${fileName}` : ''}`,
        media: DownloadIcon
      }
    },
  },
})
