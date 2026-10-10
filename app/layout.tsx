import type { Metadata, Viewport } from "next";
import { Archivo, Cormorant_Garamond, Sacramento } from "next/font/google";
import "./globals.css";

// Archivo has weight AND width axes, which the hero name animates.
const sans = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-sans", display: "swap" });
const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});
const script = Sacramento({ subsets: ["latin"], weight: "400", variable: "--font-script", display: "swap" });

// After deploying, set NEXT_PUBLIC_SITE_URL to your real address (for example https://aryansagar.dev).
const site =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

const title = "Aryan Sagar | AI Engineer, Software Engineer, Filmmaker";
const description =
  "Engineer by profession. Filmmaker by obsession. AI, distributed systems and fintech projects, films, and the stories I keep coming back to.";

export const metadata: Metadata = {
  metadataBase: new URL(site),
  title,
  description,
  openGraph: { title, description, url: "/", siteName: "Aryan Sagar", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = { themeColor: "#050505" };

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Aryan Sagar",
  jobTitle: "AI Engineer, Software Engineer and Filmmaker",
  url: site,
  sameAs: ["https://github.com/Aryan-sagar", "https://linkedin.com/in/aryan-sagar-755947254"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable} ${script.variable}`} suppressHydrationWarning>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: "try{if(sessionStorage.getItem('aryan-intro')==='1')document.documentElement.classList.add('seen')}catch(e){}",
          }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
        {children}
      </body>
    </html>
  );
}