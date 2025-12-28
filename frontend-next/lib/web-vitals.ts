"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Web Vitals Metrics
 * LCP: Largest Contentful Paint (loading performance)
 * FID: First Input Delay (interactivity) - deprecated, use INP
 * INP: Interaction to Next Paint (interactivity)
 * CLS: Cumulative Layout Shift (visual stability)
 * TTFB: Time to First Byte (server response)
 * FCP: First Contentful Paint (initial render)
 */

type MetricType = "LCP" | "FID" | "INP" | "CLS" | "TTFB" | "FCP";

interface WebVitalMetric {
  name: MetricType;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta: number;
  id: string;
  navigationType: string;
}

// Thresholds for Web Vitals (in ms, except CLS which is unitless)
const THRESHOLDS: Record<MetricType, { good: number; poor: number }> = {
  LCP: { good: 2500, poor: 4000 },
  FID: { good: 100, poor: 300 },
  INP: { good: 200, poor: 500 },
  CLS: { good: 0.1, poor: 0.25 },
  TTFB: { good: 800, poor: 1800 },
  FCP: { good: 1800, poor: 3000 },
};

/**
 * Get rating based on value and thresholds
 */
function getRating(name: MetricType, value: number): WebVitalMetric["rating"] {
  const threshold = THRESHOLDS[name];
  if (value <= threshold.good) return "good";
  if (value <= threshold.poor) return "needs-improvement";
  return "poor";
}

/**
 * Report metric to analytics
 */
function reportMetric(metric: WebVitalMetric) {
  // Log in development
  if (process.env.NODE_ENV === "development") {
    const color =
      metric.rating === "good" ? "green" : metric.rating === "needs-improvement" ? "orange" : "red";
    console.log(
      `%c[Web Vitals] ${metric.name}: ${metric.value.toFixed(2)} (${metric.rating})`,
      `color: ${color}`
    );
  }

  // Send to Google Analytics
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", metric.name, {
      event_category: "Web Vitals",
      event_label: metric.id,
      value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
      non_interaction: true,
      metric_rating: metric.rating,
      metric_delta: metric.delta,
    });
  }

  // Send to custom endpoint
  sendToEndpoint(metric);
}

/**
 * Send metrics to custom endpoint
 */
async function sendToEndpoint(metric: WebVitalMetric) {
  const endpoint = process.env.NEXT_PUBLIC_VITALS_ENDPOINT;
  if (!endpoint) return;

  try {
    // Use sendBeacon for reliability
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(metric)], {
        type: "application/json",
      });
      navigator.sendBeacon(endpoint, blob);
    } else {
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metric),
        keepalive: true,
      });
    }
  } catch (e) {
    // Silently fail
  }
}

/**
 * Observe Web Vitals using Performance Observer
 */
function observeWebVitals() {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
    return;
  }

  // LCP - Largest Contentful Paint
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number };
      if (lastEntry) {
        const value = lastEntry.startTime;
        reportMetric({
          name: "LCP",
          value,
          rating: getRating("LCP", value),
          delta: value,
          id: `lcp-${Date.now()}`,
          navigationType: getNavigationType(),
        });
      }
    });
    lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
  } catch (e) {
    // Observer not supported
  }

  // FCP - First Contentful Paint
  try {
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find((e) => e.name === "first-contentful-paint");
      if (fcpEntry) {
        const value = fcpEntry.startTime;
        reportMetric({
          name: "FCP",
          value,
          rating: getRating("FCP", value),
          delta: value,
          id: `fcp-${Date.now()}`,
          navigationType: getNavigationType(),
        });
      }
    });
    fcpObserver.observe({ type: "paint", buffered: true });
  } catch (e) {
    // Observer not supported
  }

  // CLS - Cumulative Layout Shift
  try {
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as (PerformanceEntry & {
        hadRecentInput: boolean;
        value: number;
      })[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
    });
    clsObserver.observe({ type: "layout-shift", buffered: true });

    // Report CLS on page hide
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        reportMetric({
          name: "CLS",
          value: clsValue,
          rating: getRating("CLS", clsValue),
          delta: clsValue,
          id: `cls-${Date.now()}`,
          navigationType: getNavigationType(),
        });
      }
    });
  } catch (e) {
    // Observer not supported
  }

  // TTFB - Time to First Byte
  try {
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
    if (navigation) {
      const value = navigation.responseStart;
      reportMetric({
        name: "TTFB",
        value,
        rating: getRating("TTFB", value),
        delta: value,
        id: `ttfb-${Date.now()}`,
        navigationType: getNavigationType(),
      });
    }
  } catch (e) {
    // Not available
  }

  // INP - Interaction to Next Paint
  try {
    let inpValue = 0;
    const inpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as (PerformanceEntry & { duration: number })[]) {
        if (entry.duration > inpValue) {
          inpValue = entry.duration;
        }
      }
    });
    inpObserver.observe({ type: "event", buffered: true });

    // Report INP on page hide
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden" && inpValue > 0) {
        reportMetric({
          name: "INP",
          value: inpValue,
          rating: getRating("INP", inpValue),
          delta: inpValue,
          id: `inp-${Date.now()}`,
          navigationType: getNavigationType(),
        });
      }
    });
  } catch (e) {
    // Observer not supported
  }
}

/**
 * Get navigation type
 */
function getNavigationType(): string {
  if (typeof window === "undefined") return "unknown";

  const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming;
  return navigation?.type || "navigate";
}

/**
 * Web Vitals monitoring component
 */
export function WebVitalsMonitor() {
  const pathname = usePathname();

  useEffect(() => {
    observeWebVitals();
  }, []);

  // Reset on route change for SPA navigation
  useEffect(() => {
    // Could reset metrics here if needed for SPA navigation tracking
  }, [pathname]);

  return null;
}

/**
 * Hook for accessing Web Vitals data
 */
export function useWebVitals() {
  useEffect(() => {
    observeWebVitals();
  }, []);
}
