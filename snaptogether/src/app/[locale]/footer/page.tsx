"use client";

import { Instagram } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="mt-[180px] absolute bottom-0 w-full border-t border-white/10 py-8 bg-[#1c1c1c] text-white text-sm">
      <div className="max-w-6xl mx-auto px-4 flex flex-col items-center md:flex-row justify-between gap-4">
        {/* Left side: copyright */}
        <p className="text-white/60 text-center md:text-left flex gap-4">
          © {new Date().getFullYear()} SnapTogether. {t("rights")}
                  <a
            href="https://www.instagram.com/snaptogether25"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <Instagram size={24} />
          </a>
        </p>


        {/* Right side: links */}
        <div className="flex flex-col items-center justify-center gap-4 text-white/70">

          <div className="footer-links flex gap-1 text-center">
            <Link href="/privacy" className="hover:text-white transition text-xs">
              {t("privacy")}
            </Link>
            <Link href="/terms" className="hover:text-white transition text-xs">
              {t("terms")}
            </Link>
            <Link href="/contact" className="hover:text-white transition text-xs">
              {t("contact")}
            </Link>
            <Link href="/refund-policy" className="hover:text-white transition text-xs">
              {t("refund")}
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}
