"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import {useTranslations} from 'next-intl';
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import Logo from "../../../public/snaptogether-logo.png";
import Image from "next/image";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // ✅ Detect Scroll Direction
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setIsScrollingUp(false); // Hide Navbar when scrolling down
      } else {
        setIsScrollingUp(true); // Show Navbar when scrolling up
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const t = useTranslations('nav');

  return (
    <div className="w-full h-full max-h-[10vh]">
      <nav
        className={`container mx-auto border-b border-white/20 fixed top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/ w-full p-4 z-50 transition-transform duration-300 ${
          isScrollingUp ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex flex-row md:flex-row-reverse md:gap-12 items-center justify-center">
          {/* ✅ Desktop Nav */}
          <ul className="hidden md:flex space-x-6 text-lg gap-8 mb-0">
            <li>
              <Link href="/" className="text-white hover:text-gray-300 transition">
                {t('home')}
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-white hover:text-gray-300 transition">
                {t('about')}
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="text-white hover:text-gray-300 transition">
                {t('pricing')}
              </Link>
            </li>
            <li>
              <Link href="/help" className="text-white hover:text-gray-300 transition">
                {t('help')}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-white hover:text-gray-300 transition">
                {t('contact')}
              </Link>
            </li>
          </ul>
          <Link href="/">
            <Image src={Logo} alt="logo" width={32} />
          </Link>
          {/* ✅ Mobile Menu Button */}
          <button
            className="md:hidden p-2 ml-auto"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            {isOpen ? <X size={28} className="text-white" /> : <Menu size={28} className="text-white" />}
          </button>
        </div>

        {/* ✅ Mobile Nav with Slide Down Animation */}
        <div
            className={`md:hidden h-[100vh] bg-slate-900/60 backdrop-blur-3xl absolute top-0 right-0 w-full flex flex-col items-center space-y-4 py-4 transition-all duration-300 transform 
              before:content-[''] before:absolute before:top-0 before:left-full before:w-screen before:h-full before:bg-slate-900/60 before:backdrop-blur-3xl
              after:content-[''] after:absolute after:top-0 after:right-full after:w-screen after:h-full after:bg-slate-900/60 after:backdrop-blur-3xl
              ${isOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"}`}
          >
          <section className="w-full px-4 flex flex-row sm:flex-row items-center justify-between">
            <Link href="/" className="text-white hover:text-gray-300">
              <Image src={Logo} alt="logo" width={32} />
            </Link>
            <button
              className="md:hidden p-2 ml-auto"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle Menu"
            >
              {isOpen ? <X size={28} className="text-white" /> : <Menu size={28} className="text-white" />}
            </button>
          </section>
          <ul className="flex flex-col items-center justify-start gap-3 h-full text-white space-y-4 p-0">
            <li>
              <Link
                href="/"
                className="text-white hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                {t('home')}
              </Link>
            </li>
            <li>
              <Link
                href="/about"
                className="text-white hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                {t('about')}
              </Link>
            </li>
            <li>
              <Link
                href="/pricing"
                className="text-white hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                {t('pricing')}
              </Link>
            </li>
            <li>
              <Link
                href="/help"
                className="text-white hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                {t('help')}
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-white hover:text-gray-300"
                onClick={() => setIsOpen(false)}
              >
                {t('contact')}
              </Link>
            </li>
            <li>
              <LanguageSwitcher/>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
}
