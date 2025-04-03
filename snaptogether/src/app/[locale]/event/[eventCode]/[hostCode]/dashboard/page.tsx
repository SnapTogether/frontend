"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchEventForHost, EventResponse } from "@/api/event";
import Image from "next/image";
import Button from "@/components/Button/Button";
import { BadgeInfo, Calendar, Hourglass, Mail, PartyPopper, SmilePlus } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";
import DownloadZip from "@/components/DownloadZip/DownloadZip";
import CardImg from '../../../../../../../public/bg4.jpg'
import PhotoGallery from "@/components/PhotoGallery/PhotoGallery";
import GuestList from "@/components/GuestList/GuestList";
import Loader from "@/components/Loader/Loader";
import QRCodeTabs from "@/components/QRCodeTabs/QRCodeTabs";
import { Divider } from "@/components/Divider/Divider";
import { useTranslations } from "next-intl";
import ImageCarousel from "@/components/ImageCarousel/ImageCarousel";
import socket from "@/utils/socket";
import StorageBar from "@/components/StorageBar/StorageBar";
import PendingPaymentNotice from "@/components/PendingPaymentNotice/PendingPaymentNotice";
import Link from "next/link";
import EventStats from "@/components/EventStats/EventStats";

export default function HostDashboard() {
  const params = useParams();
  const eventCode = params.eventCode as string;
  const hostCode = params.hostCode as string;

  const [eventData, setEventData] = useState<EventResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const currentPage = 1;
  const photosPerPage = 20;
  const plural = daysLeft !== 1 ? "s" : "";
  
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

      if (response.event?.expirationDate) {
        const expiration = new Date(response.event.expirationDate);
        const now = new Date();
        const timeDiff = expiration.getTime() - now.getTime();
        const remainingDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        setDaysLeft(Math.max(remainingDays, 0)); // never show negative
      }
      

      setLoading(false);
    };

    socket.on("newImageUploaded", (data: { eventCode: string; images: { photoId: string; imageUrl: string }[] }) => {
      if (data.eventCode === eventCode) {
        console.log("📥 New images received via WebSocket:", data);
        fetchEvent(); // ✅ Fetches updated photos + usedStorage from backend
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
  
  if (
    eventData?.event &&
    !eventData.event.isPaymentConfirmed &&
    (eventData.event.plan === "starter" || eventData.event.plan === "pro")
  ) {
    return (
      <div>
        <Link href='/' className="text-slate-200 logo-footer select-none absolute left-1/2 transform -translate-x-1/2 bottom-1 z-10 text-center text-[40px] sm:text-[46px] rounded-md m-0" style={{ fontFamily: "var(--font-gochi-hand)" }}>
            Snaptogether
        </Link>
        <PendingPaymentNotice plan={eventData.event.plan} />
      </div>)
  }
  
  return (
    <>
      <Navbar />
      <div className="relative mt-20 flex flex-col items-center gap-8 p-6 container mx-auto">
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm text-white">
            {t("plan")}: <strong>{eventData?.event?.plan.toUpperCase()}</strong>
          </p>
          <DownloadZip className="my-3" eventCode={eventCode} />
          {eventData?.event && (
            <>
              {console.log("📦 Storage Data → used:", eventData.event.usedStorage, "limit:", eventData.event.storageLimit)}
              <StorageBar used={eventData.event.usedStorage} limit={eventData.event.storageLimit} />
            </>
          )}
          {daysLeft !== null && (
            <p
              className={`mt-2 text-xs font-semibold flex flex-col text-center md:flex-row gap-1 items-center ${
                daysLeft <= 15 ? "text-yellow-400" : "text-white"
              }`}
            >
              <Hourglass size={14} />
              {t("countdown", { daysLeft, plural })}
            </p>
          )}
        </div>
        

        <h2 className="flex flex-col sm:flex-row items-center justify-center gap-3 text-white text-center text-xl sm:text-3xl font-semibold">
          <PartyPopper size={20} /> {t("title")} <b>{eventData?.event?.eventName}</b>
        </h2>
  
        <div className="event-info relative rounded-lg bg-gray-800 w-full text-center flex flex-col items-start text-white max-w-[21em] gap-3">
          <Image src={CardImg} alt="logo" className="rounded-t-lg h-[10em] object-cover" />
          <h3 className="flex gap-3 font-bold text-lg text-white px-5">
            <BadgeInfo />{t("subtitle")}
          </h3>
          <div className="info-text w-full flex flex-col items-start gap-2 px-5 pb-3">
            <section className="text-slate-50 text-md flex items-center">
              <Button className="pl-0" variant="tertiary" iconLeft={<Calendar color="white" size={18} />} />
              {new Date(eventData?.event?.eventDate || "").toLocaleDateString()}
            </section>
            <section className="text-slate-50 text-md flex items-center">
              <Button className="pl-0" variant="tertiary" iconLeft={<SmilePlus color="white" size={18} />} />
              {eventData?.event?.hostFullName}
            </section>
            <section className="text-slate-50 text-sm flex items-center">
              <Button className="pl-0" variant="tertiary" iconLeft={<Mail color="white" size={18} />} />
              {eventData?.event?.hostEmail}
            </section>
          </div>
        </div>
  
        <Divider width="quarter" border={true} />
  
        {eventData?.event && (
          <QRCodeTabs eventData={{ event: { hostLink: eventData.event.hostLink, guestLink: eventData.event.guestLink } }} />
        )}
  
        <Divider width="quarter" border={true} />
  
        <PhotoGallery photos={eventData?.event?.photos || []} />
  
        <Divider width="full" border={true} />
  
        <GuestList guests={eventData?.event?.guests || []} eventCode={eventCode} />
  
        <Divider width="full" border={true} />

        <EventStats
          totalGuests={eventData?.event?.guests?.length || 0}
          totalPhotos={eventData?.event?.photos?.length || 0}
        />  
        
        <Divider width="full" border={true} />
  
        <ImageCarousel
          images={["/wedding-poster.png", "/birthday-poster.png"]}
        />
      </div>
    </>
  );
}
