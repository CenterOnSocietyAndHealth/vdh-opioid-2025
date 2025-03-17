import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "./api";

// Create a server-side only client
export const serverClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
  token: process.env.SANITY_API_READ_TOKEN,
});

// Helper function to fetch data server-side
export async function fetchPage(slug: string) {
  return serverClient.fetch(
    `*[_type == 'page' && slug.current == $slug][0]{
      _id,
      _type,
      name,
      slug,
      heading,
      subheading,
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
  );
} 