import { Metadata } from "next";

/**
 * Default site metadata
 */
export const siteConfig = {
  name: "Pondok Pesantren K3 Arafah",
  shortName: "K3 Arafah",
  description:
    "Pondok Pesantren K3 Arafah - Lembaga pendidikan Islam yang mengintegrasikan ilmu agama dan ilmu umum untuk mencetak generasi Qur'ani yang berakhlak mulia.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://k3arafah.sch.id",
  ogImage: "/images/og-image.jpg",
  locale: "id_ID",
  twitter: "@k3arafah",
  keywords: [
    "Pondok Pesantren",
    "Pesantren K3 Arafah",
    "Pendidikan Islam",
    "Yogyakarta",
    "Boarding School",
    "Islamic School",
    "Al-Quran",
    "Santri",
  ],
};

/**
 * Generate base metadata for the site
 */
export function generateBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.shortName}`,
    },
    description: siteConfig.description,
    keywords: siteConfig.keywords,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    publisher: siteConfig.name,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: siteConfig.name,
      description: siteConfig.description,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: siteConfig.description,
      images: [siteConfig.ogImage],
      creator: siteConfig.twitter,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    verification: {
      // Add verification codes when available
      // google: "google-site-verification-code",
      // yandex: "yandex-verification-code",
    },
  };
}

/**
 * Generate metadata for article pages
 */
export function generateArticleMetadata({
  title,
  description,
  image,
  slug,
  publishedAt,
  author,
}: {
  title: string;
  description: string;
  image?: string;
  slug: string;
  publishedAt: string;
  author?: string;
}): Metadata {
  const url = `${siteConfig.url}/articles/${slug}`;
  const ogImage = image || siteConfig.ogImage;

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: siteConfig.name,
      publishedTime: publishedAt,
      authors: author ? [author] : undefined,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Generate metadata for gallery pages
 */
export function generateGalleryMetadata({
  title,
  description,
  image,
  id,
}: {
  title: string;
  description: string;
  image?: string;
  id: number;
}): Metadata {
  const url = `${siteConfig.url}/gallery/${id}`;
  const ogImage = image || siteConfig.ogImage;

  return {
    title: `Galeri: ${title}`,
    description,
    openGraph: {
      type: "website",
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

/**
 * Generate JSON-LD structured data for organization
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/logo-arafah.png`,
    description: siteConfig.description,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Komplek Arafah Al Munawwir",
      addressLocality: "Yogyakarta",
      addressRegion: "DIY",
      addressCountry: "ID",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "admissions",
      email: "info@k3arafah.sch.id",
    },
  };
}

/**
 * Generate JSON-LD structured data for articles
 */
export function generateArticleSchema({
  title,
  description,
  image,
  slug,
  publishedAt,
  updatedAt,
  author,
}: {
  title: string;
  description: string;
  image?: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    image: image || `${siteConfig.url}${siteConfig.ogImage}`,
    url: `${siteConfig.url}/articles/${slug}`,
    datePublished: publishedAt,
    dateModified: updatedAt || publishedAt,
    author: {
      "@type": "Person",
      name: author || siteConfig.name,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/images/logo-arafah.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.url}/articles/${slug}`,
    },
  };
}

/**
 * Generate JSON-LD structured data for breadcrumbs
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}
