"use client";

import { motion } from "framer-motion";
import { X, Heart } from "lucide-react";
import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useTranslations } from "next-intl";

type InviteRSVPProps = {
  open: boolean;
  onClose: () => void;
};

const fieldClass =
  "w-full border-0 border-b border-[#7f9b87] bg-transparent px-0 pb-3 pt-1 text-[15px] text-[#5d8068] placeholder:text-[#a1aea5] focus:outline-none focus:ring-0";

export default function InviteRSVP({ open, onClose }: InviteRSVPProps) {
  const t = useTranslations("invite.rsvp");
  const [fullName, setFullName] = useState("");
  const [attending, setAttending] = useState<"" | "yes" | "no">("");
  const [withPartner, setWithPartner] = useState<"" | "yes" | "no">("");
  const [partnerName, setPartnerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const showPartnerName = useMemo(() => withPartner === "yes", [withPartner]);
  const canSubmit =
    fullName.trim().length > 0 &&
    attending !== "" &&
    withPartner !== "" &&
    (!showPartnerName || partnerName.trim().length > 0);

  const resetForm = () => {
    setFullName("");
    setAttending("");
    setWithPartner("");
    setPartnerName("");
    setIsSubmitting(false);
    setIsSubmitted(false);
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
    setTimeout(resetForm, 250);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1300);
  };

  if (!open) return null;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-[120] overflow-y-auto bg-[#fbf7ef] text-[#5d8068]"
    >
      <div className="mx-auto min-h-screen w-full max-w-[420px] px-7 pb-14 pt-8 font-serif">
        <div className="mb-8 flex justify-end">
          <button
            type="button"
            onClick={handleClose}
            aria-label={t("closeAria")}
            className="text-[#5d8068]/85 transition hover:text-[#5d8068] disabled:opacity-50"
            disabled={isSubmitting}
          >
            <X className="h-9 w-9" strokeWidth={1.4} />
          </button>
        </div>

        <div className="text-center">
          <h2 className="text-[64px] leading-none tracking-[0.02em] text-[#5d8068]">RSVP</h2>
          <div className="mt-4 flex items-center justify-center gap-3 text-[#8ea594]">
            <div className="h-px w-24 bg-[#9db2a3]" />
            <Heart className="h-4 w-4 fill-current" strokeWidth={1.5} />
            <div className="h-px w-24 bg-[#9db2a3]" />
          </div>
          <p className="mx-auto mt-4 max-w-[290px] text-[15px] leading-[1.5] text-[#5d8068]">
            {t("description.line1")}
            <br />
            {t("description.line2")}
            <br />
            {t("description.line3")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          <label className="block">
            <span className="text-[18px] text-[#5d8068]">{t("fields.fullName.label")}</span>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t("fields.fullName.placeholder")}
              className={fieldClass}
            />
          </label>

          <div>
            <p className="text-[18px] text-[#5d8068]">{t("fields.attending.label")}</p>
            <div className="mt-4 flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={() => setAttending("yes")}
                className={`h-12 w-12 rounded-full border border-[#5d8068] text-[15px] font-medium leading-none transition-colors ${
                  attending === "yes" ? "bg-[#5d8068] text-[#fbf7ef]" : "bg-transparent text-[#5d8068]"
                }`}
              >
                {t("yes")}
              </button>
              <span className="text-[22px] text-[#5d8068]/40">/</span>
              <button
                type="button"
                onClick={() => setAttending("no")}
                className={`h-12 w-12 rounded-full border border-[#5d8068] text-[15px] font-medium leading-none transition-colors ${
                  attending === "no" ? "bg-[#5d8068] text-[#fbf7ef]" : "bg-transparent text-[#5d8068]"
                }`}
              >
                {t("no")}
              </button>
            </div>
          </div>

          <div>
            <p className="text-[18px] text-[#5d8068]">{t("fields.withPartner.label")}</p>
            <div className="mt-4 flex items-center justify-center gap-6">
              <button
                type="button"
                onClick={() => setWithPartner("yes")}
                className={`h-12 w-12 rounded-full border border-[#5d8068] text-[15px] font-medium leading-none transition-colors ${
                  withPartner === "yes" ? "bg-[#5d8068] text-[#fbf7ef]" : "bg-transparent text-[#5d8068]"
                }`}
              >
                {t("yes")}
              </button>
              <span className="text-[22px] text-[#5d8068]/40">/</span>
              <button
                type="button"
                onClick={() => {
                  setWithPartner("no");
                  setPartnerName("");
                }}
                className={`h-12 w-12 rounded-full border border-[#5d8068] text-[15px] font-medium leading-none transition-colors ${
                  withPartner === "no" ? "bg-[#5d8068] text-[#fbf7ef]" : "bg-transparent text-[#5d8068]"
                }`}
              >
                {t("no")}
              </button>
            </div>
          </div>

          {showPartnerName && (
            <label className="block">
              <span className="text-[18px] text-[#5d8068]">{t("fields.partnerName.label")}</span>
              <input
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder={t("fields.partnerName.placeholder")}
                className={fieldClass}
              />
            </label>
          )}

          <div className="pt-2 text-center">
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting || isSubmitted}
              className="h-[48px] w-full rounded-[10px] border border-[#5d8068] bg-[#5f866b] px-6 text-[15px] font-medium tracking-[0.08em] text-[#fbf7ef] transition-colors disabled:cursor-not-allowed disabled:opacity-55"
            >
              {isSubmitting ? t("buttons.submitting") : t("buttons.submit")}
            </button>
          </div>
        </form>

        {isSubmitted && (
          <p className="mt-6 text-center text-[16px] leading-[1.45] text-[#5d8068]">
            {t("success")}
          </p>
        )}
      </div>
    </motion.section>
  );
}
