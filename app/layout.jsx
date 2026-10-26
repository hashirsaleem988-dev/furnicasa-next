import "./globals.css";

export const metadata = {
  title: "FurniCasa | Furniture for Modern Living",
  description:
    "Discover high-quality furniture that brings comfort, style, and functionality to your home.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body>{children}</body>
    </html>
  );
}
