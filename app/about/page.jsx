import { About, Navbar } from "../../src/components/home/index.jsx";
import SiteShell from "../../src/site-shell.jsx";

export default function AboutPage() {
  return (
    <SiteShell>
      <Navbar />
      <main className="route-page">
        <About />
      </main>
    </SiteShell>
  );
}
