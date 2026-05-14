import type { NextConfig } from "next";

// Sanity Presentation loads this site in an iframe. The *parent* document origin must
// appear in frame-ancestors (not only your primary Studio hostname). Include:
// - *.sanity.studio (branch / alternate hosted Studios)
// - sanity.io / manage.sanity.io (some flows open Studio or preview from these origins)
// CSP `frame-ancestors` overrides `X-Frame-Options` when both are present (per CSP spec).
const SANITY_STUDIO_FRAME_ANCESTORS = [
  "'self'",
  "https://*.sanity.studio",
  "https://vdh-opioid-staging-2026.sanity.studio",
  "https://vdh-opioid.sanity.studio",
  "https://www.sanity.io",
  "https://sanity.io",
  "https://manage.sanity.io",
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
