import Link from "next/link";
import { usePathname } from "next/navigation";
import albania from '../../../public/albania.png';
import macedonia from '../../../public/republicofmacedonia.png';
import uk from '../../../public/unitedkingdom.png';
import turkey from '../../../public/turkey.png';

import Image from "next/image";

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const pathname = usePathname();

  // ✅ Extract and remove the existing locale from the URL
  const segments = pathname.split("/").filter(Boolean); // Remove empty segments
  const pathWithoutLocale = `/${segments.slice(1).join("/")}`; // Remove locale from URL

  return (
    <div className={`flex items-center space-x-4 ${className || ""}`}>
      <Link href={`/en${pathWithoutLocale}`} className="text-white text-center"><Image src={uk} alt="uk" width={32} height={32} /> EN</Link>
      <Link href={`/mk${pathWithoutLocale}`} className="text-white text-center"><Image src={macedonia} alt="macedonia" width={32} height={32} /> MK</Link>
      <Link href={`/sq${pathWithoutLocale}`} className="text-white text-center"><Image src={albania} alt="albania" width={32} height={32} /> SQ</Link>
      <Link href={`/tr${pathWithoutLocale}`} className="text-white text-center"><Image src={turkey} alt="turkey" width={32} height={32} /> TR</Link>
    </div>
  );
}
