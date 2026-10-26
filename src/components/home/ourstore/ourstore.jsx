import { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "../../../contexts/language-context.jsx";
import { useInquiry } from "../../../contexts/inquiry-context.jsx";
import {
  getProducts,
  normalizeProduct,
} from "../../../lib/furnicase-api.js";

const storeBanner = "/assets/our-store-banner.webp";

function formatPrice(value, language) {
  return `PKR ${new Intl.NumberFormat(
    language === "ar" ? "ar-PK" : "en-PK"
  ).format(value)}`;
}

function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function OurStore() {
  const { t, language } = useLanguage();
  const { inquiryItems, addToInquiry } = useInquiry();

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const storeRef = useRef(null);
  const sortMenuRef = useRef(null);
  const sortTriggerRef = useRef(null);

  const storeCategories = useMemo(() => {
    const categories = products.reduce((items, product) => {
      if (!items.some((item) => item.value === product.category)) {
        items.push({
          value: product.category,
          labelEn: product.category,
          labelAr: product.categoryAr || product.category,
        });
      }
      return items;
    }, []);

    return [
      { value: "All", labelEn: "All", labelAr: "الكل" },
      ...categories,
    ];
  }, [products]);

  const sortLabel = language === "ar" ? "ترتيب حسب" : "Sort by";

  const sortOptions = [
    {
      value: "featured",
      label: language === "ar" ? "المميز" : "Featured",
    },
    {
      value: "price-low-high",
      label: language === "ar" ? "السعر: من الأقل للأعلى" : "Price: Low to High",
    },
    {
      value: "price-high-low",
      label: language === "ar" ? "السعر: من الأعلى للأقل" : "Price: High to Low",
    },
    {
      value: "name",
      label: language === "ar" ? "الاسم: أ إلى ي" : "Name: A to Z",
    },
  ];

  const selectedSort = sortOptions.find((option) => option.value === sortBy);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      setIsLoading(true);
      setApiError("");

      try {
        const response = await getProducts();
        if (!isMounted) return;
        setProducts(
          Array.isArray(response) ? response.map(normalizeProduct) : []
        );
      } catch {
        if (isMounted) {
          setProducts([]);
          setApiError(
            language === "ar"
              ? "تعذر تحميل المنتجات من الخادم."
              : "Products could not be loaded from the live API."
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadProducts();
    return () => {
      isMounted = false;
    };
  }, [language]);

  const categoryProducts =
    activeCategory === "All"
      ? products
      : products.filter(
          (product) =>
            product.category === activeCategory ||
            slugify(product.category) === slugify(activeCategory)
        );

  const locale = language === "ar" ? "ar" : "en";
  const searchTerm = searchQuery.toLocaleLowerCase(locale);

  const matchingProducts = categoryProducts.filter((product) => {
    const productName = language === "ar" ? product.nameAr : product.nameEn;
    const categoryName = language === "ar" ? product.categoryAr : product.category;
    const searchableText = [
      productName,
      categoryName,
      product.descriptionEn,
      product.descriptionAr,
    ];

    return searchableText.some((value) =>
      value.toLocaleLowerCase(locale).includes(searchTerm)
    );
  });

  const visibleProducts = [...matchingProducts].sort((a, b) => {
    if (sortBy === "price-low-high") {
      return a.priceValue - b.priceValue;
    }

    if (sortBy === "price-high-low") {
      return b.priceValue - a.priceValue;
    }

    if (sortBy === "name") {
      const aName = language === "ar" ? a.nameAr : a.nameEn;
      const bName = language === "ar" ? b.nameAr : b.nameEn;
      return aName.localeCompare(bName, locale);
    }

    return Number(b.isFeatured) - Number(a.isFeatured);
  });

  useEffect(() => {
    function handleNavbarSearch(event) {
      const query =
        typeof event.detail === "string" ? event.detail.trim() : "";

      setSearchInput(query);
      setSearchQuery(query);
      setActiveCategory("All");
    }

    function handleCategoryFilter(event) {
      const filter = typeof event.detail === "string" ? event.detail : "";
      const matchingCategory = storeCategories.find(
        (category) =>
          category.value === filter || slugify(category.value) === slugify(filter)
      );

      setActiveCategory(matchingCategory?.value || filter || "All");
      document.getElementById("store")?.scrollIntoView({ behavior: "smooth" });
    }

    window.addEventListener("furnicasa:search", handleNavbarSearch);
    window.addEventListener("furnicasa:category-filter", handleCategoryFilter);

    return () => {
      window.removeEventListener("furnicasa:search", handleNavbarSearch);
      window.removeEventListener("furnicasa:category-filter", handleCategoryFilter);
    };
  }, [storeCategories]);

  useEffect(() => {
    const section = storeRef.current;
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
  }, [activeCategory, searchQuery, products, isLoading]);

  useEffect(() => {
    if (!showSortMenu) return;

    function closeOnOutsideClick(event) {
      if (!sortMenuRef.current?.contains(event.target)) {
        setShowSortMenu(false);
      }
    }

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        setShowSortMenu(false);
        sortTriggerRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", closeOnOutsideClick);
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [showSortMenu]);

  function handleSearch(event) {
    event.preventDefault();
    setSearchQuery(searchInput.trim());
  }

  const emptyMessage =
    apiError ||
    (language === "ar"
      ? "لا توجد منتجات متاحة من الكتالوج المباشر حاليًا."
      : "No products are currently available from the live catalog.");

  return (
    <section ref={storeRef} className="our-store-section" id="store">
      <div
        className="our-store-banner scroll-reveal scroll-reveal-up"
        data-scroll-reveal
      >
        <img className="our-store-image" src={storeBanner} alt="" />
        <div className="our-store-overlay" aria-hidden="true" />

        <div className="our-store-layout">
          <div
            className="our-store-content scroll-reveal scroll-reveal-left"
            data-scroll-reveal
          >
            <p className="our-store-kicker">{t("storeKicker")}</p>

            <h2>
              {t("our")}{" "}
              <span className="our-store-title-accent">{t("store")}</span>
            </h2>

            <p className="our-store-description">{t("storeDescription")}</p>

            <form
              className="our-store-search"
              role="search"
              onSubmit={handleSearch}
            >
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder={t("searchFurniture")}
                aria-label={t("searchFurniture")}
              />

              <button type="submit" aria-label={t("search")}>
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="10.5" cy="10.5" r="5.7" />
                  <path d="m14.8 14.8 4.4 4.4" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      <nav className="store-filter-bar" aria-label={t("furnitureCategories")}>
        {storeCategories.map((category) => (
          <button
            className={`store-filter-button ${
              activeCategory === category.value ? "is-active" : ""
            }`}
            type="button"
            key={category.value}
            aria-pressed={activeCategory === category.value}
            onClick={() => setActiveCategory(category.value)}
          >
            {language === "ar" ? category.labelAr : category.labelEn}
          </button>
        ))}
      </nav>

      <div className="store-sort-bar" dir={language === "ar" ? "rtl" : "ltr"}>
        <span className="store-sort-label">{sortLabel}</span>

        <div className="store-sort-control" ref={sortMenuRef}>
          <button
            ref={sortTriggerRef}
            className="store-sort-trigger"
            type="button"
            aria-haspopup="menu"
            aria-expanded={showSortMenu}
            aria-controls="store-sort-options"
            aria-label={`${sortLabel}: ${selectedSort?.label}`}
            onClick={() => setShowSortMenu((open) => !open)}
          >
            <span>{selectedSort?.label}</span>

            <svg
              className="store-sort-chevron"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M12 4v15m-6-6 6 6 6-6" />
            </svg>
          </button>

          {showSortMenu && (
            <div
              className="store-sort-options"
              id="store-sort-options"
              role="menu"
              aria-label={sortLabel}
            >
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  className={`store-sort-option ${
                    sortBy === option.value ? "is-selected" : ""
                  }`}
                  type="button"
                  role="menuitemradio"
                  aria-checked={sortBy === option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setShowSortMenu(false);
                    sortTriggerRef.current?.focus();
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="store-product-section">
        {isLoading ? (
          <p className="store-data-status" role="status">
            {t("loadingProducts")}
          </p>
        ) : (
          <div className="store-product-grid">
            {visibleProducts.length === 0 ? (
              <p className="store-no-results store-data-status" style={{ gridColumn: "1 / -1" }}>
                {emptyMessage}
              </p>
            ) : (
              visibleProducts.map((product, index) => {
                const productName = language === "ar" ? product.nameAr : product.nameEn;
                const description = language === "ar" ? product.descriptionAr : product.descriptionEn;
                const isInInquiry = inquiryItems.some((item) => item.id === product.id);

                return (
                  <article
                    className="store-product-card scroll-reveal scroll-reveal-up"
                    data-scroll-reveal
                    style={{ "--reveal-delay": `${(index % 4) * 75}ms` }}
                    key={product.id}
                  >
                    <div className="store-product-image-wrap">
                      {product.image ? (
                        <img src={product.image} alt={productName} />
                      ) : (
                        <span className="store-image-placeholder">{t("imageUnavailable")}</span>
                      )}
                    </div>

                    <div className="store-product-info">
                      <div className="store-product-copy">
                        <h3>{productName}</h3>
                        {description && (
                          <p className="store-product-description">{description}</p>
                        )}
                        <strong className="store-product-price">
                          {formatPrice(product.priceValue, language)}
                        </strong>
                      </div>

                      <button
                        className={`store-product-inquiry-button ${
                          isInInquiry ? "is-added" : ""
                        }`}
                        type="button"
                        aria-label={`${t("addToInquiry")} ${productName}`}
                        onClick={() => addToInquiry(product)}
                      >
                        <svg
                          className="store-product-inquiry-icon"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <rect x="5" y="4.5" width="14" height="16" rx="2" />
                          <path d="M9 4.5V3h6v1.5M9 10h6M9 14h6M9 18h3" />
                        </svg>
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default OurStore;
