import {redirect} from "next/navigation";
import {routing} from "@/i18n/routing";

type PageProps = {
  params: Promise<{
    eventCode: string;
  }>;
};

export default async function LegacySeatingTablesPage({params}: PageProps) {
  const {eventCode} = await params;

  redirect(`/${routing.defaultLocale}/event/${eventCode}/seating-tables`);
}
