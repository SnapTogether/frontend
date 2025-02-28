'use client'
import Button from "@/components/Button/Button";
import ConfettiBackground from "@/components/ConfettiBackground/ConfettiBackground";
import EventForm from "@/components/Form/Form";
import { ParticlesBackground } from "@/components/ParticlesBackground/ParticlesBackground";


export default function FormPage() {
    

    return (
        <div className="relative w-screen h-screen">
            <ParticlesBackground/>
            <EventForm/>
        </div>
    );
}
