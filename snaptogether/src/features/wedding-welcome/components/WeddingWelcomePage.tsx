import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Armchair, Camera } from "lucide-react";
import albania from "../../../../public/albania.png";
import macedonia from "../../../../public/republicofmacedonia.png";
import turkey from "../../../../public/turkey.png";
import uk from "../../../../public/unitedkingdom.png";
import styles from "./WeddingWelcomePage.module.css";

const languages = [
  { code: "en", label: "EN", flag: uk, alt: "United Kingdom flag" },
  { code: "mk", label: "MK", flag: macedonia, alt: "Macedonia flag" },
  { code: "sq", label: "SQ", flag: albania, alt: "Albania flag" },
  { code: "tr", label: "TR", flag: turkey, alt: "Turkey flag" },
];

export function WeddingWelcomePage() {
  const locale = useLocale();
  const t = useTranslations("weddingWelcome");
  const galleryHref = `https://www.snaptogether.cloud/${locale}/event/0bdb65/guest`;
  const seatingHref = `/${locale}/event/aulona-visar/seating-tables`;
  const activeLanguage = languages.find((language) => language.code === locale) ?? languages[0];
  const inactiveLanguages = languages.filter((language) => language.code !== locale);

  return (
    <main className={styles.page}>
      <div className={styles.texture} aria-hidden="true" />
      <div className={styles.shadowTop} aria-hidden="true" />
      <div className={styles.shadowBottom} aria-hidden="true" />

      <section className={styles.content} aria-labelledby="wedding-welcome-title">
        <details className={styles.languageDropdown}>
          <summary className={styles.languageTrigger} aria-label={t("languageLabel")}>
            <Image
              src={activeLanguage.flag}
              alt={activeLanguage.alt}
              width={24}
              height={24}
              className={styles.languageFlag}
            />
            <span>{activeLanguage.label}</span>
          </summary>

          <nav className={styles.languageMenu} aria-label={t("languageLabel")}>
            {inactiveLanguages.map((language) => (
              <Link
                key={language.code}
                href={`/${language.code}/wedding-welcome`}
                className={styles.languageOption}
              >
              <Image
                src={language.flag}
                alt={language.alt}
                width={24}
                height={24}
                className={styles.languageFlag}
              />
              {language.label}
              </Link>
            ))}
          </nav>
        </details>

        <h1
          id="wedding-welcome-title"
          className={styles.title}
          aria-label={t("titleAria")}
        >
          <span>{t("welcomeTo")}</span>
          <strong>
            {t("our")}
            <br />
            {t("wedding")}
          </strong>
        </h1>

        <div className={styles.heartDivider} aria-hidden="true">
          <span />
          <i />
          <span />
        </div>

        <nav className={styles.actions} aria-label="Wedding guest options">
          <a href={galleryHref} className={styles.primaryAction}>
            <Camera className={styles.actionIcon} strokeWidth={1.8} aria-hidden="true" />
            <span className={styles.actionDivider} aria-hidden="true" />
            <span className={styles.actionLabel}>{t("viewGallery")}</span>
          </a>
          <Link href={seatingHref} className={styles.secondaryAction}>
            <Armchair className={styles.actionIcon} strokeWidth={1.65} aria-hidden="true" />
            <span className={styles.actionDivider} aria-hidden="true" />
            <span className={styles.actionLabel}>{t("findMyTable")}</span>
          </Link>
        </nav>

        <footer className={styles.brand} aria-label="SnapTogether">
          <Image
            className={styles.brandLogo}
            src="/logo/snaptogether-logo-text.svg"
            alt="SnapTogether"
            width={402}
            height={239}
          />
        </footer>
      </section>
    </main>
  );
}
