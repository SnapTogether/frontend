"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Wine,
  MapPinned,
  Clock3,
  Music3,
  HeartHandshake,
  UtensilsCrossed,
  Globe,
  Camera,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import InviteRSVP from "./InviteRSVP";
import BackgroundMusic from "./BackgroundMusic";
import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/LanguageSwitcher/LanguageSwitcher";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const weddingDate = new Date("2026-11-29T20:30:00");
const tornTopPath =
  "M0,26 C16,14 28,34 44,20 C59,7 73,31 88,18 C104,4 119,30 136,16 C152,3 170,28 188,15 C206,2 224,27 242,14 C260,3 276,24 292,12 C306,2 315,15 320,11 L320,34 L0,34 Z";
const tornBottomPath =
  "M0,22 C12,9 27,30 42,17 C56,5 72,29 88,15 C104,2 121,27 138,14 C155,1 173,26 191,13 C209,2 227,24 244,12 C262,3 278,23 294,11 C306,3 315,16 320,12 L320,34 L0,34 Z";
const thinDividerClass = "mx-auto mt-8 w-[140px] border-t border-[#9cb09f]";

function getTimeLeft(targetDate: Date): TimeLeft {
  const diff = targetDate.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.34 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function InvitePage() {
  const t = useTranslations("invite.page");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [introStarted, setIntroStarted] = useState(false);
  const [introFading, setIntroFading] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showRSVP, setShowRSVP] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(weddingDate));
  const timelineItems = t.raw("timeline.items") as Array<{ time: string; label: string }>;
  const timelineIcons = [MapPinned, Music3, Wine, UtensilsCrossed, Globe];
  const partyAddress = "Салон Example, Скопје";
  const partyMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(partyAddress)}`;
 
  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft(weddingDate)), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleStartIntro = async () => {
    if (introStarted) return;
    setIntroStarted(true);
    try {
      await videoRef.current?.play();
    } catch {
      setIntroStarted(false);
    }
  };

  const handleVideoEnd = () => {
    setIntroFading(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      setShowInvite(true);
    }, 420);
  };

  return (
    <main className="min-h-screen bg-[#d4d6d0]">
      <BackgroundMusic isOpen={showInvite} src="/invite/intro-song.mp3" />
      <LanguageSwitcher className="fixed right-2 top-2 z-[100] scale-75 origin-top-right rounded-full bg-black/30 px-1.5 py-1 backdrop-blur-sm" />

      {!showInvite && (
        <motion.section
          initial={{ opacity: 1 }}
          animate={introFading ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="relative min-h-screen"
        >
          <button
            type="button"
            onClick={handleStartIntro}
            className="absolute inset-0 cursor-pointer focus:outline-none"
            aria-label={t("intro.playAria")}
          >
            <video
              ref={videoRef}
              className="h-full w-full object-cover max-w-[360px] mx-auto"
              playsInline
              preload="auto"
              onEnded={handleVideoEnd}
            >
              <source src="/invite/opening-intro.mov" type="video/quicktime" />
              <source src="/invite/opening-intro.mov" type="video/mp4" />
            </video>
          </button>
        </motion.section>
      )}

      {showInvite && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="relative mx-auto w-full max-w-[360px]"
        >
          <div className="pointer-events-none fixed inset-0 -z-10">
            <Image src="/carousel/carousel-1.png" alt={t("background.alt")} fill className="object-cover grayscale" />
            <div className="absolute inset-0 bg-black/35 backdrop-blur-[3px]" />
          </div>

          <article className="bg-[#fbf7ef] font-serif text-[#5f866b] shadow-[0_8px_24px_rgba(0,0,0,0.15)]">
            <div className="relative h-[420px] w-full">
              <Image src="/carousel/carousel-3.png" alt={t("hero.imageAlt")} fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/42 via-transparent to-transparent" />
              <div className="absolute bottom-[56px] left-0 right-0 text-center text-[#f7f2e8]">
                <p className="text-[11px] tracking-[0.22em]">{t("hero.kicker")}</p>
                <p className="mt-1 font-['var(--font-gochi-hand)'] text-[58px] leading-[0.88]">{t("hero.couple")}</p>
                <p className="mt-2 text-[13px] font-semibold tracking-[0.34em] text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.55)]">{t("hero.date")}</p>
              </div>
            </div>

            <div className="relative -mt-[30px] h-[34px] bg-transparent">
              <svg viewBox="0 0 320 34" preserveAspectRatio="none" className="h-full w-full">
                <path d={tornBottomPath} fill="#fbf7ef" />
              </svg>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.95, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="px-7 pt-2 text-center">
                <div className="mt-2.5 grid grid-cols-4">
                  {[
                    [timeLeft.days, t("countdown.days")],
                    [timeLeft.hours, t("countdown.hours")],
                    [timeLeft.minutes, t("countdown.minutes")],
                    [timeLeft.seconds, t("countdown.seconds")],
                  ].map(([value, label]) => (
                    <div key={String(label)}>
                      <p className="text-[34px] leading-none text-[#5d8068]">{String(value).padStart(2, "0")}</p>
                      <p className="mt-1 text-[13px] leading-none text-[#5d8068]">{label}</p>
                    </div>
                  ))}
                </div>
                <br></br>
                <p className="mx-auto mt-4 max-w-[230px] text-[14px] leading-[1.4] text-[#5d8068]">{t("countdown.note")}</p>
              </div>
            </motion.div>

            <FadeIn>
              <div className="mt-6 px-7 text-center">
                <p className="mb-2 text-[11px] tracking-[0.18em] text-[#5d8068]">{t("dateRow.kicker")}</p>
                <div className="flex items-center justify-center gap-3">
                  <div className="h-px w-14 bg-[#9aad9f]" />
                  <p className="text-[11px] tracking-[0.14em] text-[#5d8068]">{t("dateRow.day")}</p>
                  <p className="text-[56px] font-semibold leading-none text-[#4f725a]">{t("dateRow.dayNumber")}</p>
                  <p className="text-[11px] tracking-[0.14em] text-[#5d8068]">{t("dateRow.month")}</p>
                  <div className="h-px w-14 bg-[#9aad9f]" />
                </div>
              </div>
            </FadeIn>

                  {/* //Church */}
            {/* <FadeIn>
              <div className="mt-6 px-7 text-center">
                <Church className="mx-auto h-7 w-7 text-[#9aaea1]" strokeWidth={1.4} />
                <h2 className="mt-2 text-[22px] leading-none text-[#5d8068]">{t("ceremony.title")}</h2>
                <p className="mx-auto mt-3 max-w-[240px] text-[14px] leading-[1.42] text-[#5d8068]">{t("ceremony.text")}</p>
                <a
                  href={ceremonyMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex h-[34px] w-[150px] items-center justify-center rounded-full bg-[#5f866b] text-[11px] tracking-[0.12em] text-[#f9f6ef]"
                >
                  {t("buttons.howToGetThere")}
                </a>
              </div>
            </FadeIn> */}

            <FadeIn>
              <div className="mt-6 px-7 text-center">
                <Wine className="mx-auto h-7 w-7 text-[#9aaea1]" strokeWidth={1.4} />
                <h2 className="mt-2 text-[22px] leading-none text-[#5d8068]">{t("party.title")}</h2>
                <p className="mx-auto mt-3 max-w-[240px] text-[14px] leading-[1.42] text-[#5d8068]">{t("party.text")}</p>
                <a
                  href={partyMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex h-[34px] w-[150px] items-center justify-center rounded-full bg-[#5f866b] text-[11px] tracking-[0.12em] text-[#f9f6ef]"
                >
                  {t("buttons.howToGetThere")}
                </a>
              </div>
            </FadeIn>

            <div className="relative mt-6 h-[420px]">
              <div className="absolute inset-x-0 top-[0px] z-20 h-[34px] rotate-180">
                <svg viewBox="0 0 320 34" preserveAspectRatio="none" className="h-full w-full">
                  <path d={tornTopPath} fill="#fbf7ef" />
                </svg>
              </div>
              <Image src="/carousel/carousel-2.png" alt={t("secondImage.alt")} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-[0px] z-20 h-[34px]">
                <svg viewBox="0 0 320 34" preserveAspectRatio="none" className="h-full w-full">
                  <path d={tornBottomPath} fill="#fbf7ef" />
                </svg>
              </div>
            </div>

            <FadeIn>
              <div className="mt-6 px-7 text-center">
                <Clock3 className="mx-auto h-7 w-7 text-[#9aaea1]" strokeWidth={1.4} />
                <div className="mt-3 space-y-3.5">
                  {timelineItems.map(({ time, label }, idx) => {
                    const Icon = timelineIcons[idx] ?? Clock3;
                    return (
                      <div key={`${time}-${idx}`}>
                        <div className="mb-0.5 flex justify-center text-[#9aaea1]">
                          <Icon className="h-7 w-7" strokeWidth={1.3} />
                        </div>
                        <p className="text-[28px] leading-none text-[#5d8068]">{time}</p>
                        <p className="mt-1 text-[14px] leading-none text-[#5d8068]">{label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </FadeIn>

            <div className={thinDividerClass} />

            <FadeIn>
              <br/>
              <div className="mt-6 px-7 text-center">
                <HeartHandshake className="mx-auto h-7 w-7 text-[#9aaea1]" strokeWidth={1.4} />
                <h2 className="mt-2 text-[22px] leading-none text-[#5d8068]">{t("rsvp.title")}</h2>
                <p className="mx-auto mt-3 max-w-[245px] text-[14px] leading-[1.42] text-[#5d8068]">{t("rsvp.text")}</p>
                <button
                  onClick={() => setShowRSVP(true)}
                  className="mt-4 h-[34px] w-[160px] rounded-full bg-[#5f866b] text-[11px] tracking-[0.12em] text-[#f9f6ef]"
                >
                  {t("buttons.confirmAttendance")}
                </button>
              </div>
            </FadeIn>

            <div className={thinDividerClass} />

            <FadeIn>
              <br/>
              <div className="mt-6 px-7 text-center">
                <Camera className="mx-auto h-7 w-7 text-[#9aaea1]" strokeWidth={1.4} />
                <h2 className="mt-2 text-[22px] leading-none text-[#5d8068]">{t("share.title")}</h2>
                <p className="mx-auto mt-3 max-w-[245px] text-[14px] leading-[1.42] text-[#5d8068]">
                  {t("share.line1")}
                  <br />
                  {t("share.line2")}
                </p>
                <div className="mx-auto mt-4 flex h-[94px] w-[94px] items-center justify-center rounded-md border border-[#98aa9d] bg-[#f7f1e7]">
                  <Camera className="h-12 w-12 text-[#7f9987]" strokeWidth={1.4} />
                </div>
                <button className="mt-4 h-[34px] w-[150px] rounded-full bg-[#5f866b] text-[11px] tracking-[0.12em] text-[#f9f6ef]">{t("buttons.uploadPhotos")}</button>
              </div>
              <div className="mt-6 px-7 pb-16 text-center"></div>
            </FadeIn>
            
          </article>
        </motion.section>
      )}

      <AnimatePresence>
        {showRSVP && <InviteRSVP open={showRSVP} onClose={() => setShowRSVP(false)} />}
      </AnimatePresence>
    </main>
  );
};
