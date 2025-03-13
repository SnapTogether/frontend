"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchEventForHost, EventResponse } from "@/api/event";
import dynamic from "next/dynamic";
const QRCodeCanvas = dynamic(async () => {
  const mod = await import("qrcode.react");
  return mod.QRCodeCanvas; // ✅ Correctly return named export
}, { ssr: false });
import Image from "next/image";
import Button from "@/components/Button/Button";
import { Calendar, Download, Link, Mail, SmilePlus, UserRound } from "lucide-react";
import { downloadQR } from "@/utils/qrCode";
import Navbar from "@/components/Navbar/Navbar";
import DownloadZip from "@/components/DownloadZip/DownloadZip";
import CardImg from '../../../../../../public/bg3.jpg'
import PhotoGallery from "@/components/PhotoGallery/PhotoGallery";
import GuestList from "@/components/GuestList/GuestList";
import Loader from "@/components/Loader/Loader";
import QRCodeTabs from "@/components/QRCodeTabs/QRCodeTabs";
import { Divider } from "@/components/Divider/Divider";

export default function HostDashboard() {
  const params = useParams();
  const eventCode = params.eventCode as string;
  const hostCode = params.hostCode as string;

  const [eventData, setEventData] = useState<EventResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const photosPerPage = 20;

  useEffect(() => {
    if (!eventCode || !hostCode) return;

    const fetchEvent = async () => {
      setLoading(true);
      setError("");

      const response = await fetchEventForHost(eventCode, hostCode, currentPage, photosPerPage);

      if (response.status !== 200) {
        setError(response.message);
      } else {
        setEventData(response);
        setTotalPages(response.event?.pagination?.totalPages || 1);
        console.log("📨 Total Pages:", response.event?.pagination?.totalPages);
      }

      setLoading(false);
    };

    fetchEvent();
  }, [eventCode, hostCode, currentPage]); // ✅ Now it refetches when `currentPage` changes!


  if (loading)
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        <Loader />
      </div>
    );
  if (error) return <p style={{ color: "red" }}>{error}</p>;


  return (
    <>
      <Navbar />
      <div className="relative mt-20 flex flex-col items-center gap-8 p-6">
        <DownloadZip className="absolute top-0 right-[10%]" eventCode={eventCode} />
        <h2 className="text-white text-center text-3xl font-semibold">🎉 Host Dashboard for <b>{eventData?.event?.eventName}</b></h2>
        <div className="event-info rounded-lg bg-gray-800 w-full text-center flex flex-col items-start text-white max-w-[21em] gap-3">
          <Image src={CardImg} alt="logo" className="rounded-t-lg h-[10em] object-cover" />
          <h3 className="text-lg text-white px-5">Event Details</h3>
          <div className="info-text w-full flex flex-col items-start gap-2 px-5 pb-3">

            <section className="text-slate-50 text-md sm:text-md flex items-center justify-between"><Button className="pl-0" variant="tertiary" iconLeft={<Calendar color="white" size={18} />} /> {new Date(eventData?.event?.eventDate || "").toLocaleDateString()}</section>
            <section className="text-slate-50 text-md sm:text-md flex items-center justify-between"><Button className="pl-0" variant="tertiary" iconLeft={<SmilePlus color="white" size={18} />} /> {eventData?.event?.hostFullName}</section>
            <section className="text-slate-50 text-md sm:text-md flex items-center justify-between"><Button className="pl-0" variant="tertiary" iconLeft={<Mail color="white" size={18} />} /> {eventData?.event?.hostEmail}</section>
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

        <Divider width="quarter" border={false}/>

        <GuestList guests={eventData?.event?.guests || []} eventCode={eventCode}/>

      </div>
    </>
  );
}
