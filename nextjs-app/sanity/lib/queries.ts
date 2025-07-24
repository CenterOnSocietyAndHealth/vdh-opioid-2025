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
    "page": page->slug.current,
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
