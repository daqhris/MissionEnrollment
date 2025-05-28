import type { Metadata } from "next";

// Use the production URL for all environments to ensure consistent metadata
const baseUrl = "https://mission-enrollment.daqhris.com";

export const getMetadata = ({
  title,
  description,
  imageRelativePath = "/logo.png",
  path = "",
}: {
  title: string;
  description: string;
  imageRelativePath?: string;
  path?: string;
}): Metadata => {
  const imageUrl = `${baseUrl}${imageRelativePath}`;
  const siteName = "Mission Enrollment";
  const canonicalUrl = `${baseUrl}${path}`;

  return {
    metadataBase: new URL(baseUrl),
    title: title,
    description: description,
    applicationName: siteName,
    authors: [{ name: "Mission Enrollment Team" }],
    generator: "Next.js",
    keywords: ["blockchain", "attestation", "enrollment", "Base", "POAP", "verification"],
    referrer: "origin-when-cross-origin",
    manifest: "/manifest.json",
    alternates: {
      canonical: canonicalUrl,
    },
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
      url: canonicalUrl,
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
    }
  };
};
