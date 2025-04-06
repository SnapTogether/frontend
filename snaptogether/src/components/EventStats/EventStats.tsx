"use client";

import React from "react";
import { Users, Image as ImageIcon, Star } from "lucide-react";

type EventStatsProps = {
    totalPhotos: number;
    totalGuests: number;
    mostActiveGuest?: string; // optional, for future flexing
};

export default function EventStats({ totalPhotos, totalGuests, mostActiveGuest }: EventStatsProps) {
    const avgPhotos = totalGuests > 0 ? (totalPhotos / totalGuests).toFixed(1) : 0;


    return (
        <div className="border w-full max-w-md bg-gray-900 text-white rounded-xl shadow-md p-6 flex flex-col gap-4 items-start">
            <h3 className="text-white text-2xl md:text-2xl font-semibold flex flex-row items-center justify-center gap-3">📊 Event Statistics</h3>

            <div className="flex items-start gap-3">
                <Users size={24} />
                <span className="text-md">
                    <strong>{totalGuests}</strong> guests contributed
                </span>
            </div>

            <div className="flex items-start gap-3">
                <ImageIcon size={24} />
                <span className="text-md">
                    <strong>{totalPhotos}</strong> total photos uploaded
                </span>
            </div>

            {mostActiveGuest && (
                <div className="flex items-start gap-3">
                    <Star size={24} />
                    <span className="text-md">MVP Guest: {mostActiveGuest}</span>
                </div>
            )}

            <div className="flex items-start gap-3">
                <Star size={24} />
                <span className="text-md text-left">
                    <strong>{avgPhotos}</strong> Average Uploaded Photos Per Guest
                </span>
            </div>
        </div>
    );
}
