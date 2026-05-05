"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

type BackgroundMusicProps = {
  isOpen: boolean;
  src: string;
};

export default function BackgroundMusic({ isOpen, src }: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const maxVolume = 0.5;

  const clearFadeInterval = () => {
    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = 0;
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    clearFadeInterval();

    if (!isOpen || isMuted) {
      const fadeOutStep = 0.05;
      fadeIntervalRef.current = setInterval(() => {
        const next = Math.max(0, audio.volume - fadeOutStep);
        audio.volume = next;
        if (next <= 0) {
          clearFadeInterval();
          audio.pause();
        }
      }, 100);
      return;
    }

    if (audio.paused) {
      audio.volume = 0;
    }

    const playPromise = audio.play();
    if (playPromise) {
      playPromise.catch(() => {
        // Autoplay may be blocked until user interaction.
      });
    }

    const targetVolume = maxVolume;
    const step = 0.05;
    fadeIntervalRef.current = setInterval(() => {
      const next = Math.min(targetVolume, audio.volume + step);
      audio.volume = next;
      if (next >= targetVolume) clearFadeInterval();
    }, 100);

    return () => clearFadeInterval();
  }, [isOpen, isMuted]);

  useEffect(() => {
    return () => clearFadeInterval();
  }, []);

  const toggleMusic = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <>
      <audio ref={audioRef} src={src} preload="auto" loop />
      {isOpen && (
        <button
          type="button"
          onClick={toggleMusic}
          className="fixed right-3 top-14 z-[95] flex h-9 w-9 items-center justify-center rounded-full bg-[#fbf7ef]/80 text-[#5f866b] shadow-[0_3px_10px_rgba(0,0,0,0.12)]"
          aria-label={isMuted ? "Unmute background music" : "Mute background music"}
        >
          {!isMuted ? <Volume2 className="h-4 w-4" strokeWidth={1.8} /> : <VolumeX className="h-4 w-4" strokeWidth={1.8} />}
        </button>
      )}
    </>
  );
}
