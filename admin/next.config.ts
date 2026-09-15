import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_USERS_API: process.env.NEXT_PUBLIC_USERS_API || '',
    NEXT_PUBLIC_RESULTS_API: process.env.NEXT_PUBLIC_RESULTS_API || '',
    NEXT_PUBLIC_EXAMS_API: process.env.NEXT_PUBLIC_EXAMS_API || '',
    NEXT_PUBLIC_CLASSROOM_API: process.env.NEXT_PUBLIC_CLASSROOM_API || '',
    NEXT_PUBLIC_TUTORS_API: process.env.NEXT_PUBLIC_TUTORS_API || '',
    NEXT_PUBLIC_COURSES_API: process.env.NEXT_PUBLIC_COURSES_API || '',
  },
};

export default nextConfig;
