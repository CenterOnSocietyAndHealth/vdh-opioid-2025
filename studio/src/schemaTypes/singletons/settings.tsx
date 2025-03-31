import {CogIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import * as demo from '../../lib/initialValues'

/**
 * Settings schema Singleton.  Singletons are single documents that are displayed not in a collection, handy for things like site settings and other global configurations.
 * Learn more: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
 */

export const settings = defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'title',
      description: 'Costs of the Opioid Epidemic in Virginia',
      title: 'Title',
      type: 'string',
      initialValue: demo.title,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      description: 'Costs of the Opioid Epidemic in Virginia',
      title: 'Description',
      type: 'array',
      initialValue: demo.description,
      of: [
        // Define a minified block content field for the description. https://www.sanity.io/docs/block-content
        defineArrayMember({
          type: 'block',
          options: {},
          styles: [],
          lists: [],
          marks: {
            decorators: [],
            annotations: [
              defineField({
                type: 'object',
                name: 'link',
                fields: [
                  {
                    type: 'string',
                    name: 'href',
                    title: 'URL',
                    validation: (rule) => rule.required(),
                  },
                ],
              }),
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Displayed on social cards and search engine results.',
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      fields: [
        defineField({
          name: 'alt',
          description: 'Important for accessibility and SEO.',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) => {
            return rule.custom((alt, context) => {
              if ((context.document?.ogImage as any)?.asset?._ref && !alt) {
                return 'Required'
              }
              return true
            })
          },
        }),
        defineField({
          name: 'metadataBase',
          type: 'url',
          description: (
            <a
              href="https://nextjs.org/docs/app/api-reference/functions/generate-metadata#metadatabase"
              rel="noreferrer noopener"
            >
              More information
            </a>
          ),
        }),
      ],
    }),
    defineField({
      name: 'headerLine1',
      title: 'Header Line 1',
      type: 'string',
      description: 'First line of the header text',
      initialValue: 'Opioid Data',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'headerLine2',
      title: 'Header Line 2',
      type: 'string',
      description: 'Second line of the header text',
      initialValue: 'Financial Impact',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'headerBackground',
      title: 'Header Background Image',
      type: 'image',
      description: 'Background image for the header section',
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      fields: [
        defineField({
          name: 'alt',
          description: 'Important for accessibility and SEO.',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) => {
            return rule.custom((alt, context) => {
              if ((context.document?.headerBackground as any)?.asset?._ref && !alt) {
                return 'Required'
              }
              return true
            })
          },
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Settings',
      }
    },
  },
})
