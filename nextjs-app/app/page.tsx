import PageBuilderPage from "@/app/components/PageBuilder";
import { fetchPage } from "@/sanity/lib/server";
import { GetPageQueryResult } from "@/sanity.types";

export default async function Page() {
  const { data: page, localities } = await fetchPage('home');

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
    <div className="max-w-[1288px] mx-auto px-1">
      <PageBuilderPage page={page as GetPageQueryResult} localities={localities} />
    </div>
  );
}
