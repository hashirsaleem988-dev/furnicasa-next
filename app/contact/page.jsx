import { ContactBanner, Navbar } from "../../src/components/home/index.jsx";
import SiteShell from "../../src/site-shell.jsx";

export default function ContactPage() {
  return (
    <SiteShell>
      <Navbar />
      <main className="route-page">
        <ContactBanner />
      </main>
    </SiteShell>
  );
}
