import PageBuilderPage from "@/app/components/PageBuilder";
import { fetchPage } from "@/sanity/lib/server";
import { GetPageQueryResult } from "@/sanity.types";

export default async function Page() {
  const page = await fetchPage('home');

  if (!page?._id) {
    return (
      <div className="py-40">
        <h1>No page found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <PageBuilderPage page={page as GetPageQueryResult} />
    </div>
  );
}
