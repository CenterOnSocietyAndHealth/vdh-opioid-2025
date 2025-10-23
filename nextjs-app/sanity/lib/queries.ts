import { defineQuery } from "next-sanity";

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`);

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture},
`;

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->{
      _ref,
      _type,
      "slug": slug.current
    },
    "post": post->slug.current
  }
`;

const definitionReference = /* groq */ `
  _type == "definition" => {
    term,
    definition
  }
`;

const markDefsReference = /* groq */ `
  ${linkReference},
  ${definitionReference}
`;

const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
      }
`;

export const localitiesQuery = defineQuery(`
  *[_type == "locality"] | order(counties asc) {
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
  }
`);

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
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
        fips,
        countyFips,
        sectorBreakdown {
          householdSectorTotal,
          fedGovtSectorTotal,
          stateLocalSectorTotal
        },
        demographics,
        regions,
        classification,
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
        ${linkFields},
      },
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{
            ...,
            ${markDefsReference}
          }
        }
      },
      _type == "textContent" => {
        ...,
        content[]{
          ...,
          markDefs[]{
            ...,
            ${markDefsReference}
          }
        }
      },
      _type == "accordion" => {
        ...,
        content[]{
          ...,
          markDefs[]{
            ...,
            ${markDefsReference}
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
              ${markDefsReference}
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
            ${markDefsReference}
          }
        },
        laborCosts[]{
          ...,
          markDefs[]{
            ...,
            ${markDefsReference}
          }
        },
        crimeOtherCosts[]{
          ...,
          markDefs[]{
            ...,
            ${markDefsReference}
          }
        },
        householdCosts[]{
          ...,
          markDefs[]{
            ...,
            ${markDefsReference}
          }
        },
        summary[]{
          ...,
          markDefs[]{
            ...,
            ${markDefsReference}
          }
        },
        sources[]{
          ...,
          markDefs[]{
            ...,
            ${markDefsReference}
          }
        }
      },
      _type == "costsBreakdown" => {
        ...,
        content[]{
          ...,
          markDefs[]{
            ...,
            ${markDefsReference}
          }
        },
        aside[]{
          ...,
          markDefs[]{
            ...,
            ${markDefsReference}
          }
        },
        asideLink {
          title,
          url,
          internalPage->{
            _id,
            "slug": slug.current
          }
        },
        mobileAside[]{
          ...,
          markDefs[]{
            ...,
            ${markDefsReference}
          }
        },
        chartDescription[]{
          ...,
          markDefs[]{
            ...,
            ${markDefsReference}
          }
        },
        sources[]{
          ...,
          markDefs[]{
            ...,
            ${markDefsReference}
          }
        }
      },
      _type == "costsMaps" => {
        ...,
        healthcareCosts[]{
          ...,
          markDefs[]{
            ...,
            ${markDefsReference}
          }
        },
        laborCosts[]{
          ...,
          markDefs[]{
            ...,
            ${markDefsReference}
          }
        },
        crimeOtherCosts[]{
          ...,
          markDefs[]{
            ...,
            ${markDefsReference}
          }
        },
        householdCosts[]{
          ...,
          markDefs[]{
            ...,
            ${markDefsReference}
          }
        },
        summary[]{
          ...,
          markDefs[]{
            ...,
            ${markDefsReference}
          }
        },
        totalSources[]{
          ...,
          markDefs[]{
            ...,
            _type == "link" => {
              ...,
              page->{
                _id,
                _type,
                "slug": slug.current
              }
            }
          }
        },
        laborSources[]{
          ...,
          markDefs[]{
            ...,
            _type == "link" => {
              ...,
              page->{
                _id,
                _type,
                "slug": slug.current
              }
            }
          }
        },
        healthcareSources[]{
          ...,
          markDefs[]{
            ...,
            _type == "link" => {
              ...,
              page->{
                _id,
                _type,
                "slug": slug.current
              }
            }
          }
        },
        crimeOtherSources[]{
          ...,
          markDefs[]{
            ...,
            _type == "link" => {
              ...,
              page->{
                _id,
                _type,
                "slug": slug.current
              }
            }
          }
        },
        householdSources[]{
          ...,
          markDefs[]{
            ...,
            _type == "link" => {
              ...,
              page->{
                _id,
                _type,
                "slug": slug.current
              }
            }
          }
        },
        // Annotation fields
        totalLeftAnnotation,
        totalTopAnnotation,
        totalRightAnnotation,
        laborLeftAnnotation,
        laborTopAnnotation,
        laborRightAnnotation,
        healthcareLeftAnnotation,
        healthcareTopAnnotation,
        healthcareRightAnnotation,
        crimeOtherLeftAnnotation,
        crimeOtherTopAnnotation,
        crimeOtherRightAnnotation,
        householdLeftAnnotation,
        householdTopAnnotation,
        householdRightAnnotation
      },
      _type == "largeButton" => {
        ...,
        page->{
          _id,
          "slug": slug.current
        }
      },
      _type == "downloadButton" => {
        ...,
        file {
          asset->{
            url,
            originalFilename
          }
        }
      },
      _type == "sourcesAccordion" => {
        ...,
        sources[]{
          ...,
          markDefs[]{
            ...,
            ${markDefsReference}
          }
        }
      },
      _type == "payerBreakdown" => {
        ...,
        sources[]{
          ...,
          markDefs[]{
            ...,
            ${markDefsReference}
          }
        }
      },
      _type == "jitterPlot" => {
        ...,
        totalSources[]{
          ...,
          markDefs[]{
            ...,
            _type == "link" => {
              ...,
              page->{
                _id,
                _type,
                "slug": slug.current
              }
            }
          }
        },
        laborSources[]{
          ...,
          markDefs[]{
            ...,
            _type == "link" => {
              ...,
              page->{
                _id,
                _type,
                "slug": slug.current
              }
            }
          }
        },
        healthcareSources[]{
          ...,
          markDefs[]{
            ...,
            _type == "link" => {
              ...,
              page->{
                _id,
                _type,
                "slug": slug.current
              }
            }
          }
        },
        crimeOtherSources[]{
          ...,
          markDefs[]{
            ...,
            _type == "link" => {
              ...,
              page->{
                _id,
                _type,
                "slug": slug.current
              }
            }
          }
        },
        householdSources[]{
          ...,
          markDefs[]{
            ...,
            _type == "link" => {
              ...,
              page->{
                _id,
                _type,
                "slug": slug.current
              }
            }
          }
        }
      },
      _type == "columnLayout" => {
        ...,
        column1[]{
          ...,
          _type == "textContent" => {
            content[]{
              ...,
              markDefs[]{
                ...,
                ${markDefsReference}
              }
            }
          }
        },
        column2[]{
          ...,
          _type == "textContent" => {
            content[]{
              ...,
              markDefs[]{
                ...,
                ${markDefsReference}
              }
            }
          }
        },
        column3[]{
          ...,
          _type == "textContent" => {
            content[]{
              ...,
              markDefs[]{
                ...,
                ${markDefsReference}
              }
            }
          }
        }
      },
    },
  }
`);

export const sitemapData = defineQuery(`
  *[_type == "page" || _type == "post" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`);

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`);

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`);

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content[]{
    ...,
    markDefs[]{
      ...,
      ${markDefsReference}
    }
  },
    ${postFields}
  }
`);

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`);

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`);
