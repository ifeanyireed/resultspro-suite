"use client";

import Link from "next/link";
import Logo from "@/components/Logo";

export function Footer() {
  return (
    <footer className="bg-navy border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2">
            <div className="mb-4">
              <Logo />
            </div>
            <p className="text-muted-foreground max-w-xs">
              The ultimate school-focused learning management platform for notes, quizzes, and flashcards.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="/notes" className="text-muted-foreground hover:text-green text-sm transition-colors">Class Notes</Link></li>
              <li><Link href="/quizzes" className="text-muted-foreground hover:text-green text-sm transition-colors">Quizzes</Link></li>
              <li><Link href="/flashcards" className="text-muted-foreground hover:text-green text-sm transition-colors">Flashcards</Link></li>
              <li><Link href="/exams" className="text-muted-foreground hover:text-green text-sm transition-colors">Exams</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-muted-foreground hover:text-green text-sm transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-green text-sm transition-colors">Contact</Link></li>
              <li><Link href="/pricing" className="text-muted-foreground hover:text-green text-sm transition-colors">Pricing</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-green text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-green text-sm transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} ClassroomPRO. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-muted-foreground hover:text-white transition-colors">Twitter</Link>
            <Link href="#" className="text-muted-foreground hover:text-white transition-colors">Facebook</Link>
            <Link href="#" className="text-muted-foreground hover:text-white transition-colors">Instagram</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
