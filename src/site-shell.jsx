"use client";

import { useEffect } from "react";
import { InquiryProvider, LanguageProvider } from "./contexts/index.jsx";
import Footer from "./components/home/footer/footer.jsx";
import { getSite } from "./lib/furnicase-api.js";

function SiteBranding() {
  useEffect(() => {
    let isMounted = true;

    getSite()
      .then((site) => {
        if (!isMounted || !site?.branding) return;

        const branding = site.branding;
        const root = document.documentElement;

        if (branding.primaryColor) {
          root.style.setProperty("--brown", branding.primaryColor);
          root.style.setProperty("--brown-dark", branding.primaryColor);
        }

        if (branding.accentColor) {
          root.style.setProperty("--sand", branding.accentColor);
        }
        if (branding.backgroundColor) {
          root.style.setProperty("--cream", branding.backgroundColor);
        }
        if (branding.brandName || site.name) {
          document.title = `${branding.brandName || site.name} | Furniture for Modern Living`;
        }
      })
      .catch(() => {
        // Keep the local theme when the optional branding endpoint is unavailable.
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return null;
}

export default function SiteShell({ children }) {
  return (
    <LanguageProvider>
      <InquiryProvider>
        <SiteBranding />
        {children}
        <Footer />
      </InquiryProvider>
    </LanguageProvider>
  );
}

