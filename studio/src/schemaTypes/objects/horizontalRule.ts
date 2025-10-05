import {defineField, defineType} from 'sanity'

export const horizontalRule = defineType({
  name: 'horizontalRule',
  title: 'Horizontal Rule',
  type: 'object',
  icon: 'minus',
  fields: [
    defineField({
      name: 'width',
      title: 'Width (px)',
      type: 'number',
      description: 'Width of the horizontal rule in pixels',
      initialValue: 895,
      validation: (Rule) => Rule.min(1).max(2000),
    }),
    defineField({
      name: 'thickness',
      title: 'Thickness (px)',
      type: 'number',
      description: 'Thickness of the horizontal rule in pixels',
      initialValue: 1,
      validation: (Rule) => Rule.min(1).max(20),
    }),
    defineField({
      name: 'color',
      title: 'Color',
      type: 'string',
      options: {
        list: [
          {title: 'Light Gray', value: '#E6E6E6'},
          {title: 'Medium Gray', value: '#CCCCCC'},
          {title: 'Dark Gray', value: '#999999'},
          {title: 'Black', value: '#000000'},
          {title: 'Custom', value: 'custom'},
        ],
      },
      initialValue: '#E6E6E6',
      description: 'Color of the horizontal rule',
    }),
    defineField({
      name: 'customColor',
      title: 'Custom Color',
      type: 'string',
      description: 'Custom hex color (e.g., #FF0000)',
      hidden: ({parent}) => parent?.color !== 'custom',
      validation: (Rule) =>
        Rule.custom((value, context: any) => {
          if (context.parent?.color === 'custom' && !value) {
            return 'Custom color is required when Color is set to Custom'
          }
          if (value && !value.match(/^#[0-9A-Fa-f]{6}$/)) {
            return 'Color must be a valid hex color (e.g., #FF0000)'
          }
          return true
        }),
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
      width: 'width',
      thickness: 'thickness',
      color: 'color',
      customColor: 'customColor',
    },
    prepare({ width, thickness, color, customColor }) {
      const displayColor = color === 'custom' ? customColor : color;
      return {
        title: 'Horizontal Rule',
        subtitle: `${width}px × ${thickness}px • ${displayColor || '#E6E6E6'}`,
        media: 'minus'
      }
    },
  },
})
