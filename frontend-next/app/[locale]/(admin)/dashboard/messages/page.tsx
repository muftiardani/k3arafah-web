import MessagesTable from "@/components/admin/MessagesTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pesan Masuk | Admin Dashboard",
  description: "Kelola pesan masuk dari form kontak",
};

export default function MessagesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pesan Masuk</h1>
        <p className="text-muted-foreground">
          Kelola pesan dan pertanyaan dari pengunjung website.
        </p>
      </div>
      <MessagesTable />
    </div>
  );
}
