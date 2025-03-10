"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // X icon for closing menu
import Link from "next/link";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex flex-col sm:flex-row items-center justify-center fixed top-0 left-0 w-full bg-white/5 backdrop-blur-md p-3 z-50">
      {/* ✅ Desktop Nav */}
      <ul className="hidden md:flex space-x-6 text-lg gap-8 mb-0">
        <li>
          <Link href="/" className="text-white hover:text-gray-300 transition">
            Home
          </Link>
          <Link href="/about" className="text-white hover:text-gray-300 transition">
            About Us
          </Link>
        </li>
        <li>
          <Link href="/pricing" className="text-white hover:text-gray-300 transition">
            Pricing
          </Link>
        </li>
        <li>
          <Link href="/help" className="text-white hover:text-gray-300 transition">
            Help
          </Link>
        </li>
        <li>
          <a href="/contact" className="text-white hover:text-gray-300 transition">
            Contact
          </a>
        </li>
      </ul>

      {/* ✅ Mobile Menu Button */}
      <button
        className="md:hidden p-2"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle Menu"
      >
        {isOpen ? <X size={28} className="text-white" /> : <Menu size={28} className="text-white" />}
      </button>

      {/* ✅ Mobile Nav with Slide Down Animation */}
      <div
        className={`md:hidden bg-white/5 backdrop-blur-md absolute top-full left-0 w-full flex flex-col items-center space-y-4 py-4 transition-all duration-300 transform ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0 pointer-events-none"
        }`}
      >
        <ul className="flex flex-col items-center text-white space-y-4 p-0">
          <li>
            <Link
              href="/about"
              className="text-white hover:text-gray-300"
              onClick={() => setIsOpen(false)}
            >
              About Us
            </Link>
          </li>
          <li>
            <Link
              href="/pricing"
              className="text-white hover:text-gray-300"
              onClick={() => setIsOpen(false)}
            >
              Pricing
            </Link>
          </li>
          <li>
            <Link
              href="/help"
              className="text-white hover:text-gray-300"
              onClick={() => setIsOpen(false)}
            >
              Help
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="text-white hover:text-gray-300"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
