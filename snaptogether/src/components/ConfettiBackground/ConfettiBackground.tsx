"use client";

import { useState, useEffect, useCallback } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type Container, type ISourceOptions } from "@tsparticles/engine";
import { loadConfettiPreset } from "@tsparticles/preset-confetti";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles

export default function ConfettiBackground() {
  const [init, setInit] = useState(false);
  const [effectType, setEffectType] = useState<"bottom" | "explosions" | "side" | "falling" | "single">("bottom"); // ✅ Explicitly typed effectType

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadConfettiPreset(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // ✅ Fix 1: `particlesLoaded` must return a Promise<void>
  const particlesLoaded = useCallback(async (container?: Container): Promise<void> => {
    console.log("Confetti Loaded!", container);
  }, []);

  // ✅ Fix 2: Explicitly define a type-safe confetti configuration object
  const confettiConfigs: Record<"bottom" | "explosions" | "side" | "falling" | "single", ISourceOptions> = {
    bottom: {
      preset: "confetti",
      emitters: {
        position: { x: 50, y: 98 },
        rate: { quantity: 5, delay: 0.15 },
      },
    },
    explosions: {
      preset: "confetti",
      emitters: {
        position: { x: 50, y: 50 },
        life: { duration: 0.5, count: 3 },
      },
    },
    side: {
      preset: "confetti",
      emitters: [
        { direction: "right", position: { x: 0, y: 50 } },
        { direction: "left", position: { x: 100, y: 50 } },
      ],
    },
    falling: {
      preset: "confetti",
      emitters: { position: { x: 50, y: 0 }, rate: { quantity: 10, delay: 0.2 } },
    },
    single: {
      preset: "confetti",
      emitters: { position: { x: 50, y: 50 }, rate: { quantity: 1, delay: 1 } },
    },
  };

  if (!init) return null;

  return (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 0, // Push behind other content
            pointerEvents: "none", // Ensure clicks pass through
          }}
        >
          <Particles id="tsparticles" particlesLoaded={particlesLoaded} options={confettiConfigs[effectType]} />
        </div>
      );
}
