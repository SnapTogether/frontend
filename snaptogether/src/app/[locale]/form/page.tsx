'use client'
import EventForm from "@/components/Form/Form";
import Link from "next/link";

export default function FormPage() {


    return (
        <div
            className="relative w-screen h-screen bg-cover bg-center opacity-95"
            style={{ backgroundImage: "url('/snaptogether.gif')" }}
        >
            <EventForm />
            <Link
                href="/"
                className="text-slate-200 pt-4 flex items-center justify-center w-full logo-footer z-10 select-none text-center text-[40px] sm:text-[46px] rounded-md m-0"
                style={{
                    fontFamily: "var(--font-gochi-hand)",
                    paddingBottom: "env(safe-area-inset-bottom)"
                }}
            >
                Snaptogether
            </Link>
        </div>
    );
}
