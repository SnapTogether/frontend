import {redirect} from "next/navigation";
import {routing} from "@/i18n/routing";

type PageProps = {
  params: Promise<{
    eventCode: string;
    guestId: string;
  }>;
};

export default async function LegacyGuestPhotosPage({params}: PageProps) {
  const {eventCode, guestId} = await params;

  redirect(`/${routing.defaultLocale}/event/${eventCode}/guest/${guestId}`);
}
