"use client";

import { useTranslations } from "next-intl";
import { Copy, Check } from "lucide-react"; // Optional icon library
import { useState } from "react";

interface PendingPaymentNoticeProps {
  plan: "starter" | "pro";
}

export default function PendingPaymentNotice({ plan }: PendingPaymentNoticeProps) {
  const t = useTranslations("eventForm.paymentInstructions");

  const [copied, setCopied] = useState(false);

  const accountNumber = t("accountNumber");

    const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('240197111431684');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("❌ Failed to copy:", err);
    }
  };
  
  return (
    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-fit max-w-md w-full space-y-6 p-6 rounded-lg shadow-md bg-white opacity-90 text-center">
      <h2 className="text-xl font-bold text-gray-800">
        {plan === "starter" ? t("starterTitle") : t("proTitle")}
      </h2>

      <p className="text-sm text-gray-600">{t("message")}</p>

      <div className="bg-gray-100 rounded p-4 text-sm font-mono flex flex-col gap-4">
        <p className="text-slate-700">{t("bankName")}</p>
        <div className="flex items-center justify-between p-2">
          <span className="text-slate-700">{accountNumber} 240197111431684</span>
          <button
            onClick={handleCopy}
            className="text-sm text-blue-600 hover:text-blue-800 transition"
          >
            {copied ? <Check size={16} /> : <Copy size={16} color="#1F2937" />}
          </button>
        </div>        {/* <p className="text-slate-700">{t("iban")}</p> */}
        <strong className="text-black">
          {plan === "starter" ? t("amountStarter") : t("amountPro")}
        </strong>
        <p className="text-slate-700">{t("purpose")}</p>
      </div>

      <p className="text-sm text-gray-500 mt-4">{t("note")}</p>
    </div>
  );
}
