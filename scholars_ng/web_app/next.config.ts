import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@classroompro",
    "@resultspro",
    "@tutorspro",
    "@puzzlepro"
  ],
  turbopack: {
    root: path.resolve(__dirname, "../../"),
  },
};

export default nextConfig;
