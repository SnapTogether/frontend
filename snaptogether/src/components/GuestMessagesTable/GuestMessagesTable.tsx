"use client";

import React, { useRef, useState } from "react";
import { Inbox, ChevronDown, ChevronUp } from "lucide-react";
import { Divider } from "../Divider/Divider";

export interface GuestMessageItem {
  guestName: string;
  messages: string[];
}

interface GuestMessagesTableProps {
  data: GuestMessageItem[];
}

const GuestMessagesTable: React.FC<GuestMessagesTableProps> = ({ data }) => {
  const [panelOpen, setPanelOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [openGuestIndex, setOpenGuestIndex] = useState<number | null>(null);

  const guestsPerPage = 20;
  const totalPages = Math.ceil(data.length / guestsPerPage);

  const indexOfLastGuest = currentPage * guestsPerPage;
  const indexOfFirstGuest = indexOfLastGuest - guestsPerPage;
  const currentGuests = data.slice(indexOfFirstGuest, indexOfLastGuest);

  const scrollRef = useRef<HTMLDivElement>(null);

  const toggleGuest = (index: number) => {
    setOpenGuestIndex(openGuestIndex === index ? null : index);
  };

  const togglePanel = () => {
    setPanelOpen(!panelOpen);
    setOpenGuestIndex(null); // reset open guest when collapsing the whole panel
  };

  if (!data.length) {
    return <p className="text-gray-300 text-center">No guest messages yet.</p>;
  }

  return (
    <div className={`w-full container mx-auto flex flex-col transition-all duration-300 ${panelOpen ? "gap-8" : "gap-0"} bg-white/5 rounded-lg border border-slate-500 border-opacity-60 p-6 backdrop-blur-sm shadow-md`}>
      <button
        onClick={togglePanel}
        className="w-full flex items-center justify-between text-white text-md font-semibold"
      >
        <div className="flex items-center gap-2">
          <Inbox size={20} /> ({data.length}) Guest Messages
        </div>
        {panelOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>

      <div
        className={`transition-max-height duration-500 ease-in-out overflow-hidden ${
          panelOpen ? "max-h-[2000px]" : "max-h-0"
        }`}
      >
        <div className="flex flex-col gap-4">
          {currentGuests.map((guest, idx) => {
            const isOpen = openGuestIndex === idx;

            return (
              <div key={idx} className="bg-gray-800/50 rounded-lg p-4">
                <button
                  onClick={() => toggleGuest(idx)}
                  className="w-full text-white flex justify-between items-center"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-white text-[#1c1c1c] flex items-center justify-center font-bold text-xs uppercase">
                      {guest.guestName?.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">{guest.guestName}</span>
                  </div>
                  {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                <div
                  className={`transition-max-height duration-500 ease-in-out overflow-hidden ${
                    isOpen ? "max-h-[500px] mt-4" : "max-h-0"
                  }`}
                >
                  {guest.messages.length ? (
                    <ul className="space-y-2 text-slate-300 text-sm">
                      {guest.messages.map((msg, i) => (
                        <div
                          key={i}
                          className="message relative bg-gray-700 min-h-[3em] p-1 rounded-lg flex items-center text-center justify-center shadow-md"
                          >
                          <p className="text-white text-md">{msg}</p>
                        </div>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-400 mt-2">No messages from this guest.</p>
                  )}
                  <Divider className="my-4 mx-auto" width="half" border={true} />
                </div>
              </div>
            );
          })}

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center items-center gap-2">
              {Array.from({ length: totalPages }).map((_, index) => (
                <span
                  key={index}
                  className={`w-3 h-3 rounded-full inline-block cursor-pointer transition-all duration-300 ${
                    currentPage === index + 1 ? "bg-white" : "bg-gray-500"
                  }`}
                  onClick={() => {
                    setCurrentPage(index + 1);
                    setOpenGuestIndex(null);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GuestMessagesTable;
