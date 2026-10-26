import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../../contexts/language-context.jsx";
import {
  getCategories,
  normalizeCategory,
} from "../../../lib/furnicase-api.js";

function Category() {
  const { t, language } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [rotatedArrow, setRotatedArrow] = useState(null);
  const [headingVisible, setHeadingVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState(() => new Set());
  const sectionRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    async function loadCategories() {
      setIsLoading(true);
      setApiError("");

      try {
        const response = await getCategories();
        if (!isMounted) return;
        setCategories(
          Array.isArray(response) ? response.map(normalizeCategory) : []
        );
      } catch {
        if (isMounted) {
          setCategories([]);
          setApiError(
            language === "ar"
              ? "تعذر تحميل الفئات من الخادم."
              : "Categories could not be loaded from the live API."
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadCategories();
    return () => {
      isMounted = false;
    };
  }, [language]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || isLoading) return;

    const heading = section.querySelector(".category-heading");
    const cards = [...section.querySelectorAll(".category-card")];

    if (!("IntersectionObserver" in window)) {
      setHeadingVisible(true);
      setVisibleCards(new Set(categories.map((_, index) => index)));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          if (entry.target.classList.contains("category-heading")) {
            setHeadingVisible(true);
          } else {
            const index = Number(entry.target.dataset.categoryIndex);
            setVisibleCards((current) => new Set(current).add(index));
          }

          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -24px 0px" }
    );

    if (heading) observer.observe(heading);
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [categories, isLoading]);

  function selectCategory(category) {
    window.dispatchEvent(
      new CustomEvent("furnicasa:category-filter", {
        detail: category.filter,
      })
    );
  }

  return (
    <section ref={sectionRef} className="category-section" id="categories">
      <div className={`category-heading ${headingVisible ? "is-visible" : ""}`}>
        <div>
          <h2>{t("shopByCategory")}</h2>
          <p>{t("categoryDescription")}</p>
        </div>

        <a className="category-see-all" href="#categories">
          {t("seeAll")} <span aria-hidden="true">→</span>
        </a>
      </div>

      <div className="category-grid">
        {isLoading ? (
          <p className="category-data-status" role="status">{t("loadingCategories")}</p>
        ) : categories.length === 0 ? (
          <p className="category-data-status" role="status">
            {apiError || t("noCategoriesFound")}
          </p>
        ) : (
          categories.map((category, index) => {
            const name = language === "ar" ? category.nameAr : category.nameEn;
            const tagline = language === "ar" ? category.taglineAr : category.taglineEn;

            return (
              <article
                className={`category-card ${visibleCards.has(index) ? "is-visible" : ""}`}
                data-category-index={index}
                key={category.id}
              >
                <div className="category-image-wrap">
                  {category.image ? (
                    <img src={category.image} alt={name} />
                  ) : (
                    <span className="category-image-placeholder">{t("imageUnavailable")}</span>
                  )}
                </div>

                <div className="category-card-footer">
                  <div>
                    <h3>{name}</h3>
                    {tagline && <p className="category-card-tagline">{tagline}</p>}
                  </div>

                  <button
                    className={`category-arrow ${rotatedArrow === category.id ? "is-rotated" : ""}`}
                    type="button"
                    aria-label={name}
                    aria-pressed={rotatedArrow === category.id}
                    onClick={() => {
                      setRotatedArrow((current) => (current === category.id ? null : category.id));
                      selectCategory(category);
                    }}
                  >
                    <svg className="category-arrow-icon" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 2.5 14.4 9.6 21.5 12l-7.1 2.4L12 21.5l-2.4-7.1L2.5 12l7.1-2.4L12 2.5Z" />
                      <circle cx="12" cy="12" r="1.2" fill="#fffaf4" />
                    </svg>
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

export default Category;
