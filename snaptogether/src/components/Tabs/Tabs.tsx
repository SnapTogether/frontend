"use client"

import type React from "react"

import { useState } from "react"

export type Tab = {
  id: string
  label: string
  content: React.ReactNode
}

export default function Tabs({ tabs }: { tabs: Tab[] }) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || "")

  return (
    <div className="w-full">
      <div className="relative right-0">
        <ul className="relative flex flex-wrap px-1.5 py-1.5 list-none rounded-md bg-slate-100" role="tablist">
          {tabs.map((tab) => (
            <li key={tab.id} className="z-30 flex-auto text-center">
              <button
                className={`z-30 flex items-center justify-center w-full px-0 py-2 text-sm mb-0 transition-all ease-in-out border-0 rounded-md cursor-pointer ${
                  activeTab === tab.id ? "text-slate-900 bg-white shadow-md" : "text-slate-600 hover:text-slate-800"
                }`}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={tab.id}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="pt-5">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              id={tab.id}
              role="tabpanel"
              className={`${activeTab === tab.id ? "block opacity-100" : "hidden opacity-0"}`}
            >
              {tab.content}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
