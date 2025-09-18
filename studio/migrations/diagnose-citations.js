const { createClient } = require('@sanity/client')

// Environment variables for project configuration
const projectId = 'hoc4qxji'
const dataset = 'production'
const apiVersion = '2024-10-28'

// Create a client with read permissions
const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
})

async function diagnoseCitations() {
    try {
        console.log('🔍 Finding all pages with sources...')

        // Find all pages that have sources blocks
        const pages = await client.fetch(`
      *[_type == "page" && defined(pageBuilder)] {
        _id,
        pageBuilder
      }
    `)

        console.log(`📄 Found ${pages.length} pages to check`)

        for (const page of pages) {
            console.log(`\n📄 Page: ${page._id}`)

            // Process each block in pageBuilder
            page.pageBuilder.forEach((block, blockIndex) => {
                if (block._type === 'sources' && block.citations) {
                    console.log(`  📚 Sources block found with ${block.citations.length} citations`)

                    block.citations.forEach((citation, citationIndex) => {
                        if (citation.text) {
                            console.log(`    📝 Citation ${citationIndex + 1}:`)

                            // Find all links in this citation
                            const links = citation.text.flatMap((block) =>
                                block.markDefs?.filter((mark) => mark._type === 'link') || []
                            )

                            if (links.length > 0) {
                                console.log(`      🔗 Found ${links.length} links:`)
                                links.forEach((link, linkIndex) => {
                                    console.log(`        ${linkIndex + 1}. Type: ${link.linkType}, URL: ${link.href}, Blank: ${link.blank}`)
                                })
                            } else {
                                console.log(`      ❌ No links found`)
                            }
                        }
                    })
                }
            })
        }

        console.log('\n✅ Diagnosis completed!')

    } catch (error) {
        console.error('❌ Diagnosis failed:', error)
        process.exit(1)
    }
}

// Run the diagnosis
diagnoseCitations()
    .then(() => {
        console.log('✅ Diagnosis script completed successfully')
        process.exit(0)
    })
    .catch((error) => {
        console.error('❌ Diagnosis script failed:', error)
        process.exit(1)
    })
