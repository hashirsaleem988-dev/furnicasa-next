import { MaterialBanner, Navbar } from "../../src/components/home/index.jsx";
import SiteShell from "../../src/site-shell.jsx";

export default function MaterialsPage() {
  return (
    <SiteShell>
      <Navbar />
      <main className="route-page">
        <MaterialBanner />
      </main>
    </SiteShell>
  );
}
