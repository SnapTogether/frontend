"use client";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import loadingAnimation from "@/../public/loading.json";

export default function PageTransition({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full bg-white flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <Lottie animationData={loadingAnimation} loop className="w-32 h-32" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
