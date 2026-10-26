import { useEffect, useRef } from "react";
import { useLanguage } from "../../../contexts/language-context.jsx";

const aboutBanner = "/assets/about-us-banner.webp";

const highlights = [
  {
    icon: "design",
    titleKey: "thoughtfulDesign",
    descriptionKey: "thoughtfulDesignDescription",
  },
  {
    icon: "quality",
    titleKey: "qualityFirst",
    descriptionKey: "qualityFirstDescription",
  },
  {
    icon: "living",
    titleKey: "madeForLiving",
    descriptionKey: "madeForLivingDescription",
  },
];

function AboutIcon({ name }) {
  const paths = {
    design: (
      <>
        <path d="M4 7.5 12 3l8 4.5-8 4.5-8-4.5Z" />
        <path d="m4 12 8 4.5 8-4.5M4 16.5l8 4.5 8-4.5" />
      </>
    ),
    quality: (
      <>
        <path d="m12 3 2.2 2.1 3-.2.9 2.9 2.4 1.8-1.4 2.7.7 2.9-2.8 1.1-1.1 2.8-3-.7L10 20l-2.2-2.1-3 .2-.9-2.9-2.4-1.8 1.4-2.7-.7-2.9L5 6.7l1.1-2.8 3 .7L12 3Z" />
        <path d="m8.5 11.8 2.2 2.2 4.8-5" />
      </>
    ),
    living: (
      <>
        <path d="m3 11 9-7 9 7" />
        <path d="M5.5 9.5V20h13V9.5M9.5 20v-5h5v5" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function About() {
  const { t } = useLanguage();
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const targets = section.querySelectorAll(
      "[data-scroll-reveal]:not(.is-visible)"
    );

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -35px 0px",
      }
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="about-section"
      id="about"
      aria-labelledby="about-title"
    >
      <div
        className="about-banner scroll-reveal scroll-reveal-up"
        data-scroll-reveal
      >
        <img className="about-banner-image" src={aboutBanner} alt="" />
        <div className="about-banner-overlay" aria-hidden="true" />

        <div
          className="about-banner-content scroll-reveal scroll-reveal-left"
          data-scroll-reveal
        >
          <h2 id="about-title">
            {t("about")} <span className="about-title-accent">{t("aboutAccent")}</span>
          </h2>
          <p>{t("aboutDescription")}</p>
        </div>
      </div>

      <div className="about-highlights">
        {highlights.map((highlight, index) => (
          <article
            className="about-highlight-card scroll-reveal scroll-reveal-up"
            data-scroll-reveal
            style={{ "--reveal-delay": `${index * 100}ms` }}
            key={highlight.titleKey}
          >
            <span className="about-highlight-icon">
              <AboutIcon name={highlight.icon} />
            </span>
            <div>
              <h3>{t(highlight.titleKey)}</h3>
              <p>{t(highlight.descriptionKey)}</p>
            </div>
          </article>
        ))}
      </div>

      <div
        className="about-story scroll-reveal scroll-reveal-up"
        data-scroll-reveal
      >
        <div className="about-story-copy">
          <span className="about-story-kicker">{t("aboutStoryKicker")}</span>
          <h3>{t("aboutStoryTitle")}</h3>
          <p>{t("aboutStoryDescription")}</p>
        </div>
        <div className="about-story-note">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3.5 14.2 9l5.8.5-4.4 3.8 1.3 5.7-4.9-3-4.9 3 1.3-5.7L4 9.5 9.8 9 12 3.5Z" />
          </svg>
          <span>{t("aboutStoryNote")}</span>
        </div>
      </div>
    </section>
  );
}

export default About;
