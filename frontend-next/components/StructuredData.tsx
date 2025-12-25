import Script from "next/script";

export function StructuredData() {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "Pondok Pesantren K3 Arafah",
    url: "https://k3arafah.com",
    logo: "https://k3arafah.com/logo.png",
    sameAs: [
      "https://facebook.com/k3arafah",
      "https://instagram.com/k3arafah",
      "https://youtube.com/@k3arafah",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Jl. Raya Arafah No. 123",
      addressLocality: "Boyolali",
      addressRegion: "Jawa Tengah",
      postalCode: "57311",
      addressCountry: "ID",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+62-812-3456-7890",
      contactType: "customer service",
      availableLanguage: ["Indonesian", "English"],
    },
  };

  return (
    <Script
      id="organization-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
    />
  );
}
