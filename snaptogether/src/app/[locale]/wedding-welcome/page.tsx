import type { Metadata } from "next";
import { WeddingWelcomePage } from "@/features/wedding-welcome";

export const metadata: Metadata = {
  title: "Wedding Welcome | SnapTogether",
  description: "Welcome guests to your wedding and guide them to the gallery or seating page.",
};

export default function Page() {
  return <WeddingWelcomePage />;
}
