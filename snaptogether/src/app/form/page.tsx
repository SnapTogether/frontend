'use client'
import Button from "@/components/Button/Button";
import ConfettiBackground from "@/components/ConfettiBackground/FireworksBackground";
import EventForm from "@/components/Form/Form";
import { ParticlesBackground } from "@/components/ParticlesBackground/ParticlesBackground";
import Gif from '../../../public/snaptogether.gif'
import Image from "next/image";


export default function FormPage() {
    

    return (
        <div className="relative w-screen h-screen">
            <Image src={Gif} alt="snaptogether" className="absolute top-0 left-0 w-full h-full object-cover opacity-95" />
            <div className="logo-footer select-none absolute left-1/2 transform -translate-x-1/2 bottom-4 z-10 text-center text-[40px] sm:text-[46px] rounded-md m-0" style={{ fontFamily: "var(--font-fleur-de-leah)" }}>
                Snaptogether
            </div>
            <EventForm/> 
        </div> 
    );
}
