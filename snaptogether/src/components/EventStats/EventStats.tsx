"use client";

import React from "react";
import { Users, Image as ImageIcon, Star } from "lucide-react";
import { useTranslations } from "next-intl";

type EventStatsProps = {
  totalPhotos: number;
  totalGuests: number;
  mostActiveGuest?: string;
};

export default function EventStats({
  totalPhotos,
  totalGuests,
  mostActiveGuest,
}: EventStatsProps) {
  const t = useTranslations("eventStats");
  const avgPhotos =
    totalGuests > 0 ? (totalPhotos / totalGuests).toFixed(1) : 0;

  return (
    <div className="border w-full max-w-md bg-gray-900 text-white rounded-xl shadow-md p-6 flex flex-col gap-4 items-baseline">
      <h3 className="text-white text-2xl font-semibold flex items-center gap-3">
        📊 {t("title")}
      </h3>

      <div className="flex items-center gap-1">
        <Users size={24} />
        <span className="text-md w-fit">
          <strong>{totalGuests}</strong> {t("guests")}
        </span>
      </div>

      <div className="flex items-center gap-1">
        <ImageIcon size={24} />
        <span className="text-md w-fit">
          <strong>{totalPhotos}</strong> {t("photos")}
        </span>
      </div>

      {mostActiveGuest && (
        <div className="flex items-center gap-1">
          <Star size={24} />
          <span className="text-md w-fit">
            {t("mvp")}: {mostActiveGuest}
          </span>
        </div>
      )}

      <div className="flex items-start gap-1">
        <Star size={24} />
        <span className="text-md text-left w-fit">
          <strong>{avgPhotos}</strong> {t("avg")}
        </span>
      </div>
    </div>
  );
}
