"use client";

import { useEffect } from "react";

const siteEnv = process.env.NEXT_PUBLIC_SITE_ENV;
const isStaging = siteEnv === "staging";

export default function StagingEnvironmentIndicator() {
  useEffect(() => {
    if (!isStaging) return;

    console.info(
      "[ENV] STAGING mode active (NEXT_PUBLIC_SITE_ENV=staging, Sanity dataset should be staging-2026).",
    );
  }, []);

  if (!isStaging) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[1000] rounded-full bg-amber-500 px-3 py-1 text-xs font-bold uppercase tracking-wide text-black shadow-lg"
      aria-label="Staging environment indicator"
      title="Staging environment"
    >
      Staging 2026
    </div>
  );
}
