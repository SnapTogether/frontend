import Link from "next/link";
import { usePathname } from "next/navigation";

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const pathname = usePathname();

  // ✅ Extract and remove the existing locale from the URL
  const segments = pathname.split("/").filter(Boolean); // Remove empty segments
  const currentLocale = segments[0]; // First segment is the locale
  const pathWithoutLocale = `/${segments.slice(1).join("/")}`; // Remove locale from URL

  return (
    <div className={`flex space-x-4 ${className || ""}`}>
      <Link href={`/en${pathWithoutLocale}`} className="text-white">🇬🇧 EN</Link>
      <Link href={`/mk${pathWithoutLocale}`} className="text-white">🇲🇰 MK</Link>
      <Link href={`/sq${pathWithoutLocale}`} className="text-white">🇦🇱 SQ</Link>
    </div>
  );
}
