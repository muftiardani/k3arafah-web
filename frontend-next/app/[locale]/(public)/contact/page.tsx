import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ContactContent from "@/components/pages/ContactContent";

export async function generateMetadata() {
  const t = await getTranslations("Contact");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function ContactPage() {
  return <ContactContent />;
}
