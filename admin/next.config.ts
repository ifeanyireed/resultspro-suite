import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@resultspro/design-system"],
  env: {
    NEXT_PUBLIC_USERS_API: process.env.NEXT_PUBLIC_USERS_API || "http://localhost:7000",
    NEXT_PUBLIC_RESULTS_API: process.env.NEXT_PUBLIC_RESULTS_API || "http://localhost:5000",
    NEXT_PUBLIC_EXAMS_API: process.env.NEXT_PUBLIC_EXAMS_API || "http://localhost:8080",
    NEXT_PUBLIC_CLASSROOM_API: process.env.NEXT_PUBLIC_CLASSROOM_API || "http://localhost:8080",
    NEXT_PUBLIC_TUTORS_API: process.env.NEXT_PUBLIC_TUTORS_API || "http://localhost:8080",
  },
};

export default nextConfig;
