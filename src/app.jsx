"use client";

import {
  About,
  Category,
  ContactBanner,
  Hero,
  InquiryPage,
  MaterialBanner,
  Navbar,
  OurStore,
  StatusBar,
} from "./components/home/index.jsx";
import SiteShell from "./site-shell.jsx";

function App() {
 return (
  <SiteShell>
      <>
        <Navbar />
        <Hero />
        <StatusBar />
        <Category />
        <About />
        <OurStore />
        <MaterialBanner />
        <ContactBanner />
        <InquiryPage />
      </>
  </SiteShell>
);
}

export default App;
