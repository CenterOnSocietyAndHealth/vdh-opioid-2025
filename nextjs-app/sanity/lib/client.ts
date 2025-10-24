import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, studioUrl } from "@/sanity/lib/api";

// Client without stega for most queries
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Temporarily disable CDN to get fresh data
  perspective: "published",
  token: process.env.SANITY_API_READ_TOKEN, // Required if you have a private dataset
  stega: false, // Disable stega by default to prevent decoding errors
});

// Client with stega for visual editing (use sparingly)
export const stegaClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
  token: process.env.SANITY_API_READ_TOKEN,
  stega: {
    studioUrl,
    logger: console,
    filter: (props) => {
      // Only apply stega to specific fields to avoid conflicts
      if (props.sourcePath.at(-1) === "title") {
        return true;
      }
      return false;
    },
  },
});
