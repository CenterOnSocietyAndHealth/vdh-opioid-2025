import imageUrlBuilder from '@sanity/image-url'
import { client } from './client'

export const urlForImage = (source: any) => {
  return imageUrlBuilder(client).image(source)
} 