import { Metadata } from "next";
import Link from "next/link";
import { WifiOff, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Offline",
  description: "Anda sedang offline. Silakan periksa koneksi internet Anda.",
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-4 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800">
        <WifiOff className="h-12 w-12 text-gray-400" aria-hidden="true" />
      </div>

      <h1 className="mb-3 text-3xl font-bold text-gray-800 dark:text-gray-100">
        Anda Sedang Offline
      </h1>

      <p className="mb-8 max-w-md text-gray-600 dark:text-gray-400">
        Sepertinya Anda tidak terhubung ke internet. Silakan periksa koneksi Anda dan coba lagi.
      </p>

      <div className="flex gap-4">
        <Button
          onClick={() => window.location.reload()}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
          Coba Lagi
        </Button>

        <Button variant="outline" asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" aria-hidden="true" />
            Beranda
          </Link>
        </Button>
      </div>

      <p className="mt-8 text-sm text-gray-400">
        Beberapa halaman yang sudah Anda kunjungi mungkin masih tersedia secara offline.
      </p>
    </div>
  );
}
