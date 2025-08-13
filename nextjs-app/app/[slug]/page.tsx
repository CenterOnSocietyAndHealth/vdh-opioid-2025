import type { Metadata } from "next";
import Head from "next/head";

import PageBuilderPage from "@/app/components/PageBuilder";
import { sanityFetch } from "@/sanity/lib/live";
import { getPageQuery, pagesSlugs, localitiesQuery } from "@/sanity/lib/queries";
import { GetPageQueryResult } from "@/sanity.types";

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: pagesSlugs,
    // // Use the published perspective in generateStaticParams
    perspective: "published",
    stega: false,
  });
  return data;
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const { data: page } = await sanityFetch({
    query: getPageQuery,
    params,
    // Metadata should never contain stega
    stega: false,
  });

  return {
    title: page?.name,
    description: page?.heading,
  } satisfies Metadata;
}

export default async function Page(props: Props) {
  const params = await props.params;
  const [{ data: page }, { data: localities }] = await Promise.all([
    sanityFetch({ query: getPageQuery, params }),
    sanityFetch({ query: localitiesQuery }),
  ]);

  if (!page?._id) {
    return (
      <div className="py-40">
        <h1>No page found</h1>
      </div>
    );
  }

  console.log('Page data:', {
    rawSelectedLocality: page.rawSelectedLocality,
    selectedLocality: page.selectedLocality,
    pageId: page._id,
    localities,
    localitiesCount: localities?.length
  });

  return (
    <div className="px-1 mx-auto">
      <PageBuilderPage page={page as GetPageQueryResult} localities={localities} />
    </div>
  );
}
