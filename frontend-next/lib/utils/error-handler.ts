import { AxiosError } from "axios";
import { toast } from "sonner";

/**
 * Standard API error response structure
 */
export interface ApiError {
  status: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Error types for categorization
 */
export enum ErrorType {
  NETWORK = "NETWORK",
  VALIDATION = "VALIDATION",
  UNAUTHORIZED = "UNAUTHORIZED",
  FORBIDDEN = "FORBIDDEN",
  NOT_FOUND = "NOT_FOUND",
  SERVER = "SERVER",
  UNKNOWN = "UNKNOWN",
}

/**
 * Parsed error result
 */
export interface ParsedError {
  type: ErrorType;
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

/**
 * Parse API errors into a standardized format
 */
export function parseApiError(error: unknown): ParsedError {
  // Network error (no response)
  if (error instanceof AxiosError && !error.response) {
    return {
      type: ErrorType.NETWORK,
      message: "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.",
    };
  }

  // Axios error with response
  if (error instanceof AxiosError && error.response) {
    const { status, data } = error.response;
    const apiError = data as ApiError;

    switch (status) {
      case 400:
        return {
          type: ErrorType.VALIDATION,
          message: apiError.message || "Data yang dikirim tidak valid",
          errors: apiError.errors,
          statusCode: status,
        };
      case 401:
        return {
          type: ErrorType.UNAUTHORIZED,
          message: "Sesi Anda telah berakhir. Silakan login kembali.",
          statusCode: status,
        };
      case 403:
        return {
          type: ErrorType.FORBIDDEN,
          message: "Anda tidak memiliki akses untuk melakukan tindakan ini.",
          statusCode: status,
        };
      case 404:
        return {
          type: ErrorType.NOT_FOUND,
          message: apiError.message || "Data tidak ditemukan.",
          statusCode: status,
        };
      case 422:
        return {
          type: ErrorType.VALIDATION,
          message: apiError.message || "Validasi gagal",
          errors: apiError.errors,
          statusCode: status,
        };
      case 500:
      case 502:
      case 503:
        return {
          type: ErrorType.SERVER,
          message: "Terjadi kesalahan pada server. Silakan coba lagi nanti.",
          statusCode: status,
        };
      default:
        return {
          type: ErrorType.UNKNOWN,
          message: apiError.message || "Terjadi kesalahan yang tidak diketahui.",
          statusCode: status,
        };
    }
  }

  // Generic Error
  if (error instanceof Error) {
    return {
      type: ErrorType.UNKNOWN,
      message: error.message,
    };
  }

  // Unknown error
  return {
    type: ErrorType.UNKNOWN,
    message: "Terjadi kesalahan yang tidak diketahui.",
  };
}

/**
 * Handle API error with toast notification
 */
export function handleApiError(error: unknown, customMessage?: string): ParsedError {
  const parsed = parseApiError(error);

  // Show toast with appropriate message
  toast.error(customMessage || parsed.message);

  // Log in development
  if (process.env.NODE_ENV === "development") {
    console.error("[API Error]", parsed, error);
  }

  return parsed;
}

/**
 * Get validation error message for a specific field
 */
export function getFieldError(
  errors: Record<string, string[]> | undefined,
  field: string
): string | undefined {
  if (!errors || !errors[field]) return undefined;
  return errors[field][0];
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  return parseApiError(error).type === ErrorType.NETWORK;
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  const parsed = parseApiError(error);
  return parsed.type === ErrorType.UNAUTHORIZED || parsed.type === ErrorType.FORBIDDEN;
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: Record<string, string[]>): string[] {
  const messages: string[] = [];
  for (const field in errors) {
    errors[field].forEach((msg) => {
      messages.push(`${field}: ${msg}`);
    });
  }
  return messages;
}
