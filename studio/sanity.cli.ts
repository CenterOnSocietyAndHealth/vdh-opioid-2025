/**
 * Sanity CLI Configuration
 * This file configures the Sanity CLI tool with project-specific settings
 * and customizes the Vite bundler configuration.
 * Learn more: https://www.sanity.io/docs/cli
 */

import {defineCliConfig} from 'sanity/cli'

// Branch staging-2026-data: defaults target hosted Studio vdh-opioid-staging-2026 + dataset staging-2026.
// Env vars still override when set (e.g. CI). On main, restore production defaults in this file and in .env.production.
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'hoc4qxji'
const dataset = process.env.SANITY_STUDIO_DATASET || 'staging-2026'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  studioHost:
    process.env.SANITY_STUDIO_STUDIO_HOST || 'vdh-opioid-staging-2026',
  autoUpdates: true,
})
