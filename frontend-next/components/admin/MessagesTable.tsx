"use client";

import { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Loader2,
  RefreshCw,
  Mail,
  Calendar,
  Clock,
  Search,
  CheckCheck,
  Reply,
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  getAllMessages,
  deleteMessage,
  markMessageAsRead,
  Message,
} from "@/lib/services/contactService";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Input } from "@/components/ui/input";

import { SVGProps } from "react";

export default function MessagesTable() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [search, setSearch] = useState("");

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await getAllMessages();
      setMessages(data);
    } catch (error) {
      toast.error("Gagal memuat pesan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const stats = useMemo(() => {
    return {
      total: messages.length,
      unread: messages.filter((m) => !m.is_read).length,
    };
  }, [messages]);

  const filteredMessages = useMemo(() => {
    if (!search) return messages;
    const lower = search.toLowerCase();
    return messages.filter(
      (m) =>
        m.name.toLowerCase().includes(lower) ||
        m.subject.toLowerCase().includes(lower) ||
        m.email.toLowerCase().includes(lower)
    );
  }, [messages, search]);

  const handleDelete = async (id: number) => {
    try {
      await deleteMessage(id);
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      toast.success("Pesan berhasil dihapus");
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (error) {
      toast.error("Gagal menghapus pesan");
    } finally {
      // Done
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await markMessageAsRead(id);
      setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, is_read: true } : msg)));
    } catch (error) {
      toast.error("Gagal menandai pesan");
    }
  };

  const handleViewMessage = (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.is_read) {
      handleMarkAsRead(msg.id);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
      "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
      "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
      "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400",
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
      "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400",
      "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400",
      "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400",
      "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
      "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
      "bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/30 dark:text-fuchsia-400",
      "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
      "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 p-12">
        <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
        <p className="text-muted-foreground animate-pulse">Memuat kotak masuk...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Stats & Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-slate-950">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Total Pesan
              </p>
              <h3 className="text-2xl font-bold tracking-tight">{stats.total}</h3>
            </div>
            <div className="rounded-xl bg-slate-100 p-2.5 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
              <Mail className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
        <Card className="border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-slate-950">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                Belum Dibaca
              </p>
              <h3 className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                {stats.unread}
              </h3>
            </div>
            <div className="rounded-xl bg-emerald-100 p-2.5 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
              <Mail className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="flex min-h-[500px] flex-col overflow-hidden border-zinc-200 bg-white shadow-xl shadow-zinc-200/50 dark:border-zinc-800 dark:bg-slate-950 dark:shadow-black/20">
        <div className="flex items-center justify-between gap-4 border-b border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800/50 dark:bg-zinc-950">
          <div className="relative max-w-sm flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Cari pesan..."
              className="border-zinc-200 bg-white pl-9 dark:border-zinc-800 dark:bg-slate-900"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={fetchMessages}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>

        {filteredMessages.length === 0 ? (
          <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-zinc-100 p-4 dark:bg-zinc-900">
              <MailIcon className="h-10 w-10 opacity-30" />
            </div>
            <h3 className="text-foreground text-lg font-semibold">Kotak Masuk Kosong</h3>
            <p className="mt-1 max-w-xs">
              {search
                ? "Tidak ada pesan yang cocok dengan pencarian."
                : "Belum ada pesan baru saat ini."}
            </p>
          </div>
        ) : (
          <div className="max-h-[700px] flex-1 overflow-y-auto">
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredMessages.map((item) => (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  className={`group relative flex cursor-pointer flex-col gap-4 p-4 transition-all outline-none hover:bg-zinc-50 sm:flex-row dark:hover:bg-zinc-900/50 ${!item.is_read ? "bg-emerald-50/40 dark:bg-emerald-900/10" : "bg-white dark:bg-slate-950"}`}
                  onClick={() => handleViewMessage(item)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleViewMessage(item);
                    }
                  }}
                >
                  {/* Read Indicator Stripe */}
                  {!item.is_read && (
                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-emerald-500" />
                  )}

                  {/* Avatar */}
                  <div className="shrink-0 pt-1">
                    <Avatar
                      className={`h-10 w-10 border-0 ${getAvatarColor(item.name)} shadow-sm ring-2 ring-white dark:ring-slate-950`}
                    >
                      <AvatarFallback className="bg-transparent font-medium">
                        {getInitials(item.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Content */}
                  <div className="grid min-w-0 flex-1 gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h4
                          className={`truncate text-sm ${!item.is_read ? "text-foreground font-bold" : "text-muted-foreground font-semibold"}`}
                        >
                          {item.name}
                        </h4>
                        {!item.is_read && (
                          <Badge
                            variant="default"
                            className="h-5 bg-emerald-500 px-1.5 py-0 text-[10px] font-bold hover:bg-emerald-600"
                          >
                            NEW
                          </Badge>
                        )}
                      </div>
                      <span
                        className={`text-xs whitespace-nowrap ${!item.is_read ? "font-medium text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}
                      >
                        {item.created_at
                          ? format(new Date(item.created_at), "dd MMM, HH:mm", { locale: idLocale })
                          : "-"}
                      </span>
                    </div>

                    <p
                      className={`truncate text-sm ${!item.is_read ? "text-foreground font-medium" : "text-muted-foreground"}`}
                    >
                      {item.subject}
                    </p>

                    <p className="text-muted-foreground group-hover:text-foreground/80 line-clamp-1 text-xs transition-colors">
                      {item.message}
                    </p>
                  </div>

                  {/* Quick Actions (Hover) */}
                  <div className="flex items-center gap-2 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Pesan?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Pesan dari <b>{item.name}</b> akan dihapus permanen. Tindakan ini tidak
                            bisa dibatalkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={(e) => {
                              e.stopPropagation(); // Avoid triggering row click
                              handleDelete(item.id);
                            }}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={(open) => !open && setSelectedMessage(null)}>
        <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-[600px]">
          {selectedMessage && (
            <>
              <div className="border-b bg-slate-50 p-6 pb-4 dark:bg-slate-900">
                <div className="mb-4 flex items-start gap-4">
                  <Avatar
                    className={`h-12 w-12 border-2 border-white shadow-sm dark:border-slate-800 ${getAvatarColor(selectedMessage.name)}`}
                  >
                    <AvatarFallback className="bg-transparent text-lg font-bold">
                      {getInitials(selectedMessage.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="line-clamp-2 text-lg leading-tight font-bold">
                      {selectedMessage.subject}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                      <span className="text-foreground font-semibold">{selectedMessage.name}</span>
                      <span className="text-muted-foreground">&lt;{selectedMessage.email}&gt;</span>
                    </div>
                  </div>
                </div>
                <div className="text-muted-foreground flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {format(new Date(selectedMessage.created_at), "EEEE, dd MMMM yyyy", {
                        locale: idLocale,
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>
                      {format(new Date(selectedMessage.created_at), "HH:mm 'WIB'", {
                        locale: idLocale,
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="min-h-[200px] p-6 text-sm leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </div>

              <div className="flex items-center justify-between border-t bg-slate-50 p-4 dark:bg-slate-900">
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                  <CheckCheck className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Sudah dibaca</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                    Tutup
                  </Button>
                  <Button
                    className="bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                    onClick={() => window.open(`mailto:${selectedMessage.email}`)}
                  >
                    <Reply className="mr-2 h-4 w-4" />
                    Balas Email
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
