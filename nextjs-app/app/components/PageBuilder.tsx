"use client";

import { SanityDocument } from "next-sanity";
import { useOptimistic } from "next-sanity/hooks";
import Link from "next/link";

import BlockRenderer from "@/app/components/BlockRenderer";
import { GetPageQueryResult } from "@/sanity.types";
import { dataAttr } from "@/sanity/lib/utils";
import { studioUrl } from "@/sanity/lib/api";
import { LocalityProvider } from "@/app/contexts/LocalityContext";

type PageBuilderPageProps = {
  page: GetPageQueryResult;
  localities?: Array<{
    _id: string;
    counties: string;
    fips: string;
    opioidMetrics: {
      totalPerCapita: number;
      totalTotal: number;
      laborPerCapita: number;
      laborTotal: number;
      healthcarePerCapita: number;
      healthcareTotal: number;
      crimeOtherPerCapita: number;
      crimeOtherTotal: number;
      householdPerCapita: number;
      householdTotal: number;
      totalTotalPercentile: number;
      totalTotalComparison: string;
      totalPerCapitaPercentile: number;
      totalPerCapitaComparison: string;
    };
  }>;
};

type PageBuilderSection = {
  _key: string;
  _type: string;
};

type PageData = {
  _id: string;
  _type: string;
  pageBuilder?: PageBuilderSection[];
};

/**
 * The PageBuilder component is used to render the blocks from the `pageBuilder` field in the Page type in your Sanity Studio.
 */

function renderEmptyState(page: GetPageQueryResult) {
  if (!page) {
    return null;
  }
  return (
    <div className="container">
      <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
        This page has no content!
      </h1>
      <p className="mt-2 text-base text-gray-500">
        Open the page in Sanity Studio to add content.
      </p>
      <div className="mt-10 flex">
        <Link
          className="rounded-full flex gap-2 mr-6 items-center bg-black hover:bg-red-500 focus:bg-cyan-500 py-3 px-6 text-white transition-colors duration-200"
          href={`${studioUrl}/structure/intent/edit/template=page;type=page;path=pageBuilder;id=${page._id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Add content to this page
        </Link>
      </div>
    </div>
  );
}

export default function PageBuilder({ page, localities }: PageBuilderPageProps) {

  const pageBuilderSections = useOptimistic<
    PageBuilderSection[] | undefined,
    SanityDocument<PageData>
  >(page?.pageBuilder || [], (currentSections, action) => {
    // The action contains updated document data from Sanity
    // when someone makes an edit in the Studio

    // If the edit was to a different document, ignore it
    if (action.id !== page?._id) {
      return currentSections;
    }

    // If there are sections in the updated document, use them
    if (action.document.pageBuilder) {
      // Reconcile References. https://www.sanity.io/docs/enabling-drag-and-drop#ffe728eea8c1
      return action.document.pageBuilder.map(
        (section) =>
          currentSections?.find((s) => s._key === section?._key) || section,
      );
    }

    // Otherwise keep the current sections
    return currentSections;
  });

  if (!page) {
    return renderEmptyState(page);
  }

  if (!pageBuilderSections || pageBuilderSections.length === 0) {
    return renderEmptyState(page);
  }

  return (
    <LocalityProvider initialLocality={page.selectedLocality}>
      <div
        data-sanity={dataAttr({
          id: page._id,
          type: page._type,
          path: `pageBuilder`,
        }).toString()}
      >
        {pageBuilderSections.map((block: any, index: number) => (
          <BlockRenderer
            key={block._key}
            index={index}
            block={block}
            pageId={page._id}
            pageType={page._type}
            localities={localities}
          />
        ))}
      </div>
    </LocalityProvider>
  );
}
