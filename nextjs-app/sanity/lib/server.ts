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
  // This function is deprecated and should not be used.
  // Use sanityFetch with getPageQuery and localitiesQuery from queries.ts instead.
  throw new Error('fetchPage is deprecated. Use sanityFetch with getPageQuery and localitiesQuery instead.');
}