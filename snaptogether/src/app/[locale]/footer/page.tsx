"use client";

import { Instagram } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-10 absolute bottom-0 w-full border-t border-white/10 py-8 bg-[#1c1c1c] text-white text-sm">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center md:flex-row justify-between gap-4">
        {/* Left side: copyright */}
        <p className="text-white/60 text-center md:text-left">
          © {new Date().getFullYear()} SnapTogether. All rights reserved.
        </p>

        {/* Right side: links */}
        <div className="flex gap-4 text-white/70">
          <Link href="/privacy" className="hover:text-white transition">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-white transition">
            Terms of Use
          </Link>
          <Link href="/contact" className="hover:text-white transition">
            Contact
          </Link>
          <a
            href="https://www.instagram.com/snaptogether"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <Instagram size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}