"use client";

import React, { Component, ReactNode } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component for catching and handling React errors
 * Wraps components to prevent the entire app from crashing on errors
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    // Call optional onError callback
    this.props.onError?.(error, errorInfo);

    // TODO: Send to error reporting service (Sentry, etc.)
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center gap-6 px-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-500">
            <AlertTriangle className="h-10 w-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">Terjadi Kesalahan</h2>
            <p className="max-w-[500px] text-gray-500 dark:text-gray-400">
              Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi.
            </p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500">Detail Error</summary>
                <pre className="mt-2 overflow-auto rounded-lg bg-gray-100 p-4 text-xs text-red-600 dark:bg-gray-800 dark:text-red-400">
                  {this.state.error.message}
                  {"\n\n"}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
          <div className="flex gap-3">
            <Button onClick={this.handleReset} variant="default" className="gap-2">
              <RotateCcw className="h-4 w-4" />
              Coba Lagi
            </Button>
            <Button
              onClick={() => (window.location.href = "/")}
              variant="outline"
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              Kembali ke Beranda
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Wrapper component for async data fetching errors
 */
interface QueryErrorProps {
  error: Error | null;
  resetErrorBoundary?: () => void;
  title?: string;
  description?: string;
}

export function QueryError({
  error,
  resetErrorBoundary,
  title = "Gagal Memuat Data",
  description = "Terjadi kesalahan saat memuat data. Silakan coba lagi.",
}: QueryErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-500">
        <AlertTriangle className="h-8 w-8" />
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="max-w-md text-sm text-gray-500 dark:text-gray-400">{description}</p>
        {process.env.NODE_ENV === "development" && error && (
          <p className="mt-2 text-xs text-red-500">{error.message}</p>
        )}
      </div>
      {resetErrorBoundary && (
        <Button onClick={resetErrorBoundary} size="sm" className="gap-2">
          <RotateCcw className="h-4 w-4" />
          Coba Lagi
        </Button>
      )}
    </div>
  );
}

export default ErrorBoundary;
