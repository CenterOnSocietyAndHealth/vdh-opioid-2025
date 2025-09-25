import PageBuilderPage from "@/app/components/PageBuilder";
import { sanityFetch } from "@/sanity/lib/live";
import { getPageQuery, localitiesQuery } from "@/sanity/lib/queries";
import { GetPageQueryResult } from "@/sanity.types";

export default async function Page() {
  const [{ data: page }, { data: localities }] = await Promise.all([
    sanityFetch({ query: getPageQuery, params: { slug: 'home' } }),
    sanityFetch({ query: localitiesQuery }),
  ]);

  if (!page?._id) {
    return (
      <div className="py-40">
        <h1>No page found</h1>
      </div>
    );
  }

  console.log('Home page data:', {
    pageId: page._id,
    localities,
    localitiesCount: localities?.length
  });

  return (
    <div className="mx-auto px-1">
      <PageBuilderPage page={page as GetPageQueryResult} localities={localities} />
    </div>
  );
}
