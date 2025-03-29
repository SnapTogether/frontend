"use client";

import React, { useState } from "react";
import { downloadPhotosForGuest } from "@/api/photo";
import Button from "../Button/Button";
import { Download } from "lucide-react";
import { useTranslations } from "next-intl";

interface DownloadZipProps {
  eventCode: string; // ✅ Accepts eventCode as a prop
  className?: string;
}

export default function DownloadZip({ eventCode, className }: DownloadZipProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations();

  const handleDownload = async () => {
    setLoading(true);
    setError(null);

    try {
      await downloadPhotosForGuest(eventCode); // ✅ Correct function call
    } catch (err) {
        console.error("❌ ZIP Download Error:", err);
        setError("❌ Failed to download ZIP file.");
    }

    setLoading(false);
  };

  return (
    <>
      <Button
        variant="primary"
        onClick={handleDownload}
        disabled={loading}
        className={`${className} bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400`}
        iconLeft={<Download/>}
      >
      {loading ? t("zipBtn.subtitle") : t("zipBtn.title")}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
}
