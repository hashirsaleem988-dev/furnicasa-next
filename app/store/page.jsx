import {
  InquiryPage,
  Navbar,
  OurStore,
} from "../../src/components/home/index.jsx";
import SiteShell from "../../src/site-shell.jsx";

export default function StorePage() {
  return (
    <SiteShell>
      <Navbar />
      <main className="route-page">
        <OurStore />
        <InquiryPage />
      </main>
    </SiteShell>
  );
}
