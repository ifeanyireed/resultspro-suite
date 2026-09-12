import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_USERS_API: process.env.NEXT_PUBLIC_USERS_API || "https://resultsproserviceusers.vercel.app",
    NEXT_PUBLIC_RESULTS_API: process.env.NEXT_PUBLIC_RESULTS_API || "https://resultspro-service-resultspro.onrender.com",
    NEXT_PUBLIC_EXAMS_API: process.env.NEXT_PUBLIC_EXAMS_API || "https://resultspro-service-examspro.vercel.app",
    NEXT_PUBLIC_CLASSROOM_API: process.env.NEXT_PUBLIC_CLASSROOM_API || "https://resultspro-service-classroompro.onrender.com",
    NEXT_PUBLIC_TUTORS_API: process.env.NEXT_PUBLIC_TUTORS_API || "https://resultspro-service-tutorspro.onrender.com",
    NEXT_PUBLIC_COURSES_API: process.env.NEXT_PUBLIC_COURSES_API || "https://resultspro-service-coursespro.onrender.com",
  },
};

export default nextConfig;
