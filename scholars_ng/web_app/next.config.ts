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
    resolveAlias: {
      "@tabler/icons-react": "./node_modules/@tabler/icons-react",
      "framer-motion": "./node_modules/framer-motion",
      "gsap": "./node_modules/gsap",
      "axios": "./node_modules/axios",
      "zustand": "./node_modules/zustand",
      "@heroicons/react/24/outline": "./node_modules/@heroicons/react/24/outline",
      "@heroicons/react/24/solid": "./node_modules/@heroicons/react/24/solid",
      "@heroicons/react": "./node_modules/@heroicons/react",
      "hugeicons-react": "./node_modules/hugeicons-react",
    },
  },
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
