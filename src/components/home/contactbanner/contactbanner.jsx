import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../../contexts/language-context.jsx";
import {
  isSupabaseConfigured,
  supabase,
} from "../../../lib/supabase.js";

const contactBanner = "/assets/contact-banner.webp";

const contactDetails = [
  {
    icon: "location",
    titleKey: "ourLocation",
    textKey: "contactAddress",
  },
  {
    icon: "email",
    titleKey: "emailUs",
    textKey: "contactEmail",
    href: "mailto:support@furnicasa.com",
  },
  {
    icon: "phone",
    titleKey: "callUs",
    textKey: "contactPhone",
    href: "tel:+923001234567",
  },
  {
    icon: "hours",
    titleKey: "workingHours",
    textKey: "workingHoursTime",
  },
];

function ContactIcon({ name }) {
  const paths = {
    location: (
      <>
        <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    email: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    phone: (
      <path d="M7 3h3l2 5-2 2a15 15 0 0 0 4 4l2-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 5 5a2 2 0 0 1 2-2Z" />
    ),
    hours: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function ContactBanner() {
  const { t, language } = useLanguage();
  const sectionRef = useRef(null);
  const [formStatus, setFormStatus] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleContactSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;

    setIsSending(true);
    setFormStatus("");

    try {
      const formData = new FormData(form);

      if (isSupabaseConfigured && supabase) {
        const { error } = await supabase.from("contact_messages").insert({
          full_name: String(formData.get("name") || "").trim(),
          email: String(formData.get("email") || "").trim(),
          subject: String(formData.get("subject") || "").trim(),
          message: String(formData.get("message") || "").trim(),
          language,
        });

        if (error) throw error;
      } else {
        await new Promise((resolve) => window.setTimeout(resolve, 450));
      }

      setFormStatus(
        isSupabaseConfigured
          ? language === "ar"
            ? "تم إرسال الرسالة بنجاح."
            : "Message sent successfully."
          : language === "ar"
            ? "تم تسجيل الرسالة محليًا للعرض."
            : "Message captured locally for this demo."
      );
      form.reset();
    } catch {
      setFormStatus(
        language === "ar"
          ? "تعذر إرسال الرسالة. حاول مرة أخرى."
          : "Could not send the message. Please try again."
      );
    } finally {
      setIsSending(false);
    }
  }

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
  }, []);

  return (
    <section ref={sectionRef} className="contact-section" id="contact">
      <div
        className="contact-banner scroll-reveal scroll-reveal-up"
        data-scroll-reveal
      >
        <img className="contact-banner-image" src={contactBanner} alt="" />
        <div className="contact-banner-overlay" aria-hidden="true" />

        <div
          className="contact-banner-content scroll-reveal scroll-reveal-left"
          data-scroll-reveal
        >
          <h2>
            {t("contact")} <span>{t("us")}</span>
          </h2>
          <p>{t("contactDescription")}</p>
        </div>
      </div>

      <div
        className="contact-panel scroll-reveal scroll-reveal-up"
        data-scroll-reveal
      >
        <div className="contact-details">
          {contactDetails.map((detail) => (
            <div className="contact-detail" key={detail.titleKey}>
              <span className="contact-detail-icon">
                <ContactIcon name={detail.icon} />
              </span>
              <div>
                <h3>{t(detail.titleKey)}</h3>
                {detail.href ? (
                  <a href={detail.href}>{t(detail.textKey)}</a>
                ) : (
                  <p>{t(detail.textKey)}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <form className="contact-form" onSubmit={handleContactSubmit}>
          <h3>{t("sendUsMessage")}</h3>

          <input
            type="text"
            name="name"
            placeholder={t("yourName")}
            aria-label={t("yourName")}
            required
          />

          <input
            type="email"
            name="email"
            placeholder={t("yourEmail")}
            aria-label={t("yourEmail")}
            required
          />

          <input
            type="text"
            name="subject"
            placeholder={t("subject")}
            aria-label={t("subject")}
          />

          <textarea
            name="message"
            placeholder={t("yourMessage")}
            aria-label={t("yourMessage")}
            required
          />

          <button type="submit" disabled={isSending}>
            {isSending
              ? language === "ar"
                ? "جارٍ الإرسال..."
                : "Sending..."
              : t("sendMessage")}
            <span aria-hidden="true">→</span>
          </button>

          {formStatus && (
            <p className="contact-form-status" role="status" aria-live="polite">
              {formStatus}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}

export default ContactBanner;
