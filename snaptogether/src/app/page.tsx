"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ConfettiBackground from "@/components/ConfettiBackground/FireworksBackground";
import Button from "@/components/Button/Button";
import Navbar from "@/components/Navbar/Navbar";
import { PartyPopper } from "lucide-react";
import PageTransition from "@/components/PageTransition/PageTransition";
import FireworksBackground from "@/components/ConfettiBackground/FireworksBackground";

export default function Home() {
  const router = useRouter();
  const [transitioning, setTransitioning] = useState(false);

  const handleNavigation = () => {
    setTransitioning(true); // Start transition
    setTimeout(() => {
      router.push("/form");
    }, 1000); // ✅ Ensure at least 2 seconds before navigating
  };

  return (
    <div className="relative h-screen w-screen gradient-background">
      <Navbar />
      {/* Centered Content */}
      <div className="absolute flex flex-col gap-6 items-center justify-center h-fit top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="logo font-rubik text-white font-bold text-[40px] sm:text-[46px] rounded-md m-0 text-center">
          Snaptogether
        </div>
        <p className="font-mulish text-slate-200 text-lg rounded-md m-0 text-center">
          Every moment matters. Snap your event memories effortlessly with{" "}
          <b>
            <i>SnapTogether</i>
          </b>.
        </p>
        <Button variant="primary" iconRight={<PartyPopper size={20} />} onClick={handleNavigation}>
          Get Started
        </Button>
      </div>
      {/* Background Particles */}
      <FireworksBackground  />

      {/* ✅ Loading animation with at least 2 seconds duration */}
      {transitioning && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center">
          <PageTransition />
        </div>
      )}
    </div>
  );
}
