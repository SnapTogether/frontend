import { Download } from "lucide-react";
import Button from "../Button/Button"; // Replace with your actual Button component
import { useTranslations } from "next-intl";
import QRCodeWithLogo from "./QRCodeWithLogo";
import { useRef } from "react";
import type { QRCodeWithLogoRef } from "./QRCodeWithLogo";

interface EventData {
    event: {
        hostLink: string;
        guestLink: string;
    };
}

export default function QRCodeTabs({ eventData }: { eventData: EventData }) {
    // const [activeTab, setActiveTab] = useState<"host" | "guest">("host");
    const t = useTranslations();
    const qrRef = useRef<QRCodeWithLogoRef>(null);

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

                <div className="flex relative mt-2">
                <QRCodeWithLogo
                ref={qrRef}
                value={eventData?.event?.guestLink || ""}
                logoImage="/logo/snaptogether-peach-logo.png"
                />

                <Button
                onClick={() => qrRef.current?.download("guestQR")}
                className="h-fit w-fit text-sm text-white bg-transparent px-2 py-1 rounded-md absolute left-full"
                iconRight={<Download size={20} />}
                />

                </div>
            </div>
        </div>
    );
}
