import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../../contexts/language-context.jsx";
import {
  getMaterials,
  normalizeMaterial,
} from "../../../lib/furnicase-api.js";

const materialBanner = "/assets/materials-banner.webp";

function MaterialBanner() {
  const { t, language } = useLanguage();
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const sectionRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function loadMaterials() {
      setIsLoading(true);
      setApiError("");

      try {
        const response = await getMaterials();
        if (!isMounted) return;
        setMaterials(
          Array.isArray(response)
            ? response.map(normalizeMaterial).sort((a, b) => a.sortOrder - b.sortOrder)
            : []
        );
      } catch {
        if (isMounted) {
          setMaterials([]);
          setApiError(
            language === "ar"
              ? "تعذر تحميل المواد من الخادم."
              : "Materials could not be loaded from the live API."
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadMaterials();
    return () => {
      isMounted = false;
    };
  }, [language]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const targets = section.querySelectorAll(
      "[data-scroll-reveal]:not(.is-visible)"
    );

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -35px 0px",
      }
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [materials, isLoading]);

  return (
    <section ref={sectionRef} className="materials-section" id="materials">
      <div
        className="materials-banner scroll-reveal scroll-reveal-up"
        data-scroll-reveal
      >
        <img className="materials-banner-image" src={materialBanner} alt="" />
        <div className="materials-banner-overlay" aria-hidden="true" />

        <div
          className="materials-banner-content scroll-reveal scroll-reveal-left"
          data-scroll-reveal
        >
          <h2 id="materials-title">
            {t("our")}{" "}
            <span className="materials-title-accent">{t("materials")}</span>
          </h2>
          <p>{t("materialsDescription")}</p>
        </div>
      </div>

      <div className="materials-benefits">
        <article
          className="materials-benefit-card scroll-reveal scroll-reveal-up"
          data-scroll-reveal
          style={{ "--reveal-delay": "0ms" }}
        >
          <svg
            className="materials-benefit-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M20.5 3.5C11 3.7 5.1 6.4 4 12.2c-.7 3.7 2.1 6.2 5.4 5.2 5.3-1.6 8.4-7.4 11.1-13.9Z" />
            <path d="M3.5 21c2.2-5.1 5.5-8.5 10.2-11.5" />
          </svg>
          <div>
            <h3>{t("sustainableEcoFriendly")}</h3>
            <p>{t("sustainableDescription")}</p>
          </div>
        </article>

        <article
          className="materials-benefit-card scroll-reveal scroll-reveal-up"
          data-scroll-reveal
          style={{ "--reveal-delay": "100ms" }}
        >
          <svg
            className="materials-benefit-icon"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 2.5 20 5v6.2c0 5.2-3.4 8.5-8 10.3-4.6-1.8-8-5.1-8-10.3V5l8-2.5Z" />
            <path d="M12 7v9m-3-4h6" />
          </svg>
          <div>
            <h3>{t("builtToLast")}</h3>
            <p>{t("builtToLastDescription")}</p>
          </div>
        </article>
      </div>

      <div className="materials-grid">
        {isLoading ? (
          <p className="materials-data-status" role="status">{t("loadingMaterials")}</p>
        ) : materials.length === 0 ? (
          <p className="materials-data-status" role="status">
            {apiError || t("noMaterialsFound")}
          </p>
        ) : (
          materials.map((material, index) => {
            const name = language === "ar" ? material.nameAr : material.nameEn;
            const description = language === "ar" ? material.descriptionAr : material.descriptionEn;

            return (
              <article
                className="material-card scroll-reveal scroll-reveal-up"
                data-scroll-reveal
                style={{ "--reveal-delay": `${index * 75}ms` }}
                key={material.id}
              >
                <div className="material-card-image">
                  {material.image ? (
                    <img src={material.image} alt={name} />
                  ) : (
                    <span className="material-image-placeholder">{t("imageUnavailable")}</span>
                  )}
                </div>
                <div className="material-card-copy">
                  <h3>{name}</h3>
                  <p>{description}</p>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

export default MaterialBanner;
