"use client";

import React, { useEffect, useState } from "react";
import Button from "../Button/Button";
import { Download } from "lucide-react";
import { useTranslations } from "next-intl";
import socket from "@/utils/socket";

interface DownloadZipProps {
  eventCode: string; // ✅ Accepts eventCode as a prop
  className?: string;
}

export default function DownloadZip({ eventCode, className }: DownloadZipProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations();

  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    socket.on(`zipProgress-${eventCode}`, ({ progress }) => {
      setProgress(progress);
    });

    return () => {
      socket.off(`zipProgress-${eventCode}`);
    };
  }, [eventCode]);

  const [status, setStatus] = useState<"idle" | "generating" | "downloading" | "error">("idle");

  const handleDownload = async () => {
    try {
      setStatus("generating");
  
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/api/photos/generate-zip/${eventCode}`,
        { method: "POST" }
      );
      const data = await res.json();
  
      if (res.ok && data.downloadUrl) {
        setStatus("downloading");
  
        // 📦 Trigger ZIP download
        window.location.href = data.downloadUrl;
  
        // ✅ Reset status after 10s (enough for download to start)
        setTimeout(() => setStatus("idle"), 10000);
      } else {
        setStatus("error");
        setError(data.message || "Failed to generate ZIP.");
      }
    } catch (err) {
      console.error("❌ ZIP generation error:", err);
      setError("❌ Unexpected error. Please try again.");
      setStatus("error");
    }
  };
  
  

  return (
    <>
  {status === "generating" && <p className="text-white">{t("zipBtn.generating")}</p>}
  {status === "downloading" && <p className="text-white">{t("zipBtn.downloading")}</p>}

    {status === "generating" && (
      <div className="w-full bg-gray-300 rounded mt-2">
        <div
          className="bg-blue-600 text-white text-sm p-1 rounded transition-all duration-200"
          style={{ width: `${progress}%` }}
        >
          {progress}%
        </div>
      </div>
    )}


      <Button
        variant="primary"
        onClick={handleDownload}
        disabled={status === "generating" || status === "downloading"}
        className={`${className} bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400`}
        iconLeft={<Download/>}
      >
      {t("zipBtn.title")}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
}
