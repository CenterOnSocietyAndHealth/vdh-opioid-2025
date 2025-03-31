import { defineCliConfig } from 'sanity/cli';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,
  token: process.env.SANITY_STUDIO_WRITE_TOKEN,
  apiVersion: '2024-03-19',
  useCdn: false,
});

const config = defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID,
    dataset: process.env.SANITY_STUDIO_DATASET,
  },
});

async function migrateCostsData() {
  try {
    // Fetch all localities
    const localities = await client.fetch(`*[_type == "locality"]{
      _id,
      _rev,
      opioidMetrics {
        totalPerCapita,
        laborPerCapita,
        healthcarePerCapita,
        crimeOtherPerCapita,
        householdPerCapita
      }
    }`);

    // Update each locality
    for (const locality of localities) {
      if (!locality.opioidMetrics) continue;

      const patch = client.patch(locality._id).set({
        Total_PerCapita: locality.opioidMetrics.totalPerCapita,
        Labor_PerCapita: locality.opioidMetrics.laborPerCapita,
        HealthCare_PerCapita: locality.opioidMetrics.healthcarePerCapita,
        Crime_Other_PerCapita: locality.opioidMetrics.crimeOtherPerCapita,
        Household_PerCapita: locality.opioidMetrics.householdPerCapita,
      });

      await patch.commit();
      console.log(`Updated locality ${locality._id}`);
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

migrateCostsData(); 