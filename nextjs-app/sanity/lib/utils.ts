import createImageUrlBuilder from "@sanity/image-url";
import { Link } from "@/sanity.types";
import { dataset, projectId, studioUrl } from "@/sanity/lib/api";
import { createDataAttribute, CreateDataAttributeProps } from "next-sanity";

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || "",
  dataset: dataset || "",
});

export const urlForImage = (source: any) => {
  // Ensure that source image contains a valid reference
  if (!source?.asset?._ref) {
    return undefined;
  }

  return imageBuilder?.image(source).auto("format").fit("max");
};

export function resolveOpenGraphImage(image: any, width = 1200, height = 627) {
  if (!image) return;
  const url = urlForImage(image)?.width(1200).height(627).fit("crop").url();
  if (!url) return;
  return { url, alt: image?.alt as string, width, height };
}

// Depending on the type of link, we need to fetch the corresponding page, post, or URL.  Otherwise return null.
export function linkResolver(link: Link | undefined) {
  if (!link) return null;
  
  console.log('linkResolver called with:', link);
  
  // Debug: Log the specific structure of page links
  if (link?.linkType === 'page' && link?.page) {
    console.log('linkResolver - Page link structure:', {
      linkType: link.linkType,
      page: link.page,
      pageType: typeof link.page,
      pageKeys: Object.keys(link.page || {}),
      slug: (link.page as any)?.slug,
      slugCurrent: (link.page as any)?.slug?.current
    });
  }
  

  // If linkType is not set but href is, lets set linkType to "href".  This comes into play when pasting links into the portable text editor because a link type is not assumed.
  if (!link.linkType && link.href) {
    link.linkType = "href";
  }
  
  // If linkType is not set but page is, lets set linkType to "page"
  if (!link.linkType && link.page) {
    link.linkType = "page";
  }

  switch (link.linkType) {
    case "href":
      return link.href || null;
    case "page":
      if (link?.page) {
        // Handle both string slugs and reference objects
        let pageSlug = '';
        if (typeof link.page === "string") {
          pageSlug = link.page;
        } else if ((link.page as any)?.slug) {
          // Handle the resolved structure where slug is directly available from the query
          pageSlug = (link.page as any).slug;
        } else if ((link.page as any)?.slug?.current) {
          pageSlug = (link.page as any).slug.current;
        } else if ((link.page as any)?.current) {
          pageSlug = (link.page as any).current;
        }
        
        if (pageSlug) {
          return `/${pageSlug}`;
        }
      }
      return null;
    default:
      return null;
  }
}

type DataAttributeConfig = CreateDataAttributeProps &
  Required<Pick<CreateDataAttributeProps, "id" | "type" | "path">>;

export function dataAttr(config: DataAttributeConfig) {
  return createDataAttribute({
    projectId,
    dataset,
    baseUrl: studioUrl,
  }).combine(config);
}
