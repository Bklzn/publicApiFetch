import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/publicApiFetch",
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
};

export default nextConfig;
