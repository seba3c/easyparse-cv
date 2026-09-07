import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  // pdfjs-dist resolves its worker script relative to its own file on disk;
  // bundling it breaks that resolution (see PdfjsTextExtractorAdapter).
  serverExternalPackages: ["pdfjs-dist"],
  // pdfjs-dist resolves its worker file dynamically at runtime, so Vercel's
  // file tracer misses it and drops it from the deployed function, causing
  // "Cannot find module .../pdf.worker.mjs" in production. Force-include it.
  outputFileTracingIncludes: {
    "/api/parse-cv/**": ["./node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs"],
  },
};

export default nextConfig;
