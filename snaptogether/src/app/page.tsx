"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Button from "@/components/Button/Button";
import Navbar from "@/components/Navbar/Navbar";
import { PartyPopper } from "lucide-react";
import PageTransition from "@/components/PageTransition/PageTransition";
import FireworksBackground from "@/components/ConfettiBackground/FireworksBackground";
import Image from "next/image";
import Logo from "../../public/snaptogether-logo.png";

export default function Home() {
  const router = useRouter();
  const pathname = usePathname(); // ✅ Detects when route changes
  const [transitioning, setTransitioning] = useState(false);

  const handleNavigation = () => {
    setTransitioning(true); // ✅ Start transition
    router.push("/form"); // ✅ Navigate to /form
  };

  // ✅ End transition when the pathname updates to `/form`
  useEffect(() => {
    if (pathname === "/form") {
      setTransitioning(false);
    }
  }, [pathname]);

  return (
    <div className="relative h-screen w-screen home-background">
      <Navbar />
      {/* Centered Content */}
      <div className="absolute flex flex-col gap-3 items-center justify-center h-fit top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="logo flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <Image src={Logo} alt="logo" width={150} />
          <motion.h1
            className="logo-footer select-none text-center text-white text-[40px] sm:text-[46px] rounded-md m-0 bg-gradient-to-b from-white to-[#68838C] bg-clip-text text-transparent"
            style={{ fontFamily: "var(--font-gochi-hand)" }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Snaptogether
          </motion.h1>
        </motion.div>

        <motion.p
          className="font-mulish text-slate-200 text-lg rounded-md m-0 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          Every moment matters. Snap your event memories effortlessly with{" "}
          <b>
            <i>SnapTogether</i>
          </b>.
        </motion.p>

        <Button
          variant="primary"
          className="!bg-[rgba(120,128,181,0.4)]"
          iconRight={<PartyPopper size={20} />}
          onClick={handleNavigation}
        >
          Get Started
        </Button>
      </div>
      {/* Background Particles */}
      <FireworksBackground />

      {/* ✅ Show transition until `/form` is fully loaded */}
      {transitioning && <PageTransition show={transitioning} />}
    </div>
  );
}
