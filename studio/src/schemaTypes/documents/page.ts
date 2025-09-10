import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

/**
 * Page schema.  Define and edit the fields for the 'page' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'name',
        maxLength: 96,
      },
    }),
    defineField({
      name: 'selectedLocality',
      title: 'Selected Locality',
      type: 'reference',
      to: [{type: 'locality'}],
      description: 'The currently selected locality for this page',
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page builder',
      type: 'array',
      of: [
        { type: 'textContent' },
        { type: 'imageBlock' },
        { type: 'localitySelector' },
        { type: 'columnLayout' },
        { type: 'costsMaps' },
        { type: 'costsBreakdown' },
        { type: 'payerBreakdown' },
        { type: 'largeButton' },
        { type: 'accordion' },
        { type: 'contentWrapper' },
        { type: 'onThisPage' },
        { type: 'sectorSelector' },
        { type: 'sources' },
      ],
      options: {
        insertMenu: {
          // Configure the "Add Item" menu to display a thumbnail preview of the content type. https://www.sanity.io/docs/array-type#efb1fe03459d
          views: [
            {
              name: 'grid',
              previewImageUrl: (schemaTypeName) => {
                // Try WebP first, fall back to SVG if WebP doesn't exist
                return `/static/page-builder-thumbnails/${schemaTypeName}.webp`;
              },
            },
          ],
        },
      },
    }),
  ],
})
