"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLanguage = () => {
    const nextLocale = locale === "id" ? "en" : "id";
    router.replace(pathname, { locale: nextLocale });
  };

  const FlagID = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 480"
      className="h-4 w-6 rounded-[2px] shadow-sm"
    >
      <path fill="#e11837" d="M0 0h640v240H0z" />
      <path fill="#f5f5f5" d="M0 240h640v240H0z" />
    </svg>
  );

  const FlagUK = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 480"
      className="h-4 w-6 rounded-[2px] shadow-sm"
    >
      <path fill="#012169" d="M0 0h640v480H0z" />
      <path
        fill="#FFF"
        d="M75 0l244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z"
      />
      <path
        fill="#C8102E"
        d="M424 294l216 163v23h-36L320 297 122 480H0v-20l219-204L0 65V0h33l183 151L450 0h128v14L320 186l289 188v-80c0-9 2-13 8-13h23v13z"
      />
      <path fill="#FFF" d="M250 0h140v480H250zM0 170h640v140H0z" />
      <path fill="#C8102E" d="M280 0h80v480h-80zM0 200h640v80H0z" />
    </svg>
  );

  return (
    <Button
      variant="ghost"
      onClick={toggleLanguage}
      className={cn(
        "h-auto w-auto gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium shadow-sm transition-all hover:bg-slate-50 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800",
        "flex items-center"
      )}
      title={locale === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
    >
      {locale === "id" ? <FlagID /> : <FlagUK />}
      <span className="text-slate-700 dark:text-slate-200">
        {locale === "id" ? "Indonesia" : "English"}
      </span>
    </Button>
  );
}
