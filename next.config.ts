import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  // pdfjs-dist resolves its worker script relative to its own file on disk;
  // bundling it breaks that resolution (see PdfjsTextExtractorAdapter).
  serverExternalPackages: ["pdfjs-dist"],
};

export default nextConfig;
