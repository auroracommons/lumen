import type { NextConfig } from "next";

const config: NextConfig = {
  reactStrictMode: true,
  // Workspace packages ship as TS source — let Next transpile them.
  transpilePackages: [
    "@lumen/ui",
    "@lumen/liturgy",
    "@lumen/schema",
    "@lumen/i18n",
  ],
  experimental: {
    // We import .ts extensions directly in workspace packages.
    typedRoutes: false,
  },
};

export default config;
