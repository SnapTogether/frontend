"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Camera, Clock3, Heart, MapPin, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const TALLY_FORM_URL = "https://tally.so/r/WOVp1J";
const GALLERY_URL = "https://www.snaptogether.cloud/mk/event/bbf4a2/guest";
const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=" +
  encodeURIComponent("Парк Панорама, Делчево, Северна Македонија");

function FadeIn({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export default function AngelaNikolaInvitePage() {
  const [showRSVP, setShowRSVP] = useState(false);

  return (
    <main className="min-h-screen bg-[#d9d5c8] py-0 text-[#42544a] sm:py-8">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#f7f3e9_0%,#d9d5c8_55%,#aeb6a7_100%)]" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:url('/a-n-image.jpg')] bg-cover bg-center" />
      </div>

      <motion.article
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative mx-auto min-h-screen w-full max-w-[430px] overflow-hidden bg-[#fbfaf5] shadow-2xl sm:min-h-0 sm:rounded-t-[210px]"
      >
        <section className="relative px-5 pb-12 pt-5 text-center sm:pt-7">
          <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-full border border-[#a6aa81]/60 bg-white shadow-[0_15px_45px_rgba(69,82,65,0.16)]">
            <Image
              src="/a-n-image.jpg"
              alt="Ангела и Никола"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 430px) 100vw, 430px"
            />
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.9 }}
            className="px-5 pt-9"
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.32em] text-[#8a7650]">
              Се венчаваме
            </p>
            <h1 className="mt-3 font-serif text-[46px] leading-none text-[#485d50]">
              Ангела <span className="text-[#b28b53]">&amp;</span> Никола
            </h1>
            <div className="mx-auto mt-5 flex items-center justify-center gap-3 text-[#a3895e]">
              <span className="h-px w-16 bg-[#c8b992]" />
              <Heart className="h-4 w-4 fill-current" strokeWidth={1.2} />
              <span className="h-px w-16 bg-[#c8b992]" />
            </div>
            <p className="mx-auto mt-6 max-w-[320px] font-serif text-[19px] leading-relaxed text-[#59675f]">
              Со задоволство ве покануваме на нашата свадбена прослава да наздравиме за љубовта.
            </p>
          </motion.div>
        </section>

        <section className="border-y border-[#d9d2bc] bg-[#f4f1e7] px-8 py-12 text-center">
          <FadeIn>
            <CalendarDays className="mx-auto h-7 w-7 text-[#9b835c]" strokeWidth={1.25} />
            <p className="mt-3 text-[11px] uppercase tracking-[0.3em] text-[#7d897f]">Зачувајте го датумот</p>
            <div className="mx-auto mt-5 grid max-w-[300px] grid-cols-[1fr_auto_1fr] items-center gap-4">
              <p className="border-y border-[#b9b69d] py-2 text-xs uppercase tracking-[0.18em] text-[#2f3d35]">Сабота</p>
              <p className="font-serif text-6xl leading-none text-[#53665a]">26</p>
              <p className="border-y border-[#b9b69d] py-2 text-xs uppercase tracking-[0.18em] text-[#2f3d35]">Септември</p>
            </div>
            <p className="mt-3 text-sm tracking-[0.28em] text-[#8a7650]">2026</p>
          </FadeIn>
        </section>

        <section className="space-y-11 px-8 py-12 text-center">
          <FadeIn>
            <MapPin className="mx-auto h-8 w-8 text-[#9b835c]" strokeWidth={1.25} />
            <h2 className="mt-3 font-serif text-3xl text-[#4f6255]">Парк Панорама</h2>
            <p className="mt-2 text-sm tracking-[0.14em] text-[#778078]">Делчево</p>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex h-10 items-center justify-center rounded-full border border-[#647969] px-7 text-[11px] font-medium uppercase tracking-[0.16em] transition hover:bg-[#53685a] hover:text-white"
            >
              Прикажи локација
            </a>
          </FadeIn>

          <div className="mx-auto h-px w-28 bg-[#d0c5a8]" />

          <FadeIn>
            <Clock3 className="mx-auto h-8 w-8 text-[#9b835c]" strokeWidth={1.25} />
            <h2 className="mt-3 font-serif text-3xl text-[#4f6255]">Прием на гости</h2>
            <p className="mt-3 font-serif text-5xl text-[#53665a]">19:00</p>
          </FadeIn>

          <div className="mx-auto h-px w-28 bg-[#d0c5a8]" />

          <FadeIn>
            <Heart className="mx-auto h-8 w-8 text-[#9b835c]" strokeWidth={1.25} />
            <h2 className="mt-3 font-serif text-3xl text-[#4f6255]">Потврдете присуство</h2>
            <p className="mx-auto mt-3 max-w-[290px] text-[15px] leading-relaxed text-[#68736c]">
              Ве молиме потврдете го вашето присуство најдоцна до 05.09.2026.
            </p>
            <button
              type="button"
              onClick={() => setShowRSVP(true)}
              className="mt-6 h-11 rounded-full bg-[#53685a] px-8 text-[11px] font-semibold uppercase tracking-[0.17em] text-white shadow-md transition hover:bg-[#405247]"
            >
              Потврди присуство
            </button>
          </FadeIn>
        </section>

        <section className="bg-[#526358] px-8 py-12 text-center text-[#f7f3e9]">
          <Camera className="mx-auto h-8 w-8 text-[#d1bd8e]" strokeWidth={1.2} />
          <h2 className="mt-3 font-serif text-3xl text-white">Споделете ги моментите</h2>
          <p className="mx-auto mt-3 max-w-[280px] text-sm leading-relaxed text-[#e1e4de]">
            Фотографиите од прославата ќе може да ги споделите во нашата свадбена галерија.
          </p>
          <a
            href={GALLERY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full border border-[#d1bd8e] px-7 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#f7f3e9] transition hover:bg-[#d1bd8e] hover:text-[#435248]"
          >
            Отвори ја галеријата
          </a>
          <p className="mt-9 font-serif text-2xl text-[#e7d6ae]">Ангела &amp; Никола</p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.28em] text-[#c5cec7]">26 · 09 · 2026</p>
        </section>
      </motion.article>

      <AnimatePresence>
        {showRSVP && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#fbfaf5] text-[#4f6255]"
          >
            <button
              type="button"
              onClick={() => setShowRSVP(false)}
              className="fixed right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#fbfaf5]/95 text-[#53685a] shadow-md"
              aria-label="Затвори"
            >
              <X className="h-5 w-5" />
            </button>
            <iframe
              src={TALLY_FORM_URL}
              title="Ангела и Никола RSVP"
              className="h-full w-full border-0"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
