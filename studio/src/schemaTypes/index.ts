import {page} from './documents/page'
import {locality} from './documents/locality'
import {settings} from './singletons/settings'
import {link} from './objects/link'
import {blockContent} from './objects/blockContent'
import {textContent} from './objects/textContent'
import {localitySelector} from './objects/localitySelector'
import {columnLayout} from './objects/columnLayout'
import {costsMaps} from './objects/costsMaps'
import {costsBreakdown} from './objects/costsBreakdown'

// Export an array of all the schema types.  This is used in the Sanity Studio configuration. https://www.sanity.io/docs/schema-types

export const schemaTypes = [
  // Singletons
  settings,
  // Documents
  page,
  locality,
  // Objects
  blockContent,
  link,
  textContent,
  localitySelector,
  columnLayout,
  costsMaps,
  costsBreakdown,
]
