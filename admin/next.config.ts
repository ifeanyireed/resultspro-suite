import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@resultspro/design-system"],
  env: {
    NEXT_PUBLIC_USERS_API: process.env.NEXT_PUBLIC_USERS_API || "https://resultspro-service-users.onrender.com",
    NEXT_PUBLIC_RESULTS_API: process.env.NEXT_PUBLIC_RESULTS_API || "https://resultspro-service-resultspro.onrender.com",
    NEXT_PUBLIC_EXAMS_API: process.env.NEXT_PUBLIC_EXAMS_API || "https://resultspro-service-examspro.onrender.com",
    NEXT_PUBLIC_CLASSROOM_API: process.env.NEXT_PUBLIC_CLASSROOM_API || "https://resultspro-service-classroompro.onrender.com",
    NEXT_PUBLIC_TUTORS_API: process.env.NEXT_PUBLIC_TUTORS_API || "https://resultspro-service-tutorspro.onrender.com",
    NEXT_PUBLIC_COURSES_API: process.env.NEXT_PUBLIC_COURSES_API || "https://resultspro-service-coursespro.onrender.com",
  },
};

export default nextConfig;
