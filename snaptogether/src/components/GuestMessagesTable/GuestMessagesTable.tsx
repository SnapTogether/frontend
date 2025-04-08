"use client";

import React from "react";
import { Inbox, Mail } from "lucide-react";
import { Divider } from "../Divider/Divider";

export interface GuestMessageItem {
    guestName: string;
    messages: string[];
}

interface GuestMessagesTableProps {
    data: GuestMessageItem[];
}

const GuestMessagesTable: React.FC<GuestMessagesTableProps> = ({ data }) => {
    if (!data.length) {
        return <p className="text-gray-300 text-center">No guest messages yet.</p>;
    }

    return (
        <div className="w-full container mx-auto bg-white/5 rounded-lg border border-slate-500 border-opacity-60 p-6 backdrop-blur-sm shadow-md">
            <h3 className="text-md text-white font-semibold mb-4 flex items-center justify-center gap-2">
                <Inbox size={20} />({data.length}) Guest Messages 
            </h3>
            <div className="">
                {data.map((guest, idx) => (
                    <div key={idx} className="">
                        
                        <h4 className="mb-2 text-center text-white font-medium text-sm flex items-center justify-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-white text-[#1c1c1c] flex items-center justify-center font-bold text-xs uppercase">
                            {guest.guestName?.charAt(0)}
                        </div>
                        {guest.guestName}
                        </h4>

                        {guest.messages.length ? (
                            <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm">
                                {guest.messages.map((msg, i) => (
                                        <div
                                            key={i}
                                            className="message relative bg-gray-800 min-h-[3em] p-1 rounded-full flex items-center text-center justify-center shadow-md"
                                        >
                                            <p className="text-white text-md">{msg}</p>
                                        </div>
                                ))}

                            </ul>
                            
                        ) : (
                            <p className="text-sm text-gray-400">No messages from this guest.</p>
                        )}
                        <Divider className="my-4 mx-auto" width="half" border={true}/>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GuestMessagesTable;
