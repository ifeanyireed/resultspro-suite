"use client";

import Navbar from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-navy">
      <Navbar />
      <main className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8">About ClassroomPRO</h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              ClassroomPRO is a school-focused learning management platform built to bridge the gap between 
              traditional classroom learning and modern digital tools. Our mission is to empower 
              schools, teachers, and students with high-quality digital content and interactive 
              learning experiences.
            </p>
            
            <div className="grid md:grid-cols-2 gap-12 mt-16">
              <div>
                <h2 className="text-2xl font-bold text-green mb-4">Our Vision</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We envision a world where every student has access to organized, high-quality 
                  learning materials that help them master their curriculum and excel academically.
                </p>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-blue mb-4">Our Mission</h2>
                <p className="text-muted-foreground leading-relaxed">
                  To provide a seamless, integrated ecosystem for content creation, study, and 
                  assessment that works for both online and offline environments.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
