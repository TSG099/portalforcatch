import type { NextConfig } from "next";
import path from "path";

const appRoot = path.resolve(process.cwd());

const nextConfig: NextConfig = {
  // Parent repo also has package-lock.json; pin Turbopack to this package.
  turbopack: {
    root: appRoot,
  },
  outputFileTracingRoot: appRoot,
};

export default nextConfig;
