/**
 * Error Tracking Utilities
 *
 * Provides Sentry-like error tracking without requiring Sentry SDK.
 * Can be easily extended to integrate with Sentry or other error tracking services.
 */

type ErrorSeverity = "fatal" | "error" | "warning" | "info" | "debug";

interface ErrorContext {
  user?: {
    id?: string;
    email?: string;
    username?: string;
  };
  tags?: Record<string, string>;
  extra?: Record<string, unknown>;
}

interface Breadcrumb {
  category: string;
  message: string;
  level: ErrorSeverity;
  timestamp: number;
  data?: Record<string, unknown>;
}

// Store breadcrumbs in memory
const breadcrumbs: Breadcrumb[] = [];
const MAX_BREADCRUMBS = 50;

// Global error context
let globalContext: ErrorContext = {};

// Sentry DSN (optional)
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

/**
 * Initialize error tracking
 */
export function initErrorTracking() {
  if (typeof window === "undefined") return;

  // Global error handler
  window.onerror = (message, source, lineno, colno, error) => {
    captureException(error || new Error(String(message)), {
      tags: { handler: "onerror" },
      extra: { source, lineno, colno },
    });
    return false;
  };

  // Unhandled promise rejection handler
  window.onunhandledrejection = (event) => {
    captureException(event.reason, {
      tags: { handler: "unhandledrejection" },
    });
  };

  console.log("Error tracking initialized");
}

/**
 * Set user context for error reports
 */
export function setUser(user: ErrorContext["user"]) {
  globalContext.user = user;
}

/**
 * Clear user context (on logout)
 */
export function clearUser() {
  globalContext.user = undefined;
}

/**
 * Set global tags
 */
export function setTags(tags: Record<string, string>) {
  globalContext.tags = { ...globalContext.tags, ...tags };
}

/**
 * Add a breadcrumb for debugging
 */
export function addBreadcrumb(
  category: string,
  message: string,
  level: ErrorSeverity = "info",
  data?: Record<string, unknown>
) {
  const breadcrumb: Breadcrumb = {
    category,
    message,
    level,
    timestamp: Date.now(),
    data,
  };

  breadcrumbs.push(breadcrumb);

  // Keep only the last N breadcrumbs
  if (breadcrumbs.length > MAX_BREADCRUMBS) {
    breadcrumbs.shift();
  }
}

/**
 * Capture an exception
 */
export function captureException(error: Error | unknown, context?: ErrorContext) {
  const errorObj = error instanceof Error ? error : new Error(String(error));

  const payload = {
    message: errorObj.message,
    stack: errorObj.stack,
    name: errorObj.name,
    timestamp: new Date().toISOString(),
    url: typeof window !== "undefined" ? window.location.href : undefined,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    context: {
      ...globalContext,
      ...context,
      tags: { ...globalContext.tags, ...context?.tags },
      extra: { ...globalContext.extra, ...context?.extra },
    },
    breadcrumbs: [...breadcrumbs],
  };

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.error("[Error Tracking]", payload);
  }

  // Send to Sentry if configured
  if (SENTRY_DSN) {
    sendToSentry(payload);
  }

  // Send to custom endpoint if needed
  sendToErrorEndpoint(payload);
}

/**
 * Capture a message (non-error)
 */
export function captureMessage(
  message: string,
  level: ErrorSeverity = "info",
  context?: ErrorContext
) {
  const payload = {
    message,
    level,
    timestamp: new Date().toISOString(),
    url: typeof window !== "undefined" ? window.location.href : undefined,
    context: {
      ...globalContext,
      ...context,
    },
    breadcrumbs: [...breadcrumbs],
  };

  if (process.env.NODE_ENV === "development") {
    console.log(`[Error Tracking - ${level}]`, message);
  }

  if (SENTRY_DSN && level === "error") {
    sendToSentry(payload);
  }
}

/**
 * Send error to Sentry (simplified)
 */
async function sendToSentry(payload: unknown) {
  if (!SENTRY_DSN) return;

  try {
    // This is a simplified version. For full Sentry support, use @sentry/nextjs
    const projectId = SENTRY_DSN.split("/").pop();
    const sentryUrl = SENTRY_DSN.replace(/\/\d+$/, "") + `/api/${projectId}/envelope/`;

    await fetch(sentryUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error("Failed to send to Sentry:", e);
  }
}

/**
 * Send to custom error endpoint
 */
async function sendToErrorEndpoint(payload: unknown) {
  const errorEndpoint = process.env.NEXT_PUBLIC_ERROR_ENDPOINT;
  if (!errorEndpoint) return;

  try {
    await fetch(errorEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    // Silently fail to avoid error loops
  }
}

/**
 * Higher-order function to wrap async functions with error tracking
 */
export function withErrorTracking<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  context?: ErrorContext
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      captureException(error, context);
      throw error;
    }
  }) as T;
}

/**
 * React Error Boundary helper
 */
export function handleErrorBoundary(error: Error, errorInfo: { componentStack: string }) {
  captureException(error, {
    extra: {
      componentStack: errorInfo.componentStack,
    },
    tags: {
      errorBoundary: "true",
    },
  });
}
