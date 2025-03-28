import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion"; // ✅ Import Framer Motion
import Button from "../Button/Button"; // Replace with your actual Button component
import { downloadQR } from "@/utils/qrCode";
import { useTranslations } from "next-intl";

interface EventData {
    event: {
        hostLink: string;
        guestLink: string;
    };
}

export default function QRCodeTabs({ eventData }: { eventData: EventData }) {
    const [activeTab, setActiveTab] = useState<"host" | "guest">("host");
    const t = useTranslations();

    return (
        <div className="container mx-auto w-full flex flex-col items-center">
            {/* Tabs Navigation */}
            <div className="flex w-full justify-around max-w-[50vh] gap-2">
                {/* <Button
                    className={`px-4 py-2 text-base sm:text-lg font-medium transition-all duration-300 ease-in-out ${
                        activeTab === "host" ? " !text-white" : "!text-gray-500 bg-slate-200/5"
                    }`}
                    onClick={() => setActiveTab("host")}
                >
                    {t("qrBtn.host")}
                </Button>
                <Button
                    className={`px-4 py-2 text-base sm:text-lg font-medium transition-all duration-300 ease-in-out ${
                        activeTab === "guest" ? " !text-white" : "!text-gray-500 bg-slate-200/5"
                    }`}
                    onClick={() => setActiveTab("guest")}
                >
                    {t("qrBtn.guest")}
                </Button> */}
            </div>
            <h3 className="text-white text-xl md:text-2xl font-semibold my-5 flex items-center justify-center gap-3 capitalize font-mulish"> 
                {t("qrBtn.guest")}
            </h3>
            {/* QR Code Content with Smooth Transition */}
            <div className="flex flex-col justify-center items-center gap-4 mt-4 w-full">
                <AnimatePresence mode="wait">
                    {activeTab === "host" ? (
                        <motion.div
                            key="host"
                            initial={{ opacity: 0, x: -50 }} // ✅ Smooth fade & slide in from left
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }} // ✅ Slide out to the right
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="w-full text-center flex flex-col justify-center items-center gap-4"
                        >
                            {/* <strong className="flex flex-row items-center gap-3"><Pin size={20}/> Host Link </strong> */}
                            {/* <a
                                href={eventData?.event?.hostLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline break-words"
                            >
                                {eventData?.event?.hostLink}
                            </a> */}
                            <div className="flex relative mt-2">
                                <QRCodeCanvas id="hostQR" size={200} value={eventData?.event?.hostLink || ""} />
                                <Button
                                    onClick={() => downloadQR(eventData?.event?.hostLink || "", "hostQR")}
                                    className="h-fit w-fit text-sm text-white bg-transparent px-2 py-1 rounded-md absolute left-full"
                                    iconRight={<Download size={20} />}
                                />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="guest"
                            initial={{ opacity: 0, x: 50 }} // ✅ Smooth fade & slide in from right
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }} // ✅ Slide out to the left
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="w-full text-center flex flex-col justify-center items-center gap-4"
                        >
                             {/* <strong className="flex flex-row items-center gap-3"><Pin size={20}/> Guest Link </strong> */}
                            {/* <a
                                href={eventData?.event?.guestLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 underline break-words"
                            >
                                {eventData?.event?.guestLink}
                            </a> */}
                            <div className="flex relative mt-2">
                                <QRCodeCanvas id="guestQR" size={200} value={eventData?.event?.guestLink || ""} />
                                <Button
                                    onClick={() => downloadQR(eventData?.event?.guestLink || "", "guestQR")}
                                    className="h-fit w-fit text-sm text-white bg-transparent px-2 py-1 rounded-md absolute left-full"
                                    iconRight={<Download size={20} />}
                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
