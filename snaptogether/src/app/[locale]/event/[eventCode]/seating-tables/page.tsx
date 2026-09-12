"use client";

import { FormEvent, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import seatingTables from "@/data/seatingTables.json";
import styles from "./SeatingTables.module.css";

type SeatingGuest = {
  name: string;
  table: number | string;
};

type SeatingGuestEntry = SeatingGuest & {
  id: string;
  order: number;
};

type SeatingEvent = {
  title: string;
  guests: SeatingGuest[];
};

type SeatingData = {
  events: Record<string, SeatingEvent>;
};

const data = seatingTables as SeatingData;
const DEFAULT_EVENT_CODE = "wedding-md";

function normalizeValue(value: string) {
  return value
    .trim()
    .toLocaleLowerCase("sq-AL")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getTableSortValue(table: SeatingGuest["table"]) {
  if (typeof table === "number") {
    return table;
  }

  const normalizedTable = normalizeValue(table);

  if (normalizedTable.includes("главна") || normalizedTable.includes("main")) {
    return -1;
  }

  const parsedTable = Number(table);

  return Number.isFinite(parsedTable) ? parsedTable : Number.MAX_SAFE_INTEGER;
}

function sortByTable(a: SeatingGuestEntry, b: SeatingGuestEntry) {
  return getTableSortValue(a.table) - getTableSortValue(b.table) || a.order - b.order;
}

function getTableDisplay(table: SeatingGuest["table"], tableLabel: string) {
  return typeof table === "number" ? `${tableLabel} ${table}` : table;
}

export default function SeatingTablesPage() {
  const params = useParams<{ eventCode: string }>();
  const t = useTranslations("seatingTables");
  const eventCode = String(params.eventCode || DEFAULT_EVENT_CODE);
  const eventData = data.events[eventCode] || data.events[DEFAULT_EVENT_CODE];

  const [query, setQuery] = useState("");
  const [selectedGuest, setSelectedGuest] = useState<SeatingGuestEntry | null>(null);

  const guests = useMemo(
    () =>
      eventData.guests
        .map((guest, index) => ({
          ...guest,
          id: `${eventCode}-${index}`,
          order: index,
        }))
        .sort(sortByTable),
    [eventCode, eventData.guests],
  );
  const normalizedQuery = normalizeValue(query);
  const tableSearchAliases = useMemo(() => [t("table"), t("tableLabel"), "table", "маса"], [t]);

  const searchResults = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    return guests.filter((guest) => {
      const normalizedName = normalizeValue(guest.name);
      const normalizedTable = normalizeValue(String(guest.table));
      const tableDisplay = normalizeValue(getTableDisplay(guest.table, t("tableLabel")));
      const matchesTable = tableSearchAliases.some((alias) =>
        normalizeValue(`${alias} ${guest.table}`).includes(normalizedQuery),
      );

      return normalizedName.includes(normalizedQuery)
        || matchesTable
        || tableDisplay.includes(normalizedQuery)
        || normalizedTable === normalizedQuery;
    });
  }, [guests, normalizedQuery, tableSearchAliases, t]);

  const groupedGuests = useMemo(() => {
    return guests.reduce<Array<{ table: SeatingGuest["table"]; guests: SeatingGuestEntry[] }>>((groups, guest) => {
      const currentGroup = groups[groups.length - 1];

      if (!currentGroup || currentGroup.table !== guest.table) {
        groups.push({ table: guest.table, guests: [guest] });
      } else {
        currentGroup.guests.push(guest);
      }

      return groups;
    }, []);
  }, [guests]);

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
        <header className={styles.header}>
          <h1 className={styles.brand}>{eventData.title}</h1>
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
                  key={guest.id}
                >
                  <span className={styles.resultName}>{guest.name}</span>
                  <span className={styles.resultTable}>
                    {getTableDisplay(guest.table, t("tableLabel"))}
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
          {groupedGuests.map(({ table, guests: groupGuests }) => (
            <div key={String(table)}>
              <h2 className={styles.tableTitle}>{getTableDisplay(table, t("table"))}</h2>
              <ul className={styles.guestList}>
                {groupGuests.map((guest) => {
                  const isHighlighted = searchResults.some((result) => result.id === guest.id);

                  return (
                    <li key={guest.id}>
                      <button
                        className={styles.guestButton}
                        type="button"
                        onClick={() => setSelectedGuest(guest)}
                      >
                        <span className={`${styles.guestName} ${isHighlighted ? styles.highlight : ""}`}>
                          {guest.name}
                        </span>
                        <span className={styles.guestTable}>
                          {getTableDisplay(guest.table, t("tableLabel"))}
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
              <p className={`${styles.seatNumber} ${typeof selectedGuest.table === "number" ? "" : styles.seatName}`}>
                {selectedGuest.table}
              </p>
              {typeof selectedGuest.table === "number" ? <p className={styles.seatLabel}>{t("table")}</p> : null}
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
