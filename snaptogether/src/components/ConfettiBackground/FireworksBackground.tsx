"use client";

import { useEffect, useRef } from "react";
import { Fireworks } from "fireworks-js";

export default function FireworksBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fireworksInstance = useRef<Fireworks | null>(null);

  useEffect(() => {
    if (typeof document !== "undefined") {
      // ✅ Now it's safe to use document
    }
  }, []);
  
  useEffect(() => {
    if (containerRef.current) {
      // Initialize fireworks
      fireworksInstance.current = new Fireworks(containerRef.current, {
        acceleration: 1.05,
        friction: 0.97,
        gravity: 1.5,
        particles: 50,
        explosion: 5,
        intensity: 5,
        flickering: 50,
        lineWidth: {
          explosion: { min: 1, max: 4 },
          trace: { min: 1, max: 2 },
        },
        hue: {
          min: 0,
          max: 60,
        },
        delay: {
          min: 30,
          max: 60,
        },
        opacity:0.5,
        traceSpeed: 0.5,
      });

      // Start fireworks
      fireworksInstance.current.start();
    }

  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    />
  );
}
