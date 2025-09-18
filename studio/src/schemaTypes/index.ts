import {page} from './documents/page'
import {locality} from './documents/locality'
import {settings} from './singletons/settings'
import {link} from './objects/link'
import {blockContent} from './objects/blockContent'
import {textContent} from './objects/textContent'
import {imageBlock} from './objects/image'
import {localitySelector} from './objects/localitySelector'
import {sectorSelector} from './objects/sectorSelector'
import {columnLayout} from './objects/columnLayout'
import {costsMaps} from './objects/costsMaps'
import {costsBreakdown} from './objects/costsBreakdown'
import {payerBreakdown} from './objects/payerBreakdown'
import {largeButton} from './objects/largeButton'
import {accordion} from './objects/accordion'
import {contentWrapper} from './objects/contentWrapper'
import {onThisPage} from './objects/onThisPage'
import {sources} from './objects/sources'
import {sectorCosts} from './objects/sectorCosts'
import {localityPayorBreakdown} from './objects/localityPayorBreakdown'

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
  imageBlock,
  localitySelector,
  sectorSelector,
  columnLayout,
  costsMaps,
  costsBreakdown,
  payerBreakdown,
  largeButton,
  accordion,
  contentWrapper,
  onThisPage,
  sources,
  sectorCosts,
  localityPayorBreakdown,
]
