import MessagesTable from "@/components/admin/MessagesTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pesan Masuk | Admin Dashboard",
  description: "Kelola pesan masuk dari form kontak",
};

export default function MessagesPage() {
  return (
    <div className="flex w-full flex-col gap-8 pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pesan Masuk</h1>
        <p className="text-muted-foreground text-lg">
          Kelola pesan dan pertanyaan dari pengunjung website.
        </p>
      </div>
      <MessagesTable />
    </div>
  );
}
