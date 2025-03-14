"use client";

import React, { useState } from "react";
import { downloadPhotosForGuest } from "@/api/photo";
import Button from "../Button/Button";
import { Download } from "lucide-react";

interface DownloadZipProps {
  eventCode: string; // ✅ Accepts eventCode as a prop
  className?: string;
}

export default function DownloadZip({ eventCode, className }: DownloadZipProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="flex flex-col items-center gap-4">
      <Button
        variant="tertiary"
        onClick={handleDownload}
        disabled={loading}
        className={`${className} bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400`}
        iconLeft={<Download/>}
      >
        {loading ? "Generating ZIP..." : "Download ZIP"}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
