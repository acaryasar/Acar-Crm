import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin();

const securityHeaders = [
  // Prevent this app from being embedded in a hidden <iframe> elsewhere
  // (clickjacking protection).
  { key: "X-Frame-Options", value: "DENY" },
  // Stop the browser from guessing content types away from what the
  // server declared.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Don't leak the full referring URL to other origins.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Force HTTPS for a year once a browser has seen it over HTTPS.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  // Disable powerful browser features this app doesn't use.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
