import type { Metadata } from "next";
import { Inter, Outfit, Manrope } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Booqly App",
    template: "%s | Booqly App",
  },
  description: "Book your favorite beauty services in seconds with Booqly - the all-in-one platform for clients and beauty professionals",
  applicationName: "Booqly App",
  metadataBase: new URL("https://booqlyapp.com"),
  icons: {
    icon: [
      { url: '/images/booqlyfavicon.png', type: 'image/png' },
    ],
    apple: '/images/booqlyfavicon.png',
  },
  openGraph: {
    title: "Booqly App",
    description: "Book your favorite beauty services in seconds with Booqly - the all-in-one platform for clients and beauty professionals",
    url: "https://booqlyapp.com",
    siteName: "Booqly App",
    images: [
      {
        url: "/images/booqlyiconsquare.png",
        width: 512,
        height: 512,
        alt: "Booqly App",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Booqly App",
    description: "Book your favorite beauty services in seconds with Booqly - the all-in-one platform for clients and beauty professionals",
    images: ["/images/booqlyiconsquare.png"],
  },
};


const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Booqly App",
  "alternateName": "Booqly",
  "url": "https://booqlyapp.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} ${manrope.variable} h-full antialiased`}
      style={{ colorScheme: 'light' }}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className={`${inter.className} min-h-full flex flex-col bg-white text-black`}>{children}</body>
    </html>
  );
}
