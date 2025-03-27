'use client';

import { useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import { faqItems } from "@/utils/faqItems";
import { useTranslations } from 'next-intl';
import { ChevronDown } from "lucide-react";

export default function HelpPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const t = useTranslations();

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#2e2e2e] text-white">
      <Navbar />

      <div className="pt-[10vh] container mx-auto md:max-w-[50vw] px-4">
        <h1 className="text-3xl pt-[10vh] md:pt-0 font-bold text-center mb-8 text-white">
          {t("helpPage.title", { defaultValue: "How can we help you?" })}
        </h1>

        <div className="space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="border border-slate-300 rounded-lg overflow-hidden transition-all duration-300 bg-white/10 backdrop-blur"
              >
                <button
                  onClick={() => toggleIndex(index)}
                  className="w-full text-lg text-left px-4 py-3 font-semibold focus:outline-none flex justify-between items-center text-white"
                >
                  {t(item.questionKey)}
                  <span
                    className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  >
                    <ChevronDown size={20} />
                  </span>
                </button>

                <div
                  className={`px-4 overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-96 py-2" : "max-h-0"
                  }`}
                >
                  <p className="text-white/90 text-md">{t(item.answerKey)}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center pb-6">
          <p className="text-lg font-medium">{t("helpPage.contactPrompt", { defaultValue: "Still need help?" })}</p>
          <a href="mailto:support@snaptogether.app" className="text-blue-400 underline">
            {t("helpPage.contactEmail", { defaultValue: "Contact us at snaptogether25@gmail.com" })}
          </a>
        </div>
      </div>
    </div>
  );
}
