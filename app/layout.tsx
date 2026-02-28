import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "monis.rent — Design Your Workspace",
  description:
    "Build your perfect remote work setup in Bali. Pick a desk, choose a chair, add monitors and accessories — then rent it all delivered to your door.",
  openGraph: {
    title: "monis.rent — Design Your Workspace",
    description: "Build your dream Bali workspace and rent it. Next-day delivery.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className="font-body bg-cream-100 text-charcoal-600 antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#2a2520",
              color: "#faf3e0",
              fontFamily: "var(--font-dm-sans)",
              fontSize: "14px",
              borderRadius: "12px",
              padding: "12px 16px",
            },
            success: {
              iconTheme: { primary: "#6fa86f", secondary: "#faf3e0" },
            },
          }}
        />
      </body>
    </html>
  );
}
