import React, { useState } from "react";
import Button from "@/components/Button/Button";
import { ContactRound, Users } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface Guest {
  _id: string;
  guestName: string;
}

interface GuestListProps {
  guests: Guest[];
  eventCode: string;
}

const GuestList: React.FC<GuestListProps> = ({ guests, eventCode }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const guestsPerPage = 10;
  const totalPages = Math.ceil(guests.length / guestsPerPage);

  const indexOfLastGuest = currentPage * guestsPerPage;
  const indexOfFirstGuest = indexOfLastGuest - guestsPerPage;
  const currentGuests = guests.slice(indexOfFirstGuest, indexOfLastGuest);

  const t = useTranslations("guestList");

  return (
    <div className="guests text-center flex flex-col gap-4 w-full">
      <h3 className="text-white text-2xl md:text-2xl font-semibold flex flex-row items-center justify-center gap-3"><Users size={20} /> {t("title")}</h3>
      {guests.length > 0 ? (
        <>
          <ul className="w-full mx-auto container border border-slate-500/50 rounded-lg overflow-hidden">
            {currentGuests.map((guest) => (
              <li
                key={guest._id}
                className="cursor-pointer flex flex-row items-center justify-between text-xl text-left px-3 py-2 text-slate-200 
                  border-b border-slate-500/50 last:border-none hover:bg-slate-200/5 transition-all duration-300 ease-in-out"
              >
                {/* ✅ Use Link for navigation instead of router.push */}
                <Link href={`/event/${eventCode}/guest/${guest._id}`}  className="flex w-full justify-between items-center">
                  <p>{guest.guestName}</p>
                  <Button iconRight={<ContactRound color="white" size={20} />} variant="tertiary" />
                </Link>
              </li>
            ))}
          </ul>

          {guests.length > guestsPerPage && 
            <div className="mt-4 flex justify-center items-center gap-2">

              {Array.from({ length: totalPages }).map((_, index) => (
                <span
                  key={index}
                  className={`w-3 h-3 rounded-full inline-block cursor-pointer transition-all duration-300 ${
                    currentPage === index + 1 ? "bg-white" : "bg-gray-500"
                  }`}
                  onClick={() => setCurrentPage(index + 1)}
                />
              ))}
            </div>
          }
        </>
      ) : (
        <p className="mt-2 text-gray-400">{t("noGuests")}</p>
      )}
    </div>
  );
};

export default GuestList;