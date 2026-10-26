/* global process */

import { useEffect, useRef, useState } from "react";
import { useInquiry } from "../../../contexts/inquiry-context.jsx";
import { useLanguage } from "../../../contexts/language-context.jsx";
import {
  isSupabaseConfigured,
  supabase,
} from "../../../lib/supabase.js";

const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923001234567";

function getInquiryItemKey(item) {
  return item.id || item.nameKey || item.nameEn;
}

function getInquiryItemName(item, language, translate) {
  if (language === "ar") {
    return item.nameAr || translate(item.nameKey, "ar");
  }

  return item.nameEn || translate(item.nameKey, "en");
}

function InquiryPage() {
  const { language, t, translate } = useLanguage();
  const {
    inquiryItems,
    inquiryTotal,
    removeFromInquiry,
    changeQuantity,
  } = useInquiry();
  const inquiryRef = useRef(null);

  const [isSending, setIsSending] = useState(false);
  const [inquiryStatus, setInquiryStatus] = useState("");
  const [inquiryStatusType, setInquiryStatusType] = useState("");

  const isArabic = language === "ar";

  const inquiryText = isArabic
    ? {
        title: "بيانات الاستفسار",
        name: "الاسم الكامل",
        email: "البريد الإلكتروني",
        phone: "رقم الهاتف",
        address: "تفاصيل الاستفسار",
        send: "إرسال الاستفسار",
        sending: "جارٍ إرسال الاستفسار...",
        success: "تم إرسال الاستفسار بنجاح. الرقم:",
        error: "تعذر إرسال الاستفسار. حاول مرة أخرى.",
      }
    : {
        title: "Inquiry Details",
        name: "Full Name",
        email: "Email Address",
        phone: "Phone Number",
        address: "Inquiry Details",
        send: "Send Inquiry",
        sending: "Sending Inquiry...",
        success: "Inquiry sent successfully. Reference:",
        error: "Could not submit your inquiry. Please try again.",
      };

  const formatPrice = (amount) =>
    `PKR ${new Intl.NumberFormat(
      isArabic ? "ar-PK" : "en-PK"
    ).format(amount)}`;

  async function handleInquirySubmit(event) {
    event.preventDefault();

    if (inquiryItems.length === 0) return;

    const form = event.currentTarget;

    setIsSending(true);
    setInquiryStatus("");
    setInquiryStatusType("");

    try {
      const formData = new FormData(form);
      const fallbackUuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        (character) => {
          const random = Math.floor(Math.random() * 16);
          const value = character === "x" ? random : (random & 3) | 8;
          return value.toString(16);
        }
      );
      const databaseId = window.crypto?.randomUUID?.() || fallbackUuid;

      if (isSupabaseConfigured && supabase) {
        const { error: inquiryError } = await supabase
          .from("inquiries")
          .insert({
            id: databaseId,
            full_name: String(formData.get("name") || "").trim(),
            email: String(formData.get("email") || "").trim(),
            phone: String(formData.get("phone") || "").trim(),
            address: String(formData.get("address") || "").trim(),
            language,
          });

        if (inquiryError) throw inquiryError;

        const { error: itemError } = await supabase
          .from("inquiry_items")
          .insert(
            inquiryItems.map((item) => ({
              inquiry_id: databaseId,
              product_name_en: item.nameEn || translate(item.nameKey, "en"),
              product_name_ar: item.nameAr || translate(item.nameKey, "ar"),
              image_url: item.image,
              quantity: item.quantity,
              unit_price: item.priceValue,
            }))
          );

        if (itemError) throw itemError;
      } else {
        await new Promise((resolve) => window.setTimeout(resolve, 450));
      }

      const inquiryId = `FC-INQ-${databaseId.slice(0, 8).toUpperCase()}`;

      setInquiryStatus(`${inquiryText.success} ${inquiryId}`);
      setInquiryStatusType("success");
      form.reset();

      [...inquiryItems].forEach((item) =>
        removeFromInquiry(getInquiryItemKey(item))
      );
    } catch {
      setInquiryStatus(inquiryText.error);
      setInquiryStatusType("error");
    } finally {
      setIsSending(false);
    }
  }

  function openWhatsApp() {
    const lines = inquiryItems.map((item) => {
      const name = getInquiryItemName(item, language, translate);
      return `- ${name} x${item.quantity} — ${formatPrice(item.priceValue)}`;
    });
    const message = [
      t("whatsappMessageIntro"),
      ...lines,
      `${t("whatsappEstimatedTotal")}: ${formatPrice(inquiryTotal)}`,
    ].join("\n");

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  useEffect(() => {
    const section = inquiryRef.current;
    if (!section) return;

    const targets = section.querySelectorAll(
      "[data-inquiry-reveal]:not(.is-visible)"
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
      { threshold: 0.12, rootMargin: "0px 0px -24px 0px" }
    );

    targets.forEach((target) => observer.observe(target));

    return () => observer.disconnect();
  }, [inquiryItems.length]);

  return (
    <section ref={inquiryRef} className="inquiry-page" id="inquiry">
      <h2 className="inquiry-reveal-left" data-inquiry-reveal>
        {t("inquiryTitle")}
      </h2>

      {inquiryStatus && (
        <p
          className={`inquiry-status is-${inquiryStatusType}`}
          role="status"
          aria-live="polite"
        >
          {inquiryStatus}
        </p>
      )}

      {inquiryItems.length === 0 ? (
        <p className="inquiry-empty inquiry-reveal-left" data-inquiry-reveal>
          {t("inquiryEmpty")}
        </p>
      ) : (
        <>
          <div className="inquiry-items">
            {inquiryItems.map((item, index) => (
              <article
                className="inquiry-item inquiry-reveal-up"
                data-inquiry-reveal
                style={{ "--inquiry-delay": `${index * 90}ms` }}
                key={getInquiryItemKey(item)}
              >
                <img
                  className="inquiry-item-image inquiry-reveal-up"
                  data-inquiry-reveal
                  style={{ "--inquiry-delay": `${index * 90 + 70}ms` }}
                  src={item.image}
                  alt={getInquiryItemName(item, language, translate)}
                />

                <div
                  className="inquiry-item-info inquiry-reveal-left"
                  data-inquiry-reveal
                  style={{ "--inquiry-delay": `${index * 90 + 100}ms` }}
                >
                  <h3>{getInquiryItemName(item, language, translate)}</h3>
                  <p>{formatPrice(item.priceValue)}</p>
                </div>

                <div
                  className="inquiry-quantity inquiry-reveal-up"
                  data-inquiry-reveal
                  style={{ "--inquiry-delay": `${index * 90 + 130}ms` }}
                >
                  <button
                    type="button"
                    aria-label={t("decreaseQuantity")}
                    onClick={() => changeQuantity(getInquiryItemKey(item), -1)}
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    type="button"
                    aria-label={t("increaseQuantity")}
                    onClick={() => changeQuantity(getInquiryItemKey(item), 1)}
                  >
                    +
                  </button>
                </div>

                <button
                  className="inquiry-remove inquiry-reveal-up"
                  data-inquiry-reveal
                  style={{ "--inquiry-delay": `${index * 90 + 160}ms` }}
                  type="button"
                  onClick={() => removeFromInquiry(getInquiryItemKey(item))}
                >
                  {t("remove")}
                </button>
              </article>
            ))}
          </div>

          <div className="inquiry-total inquiry-reveal-up" data-inquiry-reveal>
            <span className="inquiry-reveal-left" data-inquiry-reveal>
              {t("inquiryTotal")}
            </span>
            <strong className="inquiry-reveal-left" data-inquiry-reveal>
              {formatPrice(inquiryTotal)}
            </strong>
          </div>

          <button
            className="inquiry-whatsapp inquiry-reveal-up"
            data-inquiry-reveal
            type="button"
            onClick={openWhatsApp}
          >
            {t("inquireViaWhatsApp")}
            <span aria-hidden="true">↗</span>
          </button>

          <div className="inquiry-form-panel inquiry-reveal-up" data-inquiry-reveal>
            <h3>{inquiryText.title}</h3>

            <form
              className="inquiry-form"
              onSubmit={handleInquirySubmit}
              dir={isArabic ? "rtl" : "ltr"}
            >
              <label className="inquiry-field">
                <span>{inquiryText.name}</span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  minLength={2}
                  required
                />
              </label>

              <label className="inquiry-field">
                <span>{inquiryText.email}</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                />
              </label>

              <label className="inquiry-field">
                <span>{inquiryText.phone}</span>
                <input
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  minLength={7}
                  required
                />
              </label>

              <label className="inquiry-field inquiry-address-field">
                <span>{inquiryText.address}</span>
                <textarea
                  name="address"
                  autoComplete="street-address"
                  minLength={5}
                  rows={3}
                  required
                />
              </label>

              <button
                className="inquiry-submit"
                type="submit"
                disabled={isSending}
              >
                {isSending ? inquiryText.sending : inquiryText.send}
                <span aria-hidden="true">→</span>
              </button>
            </form>
          </div>
        </>
      )}

      <a
        className="inquiry-continue inquiry-reveal-up"
        data-inquiry-reveal
        href="#store"
      >
        {t("continueBrowsing")}
      </a>
    </section>
  );
}

export default InquiryPage;
