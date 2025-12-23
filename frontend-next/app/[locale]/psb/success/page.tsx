import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 rounded-full bg-emerald-100 p-6 dark:bg-emerald-900">
        <CheckCircle2 className="h-16 w-16 text-emerald-600 dark:text-emerald-400" />
      </div>
      <h1 className="mb-2 text-3xl font-bold text-emerald-800 dark:text-emerald-400">
        Pendaftaran Berhasil!
      </h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Data Anda telah kami terima. Silakan menunggu konfirmasi selanjutnya dari panitia melalui
        WhatsApp.
      </p>
      <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
        <Link href="/">Kembali ke Beranda</Link>
      </Button>
    </div>
  );
}
