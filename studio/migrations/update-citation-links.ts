import { createClient } from '@sanity/client'

// Environment variables for project configuration
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'your-projectID'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const apiVersion = '2024-01-01'

// Create a client with write permissions
const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_STUDIO_WRITE_TOKEN,
})

// Function to recursively update links in block content
function updateLinksInBlockContent(blocks: any[]): any[] {
  if (!blocks || !Array.isArray(blocks)) return blocks

  return blocks.map(block => {
    if (block._type === 'block' && block.markDefs) {
      // Update markDefs (annotations) to set blank: true for links
      const updatedMarkDefs = block.markDefs.map((markDef: any) => {
        if (markDef._type === 'link' && markDef.linkType === 'href') {
          return {
            ...markDef,
            blank: true
          }
        }
        return markDef
      })

      return {
        ...block,
        markDefs: updatedMarkDefs
      }
    }

    // Recursively process nested blocks
    if (block.children) {
      return {
        ...block,
        children: updateLinksInBlockContent(block.children)
      }
    }

    return block
  })
}

async function updateCitationLinks() {
  try {
    console.log('🔍 Finding all pages with sources...')
    
    // Find all pages that have sources blocks
    const pages = await client.fetch(`
      *[_type == "page" && defined(pageBuilder)] {
        _id,
        _rev,
        pageBuilder
      }
    `)

    console.log(`📄 Found ${pages.length} pages to check`)

    let updatedPages = 0
    let totalLinksUpdated = 0

    for (const page of pages) {
      let pageUpdated = false
      let pageLinksUpdated = 0

      // Process each block in pageBuilder
      const updatedPageBuilder = page.pageBuilder.map((block: any) => {
        if (block._type === 'sources' && block.citations) {
          // Update each citation's text content
          const updatedCitations = block.citations.map((citation: any) => {
            if (citation.text) {
              const updatedText = updateLinksInBlockContent(citation.text)
              
              // Check if any links were updated
              const originalLinks = citation.text.flatMap((block: any) => 
                block.markDefs?.filter((mark: any) => mark._type === 'link' && mark.linkType === 'href') || []
              )
              
              const updatedLinks = updatedText.flatMap((block: any) => 
                block.markDefs?.filter((mark: any) => mark._type === 'link' && mark.linkType === 'href') || []
              )

              const linksChanged = originalLinks.some((originalLink: any, index: number) => {
                const updatedLink = updatedLinks[index]
                return updatedLink && updatedLink.blank !== originalLink.blank
              })

              if (linksChanged) {
                pageUpdated = true
                pageLinksUpdated += originalLinks.length
              }

              return {
                ...citation,
                text: updatedText
              }
            }
            return citation
          })

          return {
            ...block,
            citations: updatedCitations
          }
        }
        return block
      })

      // Update the page if any changes were made
      if (pageUpdated) {
        try {
          await client
            .patch(page._id)
            .set({ pageBuilder: updatedPageBuilder })
            .commit()

          console.log(`✅ Updated page ${page._id} - ${pageLinksUpdated} links updated`)
          updatedPages++
          totalLinksUpdated += pageLinksUpdated
        } catch (error) {
          console.error(`❌ Failed to update page ${page._id}:`, error)
        }
      }
    }

    console.log(`\n🎉 Migration completed!`)
    console.log(`📊 Summary:`)
    console.log(`   - Pages updated: ${updatedPages}`)
    console.log(`   - Total links updated: ${totalLinksUpdated}`)

  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

// Run the migration
updateCitationLinks()
  .then(() => {
    console.log('✅ Migration script completed successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('❌ Migration script failed:', error)
    process.exit(1)
  })
