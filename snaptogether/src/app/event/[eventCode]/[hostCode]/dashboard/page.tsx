import {redirect} from "next/navigation";
import {routing} from "@/i18n/routing";

type PageProps = {
  params: Promise<{
    eventCode: string;
    hostCode: string;
  }>;
};

export default async function LegacyHostDashboardPage({params}: PageProps) {
  const {eventCode, hostCode} = await params;

  redirect(`/${routing.defaultLocale}/event/${eventCode}/${hostCode}/dashboard`);
}
