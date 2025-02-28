"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import loadingAnimation from "@/../public/loading.json";
import { motion, AnimatePresence } from "framer-motion";

export default function PageTransition() {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    const timeout = setTimeout(() => setShow(false), 3000); // ✅ Keep animation visible for 2 seconds
    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed top-0 left-0 w-full h-full bg-white flex items-center justify-center z-50"
          initial={{ opacity: 0 }} // ✅ Fade in
          animate={{ opacity: 1 }} // ✅ Fully visible
          exit={{ opacity: 0 }} // ✅ Fade out
          transition={{ duration: 0.5, ease: "easeInOut" }} // ✅ Smooth transition
        >
          <Lottie animationData={loadingAnimation} loop className="w-32 h-32" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
