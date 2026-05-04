"use client";

import { FormEvent, useMemo, useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import seatingTables from "@/data/seatingTables.json";
import styles from "./SeatingTables.module.css";

type SeatingGuest = {
  name: string;
  table: number;
};

type SeatingEvent = {
  title: string;
  guests: SeatingGuest[];
};

type SeatingData = {
  events: Record<string, SeatingEvent>;
};

const data = seatingTables as SeatingData;

function normalizeValue(value: string) {
  return value
    .trim()
    .toLocaleLowerCase("mk-MK")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getSurnameInitial(name: string) {
  const parts = name.trim().split(/\s+/);
  const surname = parts[parts.length - 1] || name;

  return surname.charAt(0).toLocaleUpperCase("mk-MK");
}

function sortBySurname(a: SeatingGuest, b: SeatingGuest) {
  const aParts = a.name.trim().split(/\s+/);
  const bParts = b.name.trim().split(/\s+/);
  const aSurname = aParts[aParts.length - 1] || a.name;
  const bSurname = bParts[bParts.length - 1] || b.name;

  return aSurname.localeCompare(bSurname, "mk-MK") || a.name.localeCompare(b.name, "mk-MK");
}

export default function SeatingTablesPage() {
  const params = useParams<{ eventCode: string }>();
  const t = useTranslations("seatingTables");
  const eventCode = String(params.eventCode || "default");
  const eventData = data.events[eventCode] || data.events.default;

  const [query, setQuery] = useState("");
  const [selectedGuest, setSelectedGuest] = useState<SeatingGuest | null>(null);

  const guests = useMemo(() => [...eventData.guests].sort(sortBySurname), [eventData.guests]);
  const normalizedQuery = normalizeValue(query);
  const tableSearchAliases = useMemo(() => [t("table"), t("tableLabel"), "table"], [t]);

  const searchResults = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    return guests.filter((guest) => {
      const normalizedName = normalizeValue(guest.name);
      const matchesTable = tableSearchAliases.some((alias) =>
        normalizeValue(`${alias} ${guest.table}`).includes(normalizedQuery),
      );

      return normalizedName.includes(normalizedQuery)
        || matchesTable
        || String(guest.table) === normalizedQuery;
    });
  }, [guests, normalizedQuery, tableSearchAliases]);

  const groupedGuests = useMemo(() => {
    return guests.reduce<Record<string, SeatingGuest[]>>((groups, guest) => {
      const initial = getSurnameInitial(guest.name);

      if (!groups[initial]) {
        groups[initial] = [];
      }

      groups[initial].push(guest);

      return groups;
    }, {});
  }, [guests]);

  const groupedEntries = Object.entries(groupedGuests).sort(([a], [b]) => a.localeCompare(b, "mk-MK"));
  const firstResult = searchResults[0];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (firstResult) {
      setSelectedGuest(firstResult);
    }
  };

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <div className={styles.phoneBar} aria-hidden="true">
          <span>13:43</span>
          <span className={styles.statusIcons}>
            <span>5G</span>
            <span className={styles.signal}>
              <span />
              <span />
              <span />
            </span>
            <span className={styles.battery}>
              <span className={styles.batteryFill} />
            </span>
          </span>
        </div>

        <header className={styles.header}>
          <h1 className={styles.brand}>{eventData.title}</h1>
          <button className={styles.menuButton} type="button" aria-label={t("openMenu")}>
            <Menu size={18} strokeWidth={1.6} />
          </button>
        </header>

        <form className={styles.searchRow} onSubmit={handleSubmit}>
          <label className={styles.searchBox}>
            <span className="sr-only">{t("searchLabel")}</span>
            <input
              className={styles.searchInput}
              type="search"
              placeholder={t("searchPlaceholder")}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
            />
            {query ? (
              <button
                className={styles.iconButton}
                type="button"
                onClick={() => setQuery("")}
                aria-label={t("clearSearch")}
              >
                <X size={16} />
              </button>
            ) : null}
            <Search size={17} aria-hidden="true" />
          </label>
          <p className={styles.tableHint}>{t("tableLabel")}</p>
        </form>

        {normalizedQuery ? (
          <>
            <p className={styles.summaryPill}>{t("resultsCount", { count: searchResults.length })}</p>

            {searchResults.length > 0 ? (
              searchResults.map((guest) => (
                <button
                  className={styles.resultButton}
                  type="button"
                  onClick={() => setSelectedGuest(guest)}
                  key={guest.name}
                >
                  <span className={styles.resultName}>{guest.name}</span>
                  <span className={styles.resultTable}>
                    {t("tableLabel")} {guest.table}
                  </span>
                </button>
              ))
            ) : (
              <div className={styles.emptyState}>
                <p>{t("noResults")}</p>
              </div>
            )}
          </>
        ) : (
          <p className={styles.summaryPill}>{t("defaultSubtitle")}</p>
        )}

        <section className={styles.list} aria-label={t("guestListLabel")}>
          {groupedEntries.map(([initial, groupGuests]) => (
            <div key={initial}>
              <h2 className={styles.letter}>{initial}</h2>
              <ul className={styles.guestList}>
                {groupGuests.map((guest) => {
                  const isHighlighted = searchResults.some((result) => result.name === guest.name);

                  return (
                    <li key={guest.name}>
                      <button
                        className={styles.guestButton}
                        type="button"
                        onClick={() => setSelectedGuest(guest)}
                      >
                        <span className={`${styles.guestName} ${isHighlighted ? styles.highlight : ""}`}>
                          {guest.name}
                        </span>
                        <span className={styles.guestTable}>
                          {t("tableLabel")} {guest.table}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </section>
      </div>

      {selectedGuest ? (
        <div className={styles.backdrop} role="dialog" aria-modal="true" aria-labelledby="seat-modal-title">
          <div className={styles.modal}>
            <p className={styles.modalTitleSmall}>{eventData.title}</p>
            <h2 className={styles.modalTitle} id="seat-modal-title">
              {t("foundSeat")}
            </h2>
            <div className={styles.seatCard}>
              <p className={styles.modalGuest}>{selectedGuest.name}</p>
              <p className={styles.seatNumber}>{selectedGuest.table}</p>
              <p className={styles.seatLabel}>{t("table")}</p>
            </div>
            <button className={styles.okButton} type="button" onClick={() => setSelectedGuest(null)}>
              {t("ok")}
            </button>
          </div>
        </div>
      ) : null}
    </main>
  );
}
