"use client";

import { useLanguage } from "../../../contexts/language-context.jsx";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div className="footer-top">
          <section className="footer-intro" aria-labelledby="footer-brand-title">
            <a className="footer-brand" href="/" id="footer-brand-title">
              <img src="/sofa-logo-brown.png" alt="" />
              <span>
                <span className="footer-brand-furni">Furni</span>
                <span className="footer-brand-casa">Casa</span>
              </span>
            </a>
            <p>{t("footerDescription")}</p>
            <a className="footer-inquiry-link" href="/store#inquiry">
              {t("footerStartInquiry")}
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </a>
          </section>

          <nav className="footer-links" aria-label={t("footerExplore")}>
            <h2>{t("footerExplore")}</h2>
            <a href="/">{t("home")}</a>
            <a href="/store">{t("store")}</a>
            <a href="/materials">{t("materials")}</a>
            <a href="/about">{t("aboutUs")}</a>
            <a href="/contact">{t("contactUs")}</a>
          </nav>

          <section className="footer-contact" aria-labelledby="footer-contact-title">
            <h2 id="footer-contact-title">{t("footerContact")}</h2>
            <a href={`mailto:${t("contactEmail")}`}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="m4 7 8 6 8-6" />
              </svg>
              <span>{t("contactEmail")}</span>
            </a>
            <a href={`tel:${t("contactPhone").replace(/\s/g, "")}`}>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M7 3h3l1.5 4-2 1.5a13 13 0 0 0 6 6l1.5-2 4 1.5v3c0 1.1-.9 2-2 2C11.8 19 5 12.2 5 4.9 5 3.9 5.9 3 7 3Z" />
              </svg>
              <span>{t("contactPhone")}</span>
            </a>
            <a href="/contact">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 21s7-6.1 7-12a7 7 0 1 0-14 0c0 5.9 7 12 7 12Z" />
                <circle cx="12" cy="9" r="2.2" />
              </svg>
              <span>{t("contactAddress")}</span>
            </a>
          </section>
        </div>

        <div className="footer-bottom">
          <p>© FurniCasa — {t("footerRights")}</p>
          <a href="/contact">{t("contactUs")}</a>
        </div>
      </div>
    </footer>
  );
}
