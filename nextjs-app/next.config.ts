import type { NextConfig } from "next";

// Sanity Presentation embeds this app in an iframe from *.sanity.studio.
// CSP `frame-ancestors` overrides `X-Frame-Options: deny` from upstream (per CSP spec).
const SANITY_STUDIO_FRAME_ANCESTORS = [
  "'self'",
  "https://vdh-opioid-staging-2026.sanity.studio",
  "https://vdh-opioid.sanity.studio",
  "http://localhost:3333",
  "https://localhost:3333",
];

const nextConfig: NextConfig = {
  env: {
    // Matches the behavior of `sanity dev` which sets styled-components to use the fastest way of inserting CSS rules in both dev and production. It's default behavior is to disable it in dev mode.
    SC_DISABLE_SPEEDY: "false",
  },
  images: {
    domains: ["cdn.sanity.io"],
  },
  async headers() {
    const extra = (process.env.ADDITIONAL_FRAME_ANCESTORS ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const frameAncestors = [...SANITY_STUDIO_FRAME_ANCESTORS, ...extra].join(" ");
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors ${frameAncestors}`,
          },
        ],
      },
    ];
  },
};

export default nextConfig;
