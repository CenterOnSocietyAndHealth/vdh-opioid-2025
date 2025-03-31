import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./api";

// Create a server-side only client with write permissions
export const serverClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Disable CDN for write operations
  perspective: "published", // Use published perspective for updates
  token: process.env.SANITY_API_TOKEN, // Use the editor token
  // Add explicit permissions
  withCredentials: true,
  stega: false,
});

// Helper function to fetch data server-side
export async function fetchPage(slug: string) {
  const [page, localities] = await Promise.all([
    serverClient.fetch(
      `*[_type == 'page' && slug.current == $slug][0]{
        _id,
        _type,
        name,
        slug,
        heading,
        subheading,
        "rawSelectedLocality": selectedLocality,
        "selectedLocality": select(
          defined(selectedLocality) => selectedLocality->{
            _id,
            counties,
            demographics,
            regions,
            classification {
              category,
              urbanRural,
              metroNonMetro
            },
            opioidMetrics {
              totalPerCapita,
              totalTotal,
              laborPerCapita,
              laborTotal,
              healthcarePerCapita,
              healthcareTotal,
              crimeOtherPerCapita,
              crimeOtherTotal,
              householdPerCapita,
              householdTotal,
              totalTotalPercentile,
              totalTotalComparison,
              totalPerCapitaPercentile,
              totalPerCapitaComparison
            }
          },
          null
        ),
        "pageBuilder": pageBuilder[]{
          ...,
          _type == "callToAction" => {
            link {
              ...,
              _type == "link" => {
                "page": page->slug.current,
                "post": post->slug.current
              }
            }
          },
          _type == "infoSection" => {
            content[]{
              ...,
              markDefs[]{
                ...,
                _type == "link" => {
                  "page": page->slug.current,
                  "post": post->slug.current
                }
              }
            }
          }
        }
      }`,
      { slug }
    ),
    serverClient.fetch(
      `*[_type == "locality"] | order(counties asc) {
        _id,
        counties,
        fips,
        demographics {
          totalPopulation,
          medianAge,
          medianIncome,
          povertyPct
        },
        regions {
          healthDistrict,
          healthRegion,
          cooperCtrRegion
        },
        classification {
          category,
          urbanRural,
          metroNonMetro
        },
        opioidMetrics {
          totalPerCapita,
          totalTotal,
          laborPerCapita,
          laborTotal,
          healthcarePerCapita,
          healthcareTotal,
          crimeOtherPerCapita,
          crimeOtherTotal,
          householdPerCapita,
          householdTotal,
          totalTotalPercentile,
          totalTotalComparison,
          totalPerCapitaPercentile,
          totalPerCapitaComparison
        }
      }`
    )
  ]);

  return { data: page, localities };
} 