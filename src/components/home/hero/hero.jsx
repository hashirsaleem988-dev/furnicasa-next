import { useLanguage } from "../../../contexts/language-context.jsx";

const heroImage = "/assets/hero-living-room.webp";

function Hero() {
  const { t } = useLanguage();

  return (
    <section className="hero" id="home">
      <img
        className="hero-image"
        src={heroImage}
        alt={t("heroImageAlt")}
      />

      <div className="hero-content">
        <div className="hero-brand"></div>

        <p className="hero-kicker">{t("heroKicker")}</p>

        <h1>
          <span className="hero-title-beige">{t("heroFurniture")}</span>
          <br />
          <span className="hero-title-white">{t("heroFor")}</span>{" "}
          <span className="hero-title-beige">{t("heroModernLiving")}</span>
        </h1>

        <p className="hero-description">{t("heroDescription")}</p>

        <div className="hero-actions">
          <a className="hero-button primary-button" href="/store">
            {t("shopNow")} <span aria-hidden="true">→</span>
          </a>

          <a className="hero-button secondary-button" href="/materials">
            {t("exploreCollection")}
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
