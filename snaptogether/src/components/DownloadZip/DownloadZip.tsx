"use client";

import React, { useState } from "react";
import { downloadPhotosForGuest } from "@/api/photo";

interface DownloadZipProps {
  eventCode: string; // ✅ Accepts eventCode as a prop
}

export default function DownloadZip({ eventCode }: DownloadZipProps) {
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
      <button
        onClick={handleDownload}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? "Generating ZIP..." : "Download ZIP"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
