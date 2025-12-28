"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID;

/**
 * Check if analytics should be loaded
 */
const shouldLoadAnalytics = () => {
  if (typeof window === "undefined") return false;
  if (!GA_MEASUREMENT_ID) return false;
  // Respect Do Not Track
  if (navigator.doNotTrack === "1") return false;
  return true;
};

/**
 * Send page view to Google Analytics
 */
export const pageview = (url: string) => {
  if (!shouldLoadAnalytics()) return;

  window.gtag?.("config", GA_MEASUREMENT_ID!, {
    page_path: url,
  });
};

/**
 * Send custom event to Google Analytics
 */
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (!shouldLoadAnalytics()) return;

  window.gtag?.("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

/**
 * Common tracking events
 */
export const trackEvents = {
  // Form events
  formStart: (formName: string) =>
    event({ action: "form_start", category: "Form", label: formName }),
  formSubmit: (formName: string) =>
    event({ action: "form_submit", category: "Form", label: formName }),
  formError: (formName: string, error: string) =>
    event({ action: "form_error", category: "Form", label: `${formName}: ${error}` }),

  // Article events
  articleView: (articleSlug: string) =>
    event({ action: "view_article", category: "Content", label: articleSlug }),
  articleShare: (articleSlug: string, platform: string) =>
    event({ action: "share", category: "Social", label: `${platform}: ${articleSlug}` }),

  // PSB events
  psbStart: () => event({ action: "psb_start", category: "Registration" }),
  psbComplete: () => event({ action: "psb_complete", category: "Registration" }),

  // Gallery events
  galleryView: (galleryId: number) =>
    event({ action: "view_gallery", category: "Content", label: String(galleryId) }),

  // Contact events
  contactSubmit: () => event({ action: "contact_submit", category: "Lead" }),

  // Outbound links
  outboundClick: (url: string) => event({ action: "click", category: "Outbound Link", label: url }),
};

/**
 * Track page views on route change
 */
function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");
      pageview(url);
    }
  }, [pathname, searchParams]);

  return null;
}

/**
 * Google Analytics component
 * Add this to your root layout
 */
export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
              cookie_flags: 'SameSite=None;Secure',
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
    </>
  );
}

/**
 * TypeScript declarations for gtag
 */
declare global {
  interface Window {
    gtag?: (
      command: "config" | "event" | "js",
      targetOrParams: string | Date,
      params?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}
