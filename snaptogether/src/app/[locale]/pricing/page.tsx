"use client";

import Navbar from "@/components/Navbar/Navbar";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import Footer from "../footer/page";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.4,
    },
  },
};

const fadeInUpItem = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.2,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};


export default function PricingPage() {
  const t = useTranslations("pricingPage");

  const plans = [
    {
      name: t("plans.free.name"),
      price: "0$",
      features: [
        t("plans.free.features.0"),
        t("plans.free.features.1"),
        t("plans.free.features.2"),
        t("plans.free.features.3"),
      ],
    },
    {
      name: t("plans.starter.name"),
      price: "19.99$",
      features: [
        t("plans.starter.features.0"),
        t("plans.starter.features.1"),
        t("plans.starter.features.2"),
        t("plans.starter.features.3"),
      ],
    },
    {
      name: t("plans.pro.name"),
      price: "59.99$",
      features: [
        t("plans.pro.features.0"),
        t("plans.pro.features.1"),
        t("plans.pro.features.2"),
        t("plans.pro.features.3"),
      ],
    },
  ];
  
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true });

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#2e2e2e] text-white">
      <Navbar />

      <div className="mx-auto pt-[13vh] text-center flex flex-col items-center justify-center gap-10 pb-[150px] px-4">
        <motion.h1
          className="text-3xl font-bold text-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {t("title")}
        </motion.h1>

        <motion.div
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl w-full"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {plans.map((plan, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUpItem}
              className="bg-[#141c25] border border-white/10 rounded-xl p-6 flex flex-col items-center text-center shadow-lg hover:shadow-2xl transition"
            >
              <h2 className="text-2xl font-bold mb-2 text-white">{plan.name}</h2>
              <p className="text-3xl font-extrabold mb-4">{plan.price}</p>
              <ul className="text-sm space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="text-white/80">• {feature}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        <p className="text-sm text-white/60">{t("note")}</p>
      </div>

      <Footer/>
    </div>
  );
}
