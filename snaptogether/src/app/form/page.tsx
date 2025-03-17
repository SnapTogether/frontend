'use client'
import EventForm from "@/components/Form/Form";
import Gif from '../../../public/snaptogether.gif'
import Image from "next/image";
import Link from "next/link";


export default function FormPage() {
    

    return (
        <div className="relative w-screen h-screen">
            <Image src={Gif} alt="snaptogether" className="absolute top-0 left-0 w-full h-full object-cover opacity-95" />
            <Link href='/' className="text-slate-200 logo-footer select-none absolute left-1/2 transform -translate-x-1/2 bottom-2 z-10 text-center text-[40px] sm:text-[46px] rounded-md m-0" style={{ fontFamily: "var(--font-gochi-hand)" }}>
                Snaptogether
            </Link>
            <EventForm/> 
        </div> 
    );
}
