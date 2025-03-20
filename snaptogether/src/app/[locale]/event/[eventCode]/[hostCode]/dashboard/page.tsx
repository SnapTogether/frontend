"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchEventForHost, EventResponse, Photo } from "@/api/event";
import Image from "next/image";
import Button from "@/components/Button/Button";
import { BadgeInfo, Calendar, Mail, PartyPopper, SmilePlus } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import DownloadZip from "@/components/DownloadZip/DownloadZip";
import CardImg from '../../../../../../../public/bg3.jpg'
import PhotoGallery from "@/components/PhotoGallery/PhotoGallery";
import GuestList from "@/components/GuestList/GuestList";
import Loader from "@/components/Loader/Loader";
import QRCodeTabs from "@/components/QRCodeTabs/QRCodeTabs";
import { Divider } from "@/components/Divider/Divider";
import { useTranslations } from "next-intl";
import ImageCarousel from "@/components/ImageCarousel/ImageCarousel";
import socket from "@/utils/socket";

export default function HostDashboard() {
  const params = useParams();
  const eventCode = params.eventCode as string;
  const hostCode = params.hostCode as string;

  const [eventData, setEventData] = useState<EventResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const currentPage = 1;
  const photosPerPage = 20;
  
  const t = useTranslations("dashboard");

  useEffect(() => {
    if (!eventCode || !hostCode) return;

    console.log("🔌 Connecting WebSocket...");

    socket.on("connect", () => {
        console.log("✅ WebSocket Connected:", socket.id);
    });

    socket.on("disconnect", () => {
        console.log("❌ WebSocket Disconnected");
    });

    const fetchEvent = async () => {
        setLoading(true);
        setError("");

        const response = await fetchEventForHost(eventCode, hostCode, currentPage, photosPerPage);

        if (response.status !== 200) {
            setError(response.message);
        } else {
            setEventData(response);
            console.log("📨 Total Pages:", response.event?.pagination?.totalPages);
            console.log("📸 Initial Photo Count:", response.event?.photos?.length); // ✅ Log initial number of photos
        }

        setLoading(false);
    };

    socket.on("newImageUploaded", (data: { eventCode: string; images: { photoId: string; imageUrl: string }[] }) => {
        if (data.eventCode === eventCode) {
            console.log("📥 New images received via WebSocket:", data);

            setEventData((prev) => {
                if (!prev || !prev.event) return prev;

                // ✅ Ensure images conform to `Photo` type
                const formattedPhotos: Photo[] = data.images.map((img) => ({
                    _id: img.photoId, // ✅ Convert `photoId` to `_id`
                    imageUrl: img.imageUrl,
                }));

                const updatedPhotos = [...formattedPhotos, ...prev.event.photos];

                console.log("📸 Updated Photo Count:", updatedPhotos.length); // ✅ Log updated number of photos

                return {
                    ...prev,
                    event: {
                        ...prev.event,
                        photos: updatedPhotos, // ✅ Append new photos correctly
                    },
                } as EventResponse; // ✅ Ensure the return type matches EventResponse
            });

            // ✅ Force UI update (React sometimes doesn't re-render immediately)
            setTimeout(() => {
                setEventData((prev) => (prev ? { ...prev } : null));
            }, 0);
        }
    });

    fetchEvent();

    return () => {
        socket.off("newImageUploaded"); // ✅ Cleanup WebSocket listener when component unmounts
        socket.off("connect");
        socket.off("disconnect");
    };
}, [eventCode, hostCode, currentPage]); // ✅ Keeps dependencies the same


  if (loading)
    return (
      <div className="w-screen h-screen">
        <Loader />
      </div>
    );
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  
  return (
    <>
      <Navbar />
      <div className="relative mt-20 flex flex-col items-center gap-8 p-6">
        <DownloadZip className="absolute top-0 right-[10%]" eventCode={eventCode} />
        <h2 className="flex flex-col sm:flex-row items-center justify-center gap-3 text-white text-center text-xl sm:text-3xl font-semibold"><PartyPopper size={20}/> {t("title")} <b>{eventData?.event?.eventName}</b></h2>
        <div className="event-info relative rounded-lg bg-gray-800 w-full text-center flex flex-col items-start text-white max-w-[21em] gap-3">
          <Image src={CardImg} alt="logo" className="rounded-t-lg h-[10em] object-cover" />
          <h3 className="flex gap-3 font-bold text-lg text-white px-5"><BadgeInfo/>{t("subtitle")}</h3>
          <div className="info-text w-full flex flex-col items-start gap-2 px-5 pb-3">

            <section className="text-slate-50 text-md sm:text-md flex items-center justify-between"><Button className="pl-0" variant="tertiary" iconLeft={<Calendar color="white" size={18} />} /> {new Date(eventData?.event?.eventDate || "").toLocaleDateString()}</section>
            <section className="text-slate-50 text-md sm:text-md flex items-center justify-between"><Button className="pl-0" variant="tertiary" iconLeft={<SmilePlus color="white" size={18} />} /> {eventData?.event?.hostFullName}</section>
            <section className="text-slate-50 text-sm sm:text-md flex items-center justify-between"><Button className="pl-0" variant="tertiary" iconLeft={<Mail color="white" size={18} />} /> {eventData?.event?.hostEmail}</section>
          </div>
        </div>

        {/* <h3 className="text-white text-center text-3xl font-semibold">
          <Button variant="tertiary" className="text-white focus:ring-0 focus:ring-offset-0 focus:outline-none" iconLeft={<Link size={20} color="white" />}>
            Event Links
          </Button>
        </h3> */}
        <Divider width="quarter" border={true}/>

        {eventData?.event && (
          <QRCodeTabs eventData={{ event: { hostLink: eventData.event.hostLink, guestLink: eventData.event.guestLink } }} />
        )}

        <Divider width="quarter" border={true}/>

        <PhotoGallery photos={eventData?.event?.photos || []} />

        <Divider width="full" border={true}/>

        <GuestList guests={eventData?.event?.guests || []} eventCode={eventCode}/>

        <Divider width="full" border={true}/>

        <ImageCarousel 
          images={[
           '/wedding-poster.png',
           '/birthday-poster.png'
          ]}
        />

      </div>
    </>
  );
}
