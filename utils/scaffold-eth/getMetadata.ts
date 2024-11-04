import type { Metadata } from "next";

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : `http://localhost:${process.env.PORT || 3000}`;

export const getMetadata = ({
  title,
  description,
  imageRelativePath = "/logo.png",
}: {
  title: string;
  description: string;
  imageRelativePath?: string;
}): Metadata => {
  const imageUrl = `${baseUrl}${imageRelativePath}`;
  const siteName = "Mission Enrollment";

  return {
    metadataBase: new URL(baseUrl),
    title: title,
    description: description,
    applicationName: siteName,
    authors: [{ name: "Mission Enrollment Team" }],
    generator: "Next.js",
    keywords: ["blockchain", "attestation", "enrollment", "Base", "POAP", "verification"],
    referrer: "origin-when-cross-origin",
    themeColor: "#1E40AF",
    manifest: "/manifest.json",
    icons: {
      icon: [
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }
      ],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
      ]
    },
    openGraph: {
      type: "website",
      siteName: siteName,
      title: title,
      description: description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: "Mission Enrollment Preview"
        }
      ],
      locale: "en_US"
    },
    twitter: {
      card: "summary_large_image",
      site: "@MissionEnroll",
      creator: "@MissionEnroll",
      title: title,
      description: description,
      images: [
        {
          url: imageUrl,
          alt: "Mission Enrollment Preview"
        }
      ]
    },
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 1
    }
  };
};
