import type { NextConfig } from "next";

const csp = [
  "default-src 'self';",
  "script-src 'self';",
  "style-src 'self' 'unsafe-inline';",
  "img-src 'self' data: https://*.supabase.co https://*.googleusercontent.com;",
  "font-src 'self' data:;",
  "connect-src 'self' https://*.supabase.co https://api.openai.com https://accounts.google.com https://*.google.com;",
  "base-uri 'self';",
  "form-action 'self' https://*.supabase.co https://accounts.google.com https://*.google.com;",
  "frame-ancestors 'none';",
].join(" ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
