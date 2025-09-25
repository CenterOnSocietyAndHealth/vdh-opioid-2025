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
// @deprecated Use sanityFetch with getPageQuery and localitiesQuery instead
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
            },
            opioidCases {
              oudDeaths2023,
              oudCases2023
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
                },
                _type == "definition" => {
                  term,
                  definition
                }
              }
            }
          },
          _type == "textContent" => {
            ...,
            content[]{
              ...,
              markDefs[]{
                ...,
                _type == "link" => {
                  "page": page->slug.current,
                  "post": post->slug.current
                },
                _type == "definition" => {
                  term,
                  definition
                }
              }
            }
          },
          _type == "accordion" => {
            ...,
            content[]{
              ...,
              markDefs[]{
                ...,
                _type == "link" => {
                  "page": page->slug.current,
                  "post": post->slug.current
                },
                _type == "definition" => {
                  term,
                  definition
                }
              }
            }
          },
          _type == "sources" => {
            ...,
            citations[]{
              ...,
              text[]{
                ...,
                markDefs[]{
                  ...,
                  _type == "link" => {
                    "page": page->slug.current,
                    "post": post->slug.current
                  },
                  _type == "definition" => {
                    term,
                    definition
                  }
                }
              }
            }
          },
          _type == "sectorCosts" => {
            ...,
            healthcareCosts[]{
              ...,
              markDefs[]{
                ...,
                _type == "link" => {
                  "page": page->slug.current,
                  "post": post->slug.current
                },
                _type == "definition" => {
                  term,
                  definition
                }
              }
            },
            laborCosts[]{
              ...,
              markDefs[]{
                ...,
                _type == "link" => {
                  "page": page->slug.current,
                  "post": post->slug.current
                },
                _type == "definition" => {
                  term,
                  definition
                }
              }
            },
            crimeOtherCosts[]{
              ...,
              markDefs[]{
                ...,
                _type == "link" => {
                  "page": page->slug.current,
                  "post": post->slug.current
                },
                _type == "definition" => {
                  term,
                  definition
                }
              }
            },
            householdCosts[]{
              ...,
              markDefs[]{
                ...,
                _type == "link" => {
                  "page": page->slug.current,
                  "post": post->slug.current
                },
                _type == "definition" => {
                  term,
                  definition
                }
              }
            },
            summary[]{
              ...,
              markDefs[]{
                ...,
                _type == "link" => {
                  "page": page->slug.current,
                  "post": post->slug.current
                },
                _type == "definition" => {
                  term,
                  definition
                }
              }
            }
          },
          _type == "costsBreakdown" => {
            ...,
            content[]{
              ...,
              markDefs[]{
                ...,
                _type == "link" => {
                  "page": page->slug.current,
                  "post": post->slug.current
                },
                _type == "definition" => {
                  term,
                  definition
                }
              }
            }
          },
          _type == "costsMaps" => {
            ...,
            healthcareCosts[]{
              ...,
              markDefs[]{
                ...,
                _type == "link" => {
                  "page": page->slug.current,
                  "post": post->slug.current
                },
                _type == "definition" => {
                  term,
                  definition
                }
              }
            },
            laborCosts[]{
              ...,
              markDefs[]{
                ...,
                _type == "link" => {
                  "page": page->slug.current,
                  "post": post->slug.current
                },
                _type == "definition" => {
                  term,
                  definition
                }
              }
            },
            crimeOtherCosts[]{
              ...,
              markDefs[]{
                ...,
                _type == "link" => {
                  "page": page->slug.current,
                  "post": post->slug.current
                },
                _type == "definition" => {
                  term,
                  definition
                }
              }
            },
            householdCosts[]{
              ...,
              markDefs[]{
                ...,
                _type == "link" => {
                  "page": page->slug.current,
                  "post": post->slug.current
                },
                _type == "definition" => {
                  term,
                  definition
                }
              }
            },
            summary[]{
              ...,
              markDefs[]{
                ...,
                _type == "link" => {
                  "page": page->slug.current,
                  "post": post->slug.current
                },
                _type == "definition" => {
                  term,
                  definition
                }
              }
            }
          },
          _type == "largeButton" => {
            ...,
            page->{
              _id,
              "slug": slug.current
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
        countyFips,
        sectorBreakdown {
          householdSectorTotal,
          fedGovtSectorTotal,
          stateLocalSectorTotal
        },
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
        },
        opioidCases {
          oudDeaths2023,
          oudCases2023
        }
      }`
    )
  ]);

  return { data: page, localities };
} 