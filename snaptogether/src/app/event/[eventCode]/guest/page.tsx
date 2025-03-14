"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { verifyGuest, GuestResponse } from "@/api/guest";
import Upload from "@/components/Upload/Upload";
import Image from "next/image";
import Navbar from "@/components/Navbar/Navbar";
import Button from "@/components/Button/Button";
import Link from "next/link";
import './guest.css'

export default function GuestDashboard() {
    const params = useParams();
    const eventCode = params.eventCode as string;

    const [guestName, setGuestName] = useState<string>("");
    const [guestData, setGuestData] = useState<GuestResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    // ✅ Handle guest verification
    const handleVerifyGuest = async (e?: React.FormEvent) => {
        e?.preventDefault(); // ✅ Prevent form from reloading the page

        if (!guestName.trim()) {
            setError("❌ Please enter your full name.");
            return;
        }

        setLoading(true);
        setError("");

        const response = await verifyGuest(eventCode, guestName);

        if (response.status === 200) {
            setGuestData(response);
        } else {
            setError(response.message);
        }

        setLoading(false);
    };

    return (
        <div className="guest-dashboard relative w-screen h-screen">
            <Navbar/>
            <div className="absolute w-[95%] sm:w-full max-w-[30em] left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 mx-auto space-y-4 border border-slate-500 border-opacity-65 rounded-lg shadow-md bg-white/10 backdrop-blur-lg">
            <h2 className="text-white text-2xl font-semibold text-center">🎟️ Guest Dashboard</h2>
                {!guestData ? (
                    // ✅ Wrap everything inside a <form>
                    <form onSubmit={handleVerifyGuest} className="space-y-3">
                        <p className="text-gray-300">Enter your name to see your uploaded photos.</p>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={guestName}
                            onChange={(e) => setGuestName(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md text-black"
                        />
                        <Button
                            type="submit" // ✅ This makes Enter work automatically
                            className="w-full bg-[rgba(120,128,181,0.8)]"
                            disabled={loading}
                            variant="primary"
                        >
                            {loading ? "Verifying..." : "Verify Guest"}
                        </Button>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                    </form>
                ) : (
                    <div className="flex flex-col gap-6 text-center">
                        <h3 className="text-lg font-semibold text-slate-50">📸 Your Uploaded Photos</h3>
                        {/* ✅ Render Uploaded Photos */}
                        {guestData.photos && guestData.photos.length > 0 ? (
                            <div className="grid grid-cols-3 gap-3 mt-2">
                                {guestData.photos.map((photo, index) => (
                                    <Image
                                        key={photo.photoId || index}
                                        src={photo.imageUrl}
                                        alt="Guest Upload"
                                        width={500}
                                        height={500}
                                        className="rounded-md shadow-md object-cover"
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-300">No photos found for this guest.</p>
                        )}

                        {/* ✅ Upload Component */}
                        <Upload eventCode={eventCode} guestId={guestData?.guest?.guestId || ""} />
                    </div>
                )}
            </div>
            <Link href='/' className="text-slate-200 logo-footer select-none absolute left-1/2 transform -translate-x-1/2 bottom-4 z-10 text-center text-[40px] sm:text-[46px] rounded-md m-0" style={{ fontFamily: "var(--font-gochi-hand)" }}>
                Snaptogether
            </Link>
        </div>
    );
}

