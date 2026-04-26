import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";

// Ensure `.env.local` is merged into `process.env` for the Node process (helps API routes
// that read `SUPABASE_SERVICE_ROLE_KEY` in some dev / bundling paths).
loadEnvConfig(process.cwd());

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
