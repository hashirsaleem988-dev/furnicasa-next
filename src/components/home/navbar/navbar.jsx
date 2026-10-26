import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../../contexts/language-context.jsx";
import { useInquiry } from "../../../contexts/inquiry-context.jsx";

function Navbar() {
  const [showSearch, setShowSearch] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState("home");
  // Keep the first render identical on the server and in the browser.
  // The real scroll position is applied after hydration in the effect below.
  const [isAtTop, setIsAtTop] = useState(true);
  const [headerVisible, setHeaderVisible] = useState(true);

  const lastScrollY = useRef(0);
  const headerHoveredRef = useRef(false);
  const searchInputRef = useRef(null);
  const { language, setLanguage, t } = useLanguage();
  const { inquiryCount } = useInquiry();

  useEffect(() => {
    const initialScrollY = window.scrollY;
    lastScrollY.current = initialScrollY;
    setIsAtTop(initialScrollY <= 8);
    setHeaderVisible(initialScrollY <= 8);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const atTop = currentScrollY <= 8;
      const scrollingUp = currentScrollY < lastScrollY.current;

      setIsAtTop(atTop);
      setHeaderVisible(atTop || scrollingUp || headerHoveredRef.current);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (showSearch) {
      searchInputRef.current?.focus();
    }
  }, [showSearch]);

  useEffect(() => {
    if (!showMenu) return;

    const closeMenuOnEscape = (event) => {
      if (event.key === "Escape") setShowMenu(false);
    };

    window.addEventListener("keydown", closeMenuOnEscape);
    return () => window.removeEventListener("keydown", closeMenuOnEscape);
  }, [showMenu]);

  function handleSearchSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const query = String(new FormData(form).get("query") || "").trim();

    if (!query) {
      searchInputRef.current?.focus();
      return;
    }

    window.dispatchEvent(
      new CustomEvent("furnicasa:search", { detail: query })
    );

    form.reset();
    setShowSearch(false);

    const storeSection = document.getElementById("store");

    if (storeSection) {
      storeSection.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.assign("/store");
    }
  }

  function openInquiry() {
    const inquirySection = document.getElementById("inquiry");

    if (inquirySection) {
      inquirySection.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.location.assign("/store#inquiry");
    }
  }

  function closeMenu() {
    setShowMenu(false);
  }

  return (
    <>
      {!headerVisible && !isAtTop && (
        <div
          className="site-header-reveal-zone"
          aria-hidden="true"
          onMouseEnter={() => setHeaderVisible(true)}
        />
      )}
      <header
        className={`site-header ${headerVisible ? "is-visible" : "is-hidden"} ${
          isAtTop ? "is-at-top" : ""
        }`}
        onMouseEnter={() => {
          headerHoveredRef.current = true;
          setHeaderVisible(true);
        }}
        onMouseLeave={() => {
          headerHoveredRef.current = false;
          if (window.scrollY > 8) setHeaderVisible(false);
        }}
      >
        <a className="brand" href="/" aria-label="FurniCasa home">
          <img className="brand-icon" src="/sofa-logo-brown.png" alt="" />
          <span className="brand-name">
            <span className="brand-furni">Furni</span>
            <span className="brand-casa">Casa</span>
          </span>
        </a>

        <nav className="main-nav" aria-label={t("mainNavigation")}>
          <a href="/">{t("home")}</a>
          <a href="/store">{t("store")}</a>
          <a href="/materials">{t("materials")}</a>
          <a href="/#about">{t("aboutUs")}</a>
          <a href="/contact">{t("contactUs")}</a>
        </nav>

        <div className="nav-actions">
          <button
            className="language-toggle"
            type="button"
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
          >
            {language === "en" ? t("arabic") : t("english")}
          </button>

          <form
            className={`search-control ${showSearch ? "is-open" : ""}`}
            role="search"
            onSubmit={handleSearchSubmit}
          >
            <input
              ref={searchInputRef}
              id="nav-search-input"
              name="query"
              className="search-input"
              type="search"
              placeholder={t("searchFurniture")}
              aria-label={t("searchFurniture")}
              aria-hidden={!showSearch}
              tabIndex={showSearch ? 0 : -1}
              onKeyDown={(event) => {
                if (event.key === "Escape") setShowSearch(false);
              }}
            />

            <button
              className="search-button"
              type={showSearch ? "submit" : "button"}
              aria-label={t(showSearch ? "searchProducts" : "openSearch")}
              aria-expanded={showSearch}
              aria-controls="nav-search-input"
              onClick={() => {
                if (!showSearch) setShowSearch(true);
              }}
            >
              <svg className="search-icon" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="10.5" cy="10.5" r="5.7" />
                <path d="m14.8 14.8 4.4 4.4" />
              </svg>
            </button>
          </form>

          <button
            className="nav-icon-button nav-inquiry-button"
            type="button"
            aria-label={`${t("inquiryList")}: ${inquiryCount}`}
            onClick={openInquiry}
          >
            <svg
              className="nav-icon inquiry-icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <rect x="5" y="4.5" width="14" height="16" rx="2" />
              <path d="M9 4.5V3h6v1.5M9 10h6M9 14h6M9 18h3" />
            </svg>

            {inquiryCount > 0 && (
              <span className="nav-inquiry-count" aria-live="polite">
                {inquiryCount}
              </span>
            )}
          </button>

          <button
            className="nav-icon-button menu-button"
            type="button"
            aria-label={t("menu")}
            aria-expanded={showMenu}
            aria-controls="site-menu-panel"
            onClick={() => setShowMenu((open) => !open)}
          >
            <svg className="nav-icon menu-icon" viewBox="0 0 24 24" aria-hidden="true">
              {showMenu ? (
                <path d="m6 6 12 12M18 6 6 18" />
              ) : (
                <path d="M4.5 7h15M4.5 12h15M4.5 17h15" />
              )}
            </svg>
          </button>
        </div>

        {showMenu && (
          <nav
            className="nav-menu-panel"
            id="site-menu-panel"
            aria-label={t("mainNavigation")}
          >
            <a href="/" onClick={closeMenu}>{t("home")}</a>
            <a href="/store" onClick={closeMenu}>{t("store")}</a>
            <a href="/materials" onClick={closeMenu}>{t("materials")}</a>
            <a href="/#about" onClick={closeMenu}>{t("aboutUs")}</a>
            <a href="/contact" onClick={closeMenu}>{t("contactUs")}</a>
          </nav>
        )}
      </header>

      <nav className="mobile-bottom-nav" aria-label={t("mobileNavigation")}>
        <a
          href="/"
          className={`mobile-tab ${
            activeMobileTab === "home" ? "is-active" : ""
          }`}
          onClick={() => setActiveMobileTab("home")}
        >
          <svg className="mobile-tab-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="m3 10 9-7 9 7" />
            <path d="M5.5 9v11h13V9M9.5 20v-6h5v6" />
          </svg>
          <span>{t("home")}</span>
        </a>

        <a
          href="/store"
          className={`mobile-tab ${
            activeMobileTab === "shop" ? "is-active" : ""
          }`}
          onClick={() => setActiveMobileTab("shop")}
        >
          <svg className="mobile-tab-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 8h14l-1 12H6L5 8Z" />
            <path d="M9 8V6a3 3 0 0 1 6 0v2" />
          </svg>
          <span>{t("shop")}</span>
        </a>

        <a
          href="/materials"
          className={`mobile-tab ${
            activeMobileTab === "materials" ? "is-active" : ""
          }`}
          onClick={() => setActiveMobileTab("materials")}
        >
          <svg className="mobile-tab-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.5 3.5C12 3.5 5 6.7 5 13a5.5 5.5 0 0 0 5.5 5.5c6.3 0 10-7 10-15Z" />
            <path d="M4 21 15.5 9.5" />
          </svg>
          <span>{t("materials")}</span>
        </a>

        <a
          href="#wishlist"
          className={`mobile-tab ${
            activeMobileTab === "wishlist" ? "is-active" : ""
          }`}
          onClick={() => setActiveMobileTab("wishlist")}
        >
          <svg className="mobile-tab-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.8 8.8c0 5.2-8.8 10-8.8 10s-8.8-4.8-8.8-10a4.6 4.6 0 0 1 8.8-1.8 4.6 4.6 0 0 1 8.8 1.8Z" />
          </svg>
          <span>{t("wishlist")}</span>
        </a>

        <a
          href="#profile"
          className={`mobile-tab ${
            activeMobileTab === "profile" ? "is-active" : ""
          }`}
          onClick={() => setActiveMobileTab("profile")}
        >
          <svg className="mobile-tab-icon" viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="12" cy="8" r="4" />
            <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
          </svg>
          <span>{t("profile")}</span>
        </a>
      </nav>
    </>
  );
}

export default Navbar;
