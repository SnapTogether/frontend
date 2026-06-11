"use client";

import { PointerEvent, useCallback, useEffect, useRef, useState } from "react";
import { Gift, Heart, RotateCcw, Sparkles } from "lucide-react";

type Point = {
  x: number;
  y: number;
};

const confettiPieces = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  left: `${(index * 29) % 100}%`,
  delay: `${(index % 12) * 0.12}s`,
  duration: `${2.4 + (index % 7) * 0.18}s`,
  color: ["#f8c77e", "#f472b6", "#67e8f9", "#fef3c7", "#c4b5fd"][index % 5],
  size: `${7 + (index % 4) * 2}px`,
}));

export default function BirthdayMPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isScratchingRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);
  const progressCheckRef = useRef<number | null>(null);
  const revealedRef = useRef(false);
  const [scratchProgress, setScratchProgress] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const drawScratchCover = useCallback(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, Math.floor(rect.width * dpr));
    canvas.height = Math.max(1, Math.floor(rect.height * dpr));

    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (!ctx) {
      return;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, rect.width, rect.height);

    const coverGradient = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    coverGradient.addColorStop(0, "#f8e0a4");
    coverGradient.addColorStop(0.28, "#b8bdc7");
    coverGradient.addColorStop(0.54, "#fff4cb");
    coverGradient.addColorStop(0.78, "#aab0bd");
    coverGradient.addColorStop(1, "#f5cc74");

    ctx.fillStyle = coverGradient;
    ctx.fillRect(0, 0, rect.width, rect.height);

    ctx.globalAlpha = 0.32;
    for (let y = 0; y < rect.height; y += 14) {
      for (let x = (Math.floor(y / 14) % 2) * 7; x < rect.width; x += 18) {
        ctx.beginPath();
        ctx.arc(x, y, 1.4, 0, Math.PI * 2);
        ctx.fillStyle = "#fff7d8";
        ctx.fill();
      }
    }

    ctx.globalAlpha = 1;
    ctx.fillStyle = "rgba(37, 42, 58, 0.74)";
    ctx.font = "700 18px Mulish, Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Scratch to reveal your surprise", rect.width / 2, rect.height / 2 - 14);

    ctx.font = "600 13px Mulish, Arial, sans-serif";
    ctx.fillStyle = "rgba(37, 42, 58, 0.56)";
    ctx.fillText("Use your finger or mouse", rect.width / 2, rect.height / 2 + 18);
  }, []);

  const calculateProgress = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });

    if (!canvas || !ctx || revealedRef.current) {
      return;
    }

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let transparentPixels = 0;
    let sampledPixels = 0;

    for (let index = 3; index < data.length; index += 32) {
      sampledPixels += 1;

      if (data[index] < 80) {
        transparentPixels += 1;
      }
    }

    const nextProgress = sampledPixels ? Math.round((transparentPixels / sampledPixels) * 100) : 0;
    setScratchProgress(nextProgress);

    if (nextProgress >= 55) {
      revealedRef.current = true;
      setIsRevealed(true);
      setScratchProgress(100);
    }
  }, []);

  const scheduleProgressCheck = useCallback(() => {
    if (progressCheckRef.current !== null) {
      return;
    }

    progressCheckRef.current = window.requestAnimationFrame(() => {
      progressCheckRef.current = null;
      calculateProgress();
    });
  }, [calculateProgress]);

  const scratchAt = useCallback(
    (clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d", { willReadFrequently: true });

      if (!canvas || !ctx) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const point = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
      const previousPoint = lastPointRef.current ?? point;
      const brushRadius = Math.max(22, Math.min(rect.width, rect.height) * 0.075);

      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = brushRadius * 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(previousPoint.x, previousPoint.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(point.x, point.y, brushRadius, 0, Math.PI * 2);
      ctx.fill();

      lastPointRef.current = point;
      scheduleProgressCheck();
    },
    [scheduleProgressCheck],
  );

  const handlePointerDown = (event: PointerEvent<HTMLCanvasElement>) => {
    if (revealedRef.current) {
      return;
    }

    isScratchingRef.current = true;
    lastPointRef.current = null;
    event.currentTarget.setPointerCapture(event.pointerId);
    scratchAt(event.clientX, event.clientY);
  };

  const handlePointerMove = (event: PointerEvent<HTMLCanvasElement>) => {
    if (!isScratchingRef.current || revealedRef.current) {
      return;
    }

    scratchAt(event.clientX, event.clientY);
  };

  const handlePointerEnd = (event: PointerEvent<HTMLCanvasElement>) => {
    isScratchingRef.current = false;
    lastPointRef.current = null;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    calculateProgress();
  };

  const resetScratchCard = () => {
    revealedRef.current = false;
    setIsRevealed(false);
    setScratchProgress(0);
    window.requestAnimationFrame(drawScratchCover);
  };

  useEffect(() => {
    revealedRef.current = isRevealed;
  }, [isRevealed]);

  useEffect(() => {
    drawScratchCover();

    const handleResize = () => {
      if (!revealedRef.current) {
        drawScratchCover();
        setScratchProgress(0);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      if (progressCheckRef.current !== null) {
        window.cancelAnimationFrame(progressCheckRef.current);
      }
    };
  }, [drawScratchCover]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#10131f] text-white">
      <div className="relative flex min-h-screen items-start justify-center px-4 py-5 sm:items-center sm:px-6 sm:py-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(248,199,126,0.18),transparent_32%),linear-gradient(135deg,#10131f_0%,#182033_42%,#2d1f2e_100%)]" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#f8c77e]/18 to-transparent" />

        {isRevealed && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            {confettiPieces.map((piece) => (
              <span
                key={piece.id}
                className="absolute top-[-24px] animate-[birthdayConfettiFall_var(--duration)_linear_var(--delay)_infinite]"
                style={{
                  left: piece.left,
                  width: piece.size,
                  height: piece.size,
                  backgroundColor: piece.color,
                  animationDelay: piece.delay,
                  animationDuration: piece.duration,
                  transform: `rotate(${piece.id * 17}deg)`,
                }}
              />
            ))}
          </div>
        )}

        <section className="relative z-10 grid w-full max-w-5xl items-center gap-5 sm:gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="text-center lg:text-left">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#f8c77e]/35 bg-white/8 px-3 py-1.5 text-xs font-semibold text-[#f8d99a] shadow-[0_10px_40px_rgba(0,0,0,0.18)] backdrop-blur sm:mb-4 sm:px-4 sm:py-2 sm:text-sm">
              <Gift size={16} aria-hidden="true" />
              Birthday surprise for M
            </div>

            <div
              className="text-3xl font-black leading-[1.05] text-white min-[390px]:text-4xl sm:text-5xl lg:text-6xl"
              aria-label="Scratch the card"
            >
              Scratch the card
              <span className="block text-[#f8c77e]">and open the moment.</span>
            </div>

            <div className="mt-4 flex items-center justify-center gap-3 sm:mt-6 lg:justify-start">
              <div className="h-2 w-36 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-[#f8c77e] transition-all duration-300"
                  style={{ width: `${scratchProgress}%` }}
                />
              </div>
              <span className="w-12 text-left text-sm font-semibold text-slate-200">{scratchProgress}%</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[560px]">
            <div className="absolute -inset-1 rounded-[22px] bg-gradient-to-br from-[#f8c77e] via-[#f472b6] to-[#67e8f9] opacity-65 blur-xl sm:rounded-[28px]" />
            <div className="relative overflow-hidden rounded-[20px] border border-white/18 bg-[#171b2a]/92 p-3 shadow-2xl backdrop-blur sm:rounded-[26px] sm:p-5">
              <div className="relative aspect-[4/5] min-h-[350px] overflow-hidden rounded-2xl border border-white/16 bg-gradient-to-br from-[#fff8e8] via-[#ffe3ee] to-[#def7ff] text-[#221827] shadow-inner min-[390px]:min-h-[390px] sm:aspect-[5/4] sm:min-h-[420px] sm:rounded-[20px]">
                <div className="absolute inset-0 opacity-80 [background-image:linear-gradient(rgba(34,24,39,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(34,24,39,0.045)_1px,transparent_1px)] [background-size:26px_26px]" />

                <div className="relative flex h-full flex-col justify-between p-4 sm:p-8">
                  <div className="flex items-center justify-between text-[#7a475c]">
                    <Sparkles size={20} aria-hidden="true" />
                    <span className="rounded-full bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-[#7a475c] sm:text-xs sm:tracking-[0.18em]">
                      08.07.2026
                    </span>
                    <Heart size={20} fill="currentColor" aria-hidden="true" />
                  </div>

                  <div className="mx-auto max-w-md text-center">
                    <div className="font-[var(--font-fleur-de-leah)] text-3xl leading-none text-[#9a2f58] min-[390px]:text-5xl sm:text-7xl">
                      Happy Birthday
                    </div>
                    <div className="mt-1 text-3xl font-semibold text-[#403c42] sm:mt-2 sm:text-5xl">Mineta !</div>
                    <p className="mt-3 text-xs leading-5 text-[#443344] sm:mt-5 sm:text-base sm:leading-7">
                      I hope this day gives back even a little of the warmth, loyalty, and love you give to the people around you.
                      You are one of a kind person who fills my heart with pure love even on the darkest and unhopeful days.
                    </p>
                    <p className="mt-2 text-xs font-semibold leading-5 text-[#6f3952] sm:mt-4 sm:text-base sm:leading-7">
                      Wishing you more laughter, healing days, bigger dreams, and all the happines and love you deserve.
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-center text-[11px] font-bold text-[#7a475c] sm:text-sm">
                    <span className="h-px w-6 bg-[#7a475c]/30 sm:w-10" />
                    From someone grateful to know you and thinks about you on your birthday and every day.
                    <span className="h-px w-6 bg-[#7a475c]/30 sm:w-10" />
                  </div>
                </div>

                <canvas
                  ref={canvasRef}
                  className={`absolute inset-0 h-full w-full touch-none transition-opacity duration-700 ${
                    isRevealed ? "pointer-events-none opacity-0" : "cursor-crosshair opacity-100"
                  }`}
                  aria-label="Scratch layer hiding the birthday message"
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerEnd}
                  onPointerCancel={handlePointerEnd}
                  onPointerLeave={handlePointerEnd}
                />
              </div>

              <div className="mt-3 flex flex-col items-center justify-between gap-3 sm:mt-4 sm:flex-row">
                <p className="m-0 text-center text-sm text-slate-300 sm:text-left">
                  {isRevealed ? "Message revealed. Happy birthday!" : "Scratch at least half of the card to unlock it."}
                </p>
                <button
                  type="button"
                  onClick={resetScratchCard}
                  className="inline-flex h-10 items-center gap-2 rounded-md border border-white/18 bg-white/10 px-4 text-sm font-bold text-white transition hover:bg-white/18 focus:outline-none focus:ring-2 focus:ring-[#f8c77e]"
                >
                  <RotateCcw size={16} aria-hidden="true" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      <style jsx global>{`
        @keyframes birthdayConfettiFall {
          0% {
            opacity: 0;
            transform: translate3d(0, -20px, 0) rotate(0deg);
          }
          12% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translate3d(44px, 108vh, 0) rotate(520deg);
          }
        }
      `}</style>
    </main>
  );
}
