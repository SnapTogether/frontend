"use client";

import Navbar from "@/components/Navbar/Navbar";
import Footer from "../footer/page";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Mockup from "@/../public/logo/mockup.png";

export default function RefundPolicyPage() {
  const t = useTranslations("refundPage");

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#2e2e2e] text-white">
      <Navbar />

      <div className="mx-auto flex flex-col items-center justify-center text-center gap-10">
        <div className="relative h-[100vh] w-full">
          <Image
            src={Mockup}
            alt="Mockup"
            width={400}
            height={400}
            className="object-cover absolute h-full w-full"
          />
          <motion.div
            className="absolute -translate-x-1/2 bottom-10 flex flex-col gap-5 text-left w-full container px-5 md:px-0 left-1/2"
          >
            <motion.h1
              className="text-3xl font-bold text-white w-full uppercase"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.1, 0.25, 1],
                delay: 0,
              }}
            >
              {t("title")}
            </motion.h1>
          </motion.div>
        </div>

        <div className="container mx-auto text-left pb-[150px] space-y-6 px-4 md:px-0">
          {t.raw("content").split("\n\n").map((paragraph: string, i: number) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
