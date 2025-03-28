import { downloadQR } from "@/utils/qrCode";
import { useTranslations } from "next-intl";

interface EventData {
    event: {
        hostLink: string;
        guestLink: string;
    };
}

export default function QRCodeTabs({ eventData }: { eventData: EventData }) {
    // const [activeTab, setActiveTab] = useState<"host" | "guest">("host");
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
        </div>
    );
}
