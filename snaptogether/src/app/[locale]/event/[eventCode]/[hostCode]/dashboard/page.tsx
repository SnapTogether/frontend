"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchEventForHost, EventResponse } from "@/api/event";
import Image from "next/image";
import Button from "@/components/Button/Button";
import { BadgeInfo, Calendar, ChevronDown, FolderClosed, Hourglass, Mail, PartyPopper, SmilePlus } from "lucide-react";
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
import clsx from "clsx";
import Footer from "@/app/[locale]/footer/page";
import GuestMessagesTable from "@/components/GuestMessagesTable/GuestMessagesTable";

export default function HostDashboard() {
  const params = useParams();
  const eventCode = params.eventCode as string;
  const hostCode = params.hostCode as string;

  const [eventData, setEventData] = useState<EventResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [daysLeft, setDaysLeft] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1)
  const [totalPhotos, setTotalPhotos] = useState(1);

  const photosPerPage = 20;

  const plural = daysLeft !== 1 ? "s" : "";
  const [openOverview, setOpenOverview] = useState(false);

  const guestIdMap: Record<string, string> =
    eventData?.event?.guests?.reduce((acc, guest) => {
      acc[guest.guestName] = guest._id;
      return acc;
    }, {} as Record<string, string>) || {};


  const guestsWithMessages =
    eventData?.event?.guests?.filter((guest) => guest.messages?.length > 0) || [];

  const t = useTranslations("dashboard");

  useEffect(() => {
    if (!eventCode || !hostCode) return;

    socket.on("connect", () => {
      console.log("✅ WebSocket Connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ WebSocket Disconnected");
    });

    socket.emit("join", `host-${eventCode}`);

    const fetchEvent = async () => {
      setLoading(true);
      setError("");

      const response = await fetchEventForHost(eventCode, hostCode, currentPage, photosPerPage);

      if (response.status !== 200) {
        setError(response.message);
      } else {
        setEventData(response);
        // ✅ INSERT GUEST MESSAGE LOG HERE
        setTotalPages(response.event?.pagination?.totalPages || 1);
        setTotalPhotos(response.event?.pagination?.totalPhotos || 0);

        response.event?.guests?.forEach((guest) => {
          guest.messages.forEach((msg) => {
            console.log(`- ${msg}`);
          });
        });
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

    socket.on("photoUploaded", (data: { eventCode: string; images: { photoId: string; imageUrl: string }[] }) => {
      if (data.eventCode === eventCode) {
        console.log("📥 New images received via WebSocket:", data);
        fetchEvent(); // ✅ Fetches updated photos + usedStorage from backend
      }
    });

    // 🧠 Add real-time message listener
    socket.on("newMessage", (data: { guestId: string; guestName: string; message: string }) => {

      setEventData((prev) => {
        if (!prev || !prev.event) return prev;

        const updatedGuests = prev.event.guests.map((guest) => {
          if (guest._id === data.guestId) {
            return {
              ...guest,
              messages: [...guest.messages, data.message], // 👈 append the message
            };
          }
          return guest;
        });

        return {
          ...prev,
          event: {
            ...prev.event,
            guests: updatedGuests,
          },
        };
      });
    });


    socket.on("messageDeleted", ({ guestId, text }) => {
      setEventData((prev) => {
        if (!prev?.event) return prev;
    
        const updatedGuests = prev.event.guests.map((guest) => {
          if (guest._id === guestId) {
            return {
              ...guest,
              messages: guest.messages.filter((msg) => msg !== text),
            };
          }
          return guest;
        });
    
        return {
          ...prev,
          event: {
            ...prev.event,
            guests: updatedGuests,
          },
        };
      });
    });
    

    fetchEvent();

    return () => {
      socket.off("photoUploaded"); // ✅ Cleanup WebSocket listener when component unmounts
      socket.off("newMessage");
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
      <div className="relative mt-20 flex flex-col items-center gap-8 p-6 container mx-auto pb-[180px]">
        <div className="w-full max-w-md">
          <button
            onClick={() => setOpenOverview((prev) => !prev)}
            className="flex items-center justify-between w-full text-white bg-gray-700 px-4 py-2 rounded transition-colors"
          >
            <span className="flex flex-row gap-4 items-center"><FolderClosed size={20} /> {t("eventOverview")}</span>
            <ChevronDown
              className={clsx(
                "transition-transform duration-300",
                openOverview && "rotate-180"
              )}
            />
          </button>

          <div
            className={clsx(
              "transition-all duration-500 ease-in-out overflow-hidden",
              openOverview ? "max-h-[500px] opacity-100 mt-3" : "max-h-0 opacity-0"
            )}
          >
            <div className="flex flex-col items-center gap-1">
              <p className="text-sm text-white">
                {t("plan")}: <strong>{eventData?.event?.plan.toUpperCase()}</strong>
              </p>

              <DownloadZip className="my-3" eventCode={eventCode} />

              {eventData?.event && (
                <>
                  <StorageBar used={eventData.event.usedStorage} limit={eventData.event.storageLimit} />
                </>
              )}

              {daysLeft !== null && (
                <p
                  className={`mt-2 text-xs font-semibold flex flex-col text-center md:flex-row gap-1 items-center ${daysLeft <= 15 ? "text-yellow-400" : "text-white"
                    }`}
                >
                  <Hourglass size={14} />
                  {t("countdown", { daysLeft, plural })}
                </p>
              )}
            </div>
          </div>
        </div>

        <h2 className="flex flex-col md:flex-row items-center justify-center gap-3 text-white text-center text-xl sm:text-3xl font-semibold">
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

        <Divider width="full" border={true} />

        {eventData?.event && (
          <QRCodeTabs eventData={{ event: { hostLink: eventData.event.hostLink, guestLink: eventData.event.guestLink } }} />
        )}

        <Divider width="full" border={true} />

        <PhotoGallery
          photos={eventData?.event?.photos || []}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          totalPhotos={totalPhotos}
        />

        <Divider width="full" border={true} />

        <GuestList guests={eventData?.event?.guests || []} eventCode={eventCode} />

        <Divider width="full" border={true} />

        <EventStats
          totalGuests={eventData?.event?.guests?.length || 0}
          totalPhotos={totalPhotos}
        />

        <Divider width="full" border={true} />

        <GuestMessagesTable
          key={
            guestsWithMessages
              .map((g) => `${g._id}-${g.messages.join("").length}`)
              .join(",") || "default"
          }
          data={guestsWithMessages.map((guest) => ({
            guestName: guest.guestName,
            messages: guest.messages,
          }))}
          eventCode={eventCode}
          guestIdMap={guestIdMap}
        />






        <Divider width="full" border={true} />

        <ImageCarousel
          images={["/wedding.png", "/birthday-poster.png"]}
        />

        <Footer />
      </div>
    </>
  );
}
