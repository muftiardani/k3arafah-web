"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Loader2,
  RefreshCw,
  Mail,
  MailOpen,
  User,
  Calendar,
  MessageSquare,
  Clock,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import React, { SVGProps } from "react";

export default function MessagesTable() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

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

  const handleDelete = async (id: number) => {
    setDeletingId(id);
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
      setDeletingId(null);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await markMessageAsRead(id);
      setMessages((prev) => prev.map((msg) => (msg.id === id ? { ...msg, is_read: true } : msg)));
      // toast.success("Pesan ditandai sudah dibaca"); // Optional feedback
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
      "bg-red-100 text-red-600",
      "bg-orange-100 text-orange-600",
      "bg-amber-100 text-amber-600",
      "bg-green-100 text-green-600",
      "bg-emerald-100 text-emerald-600",
      "bg-teal-100 text-teal-600",
      "bg-cyan-100 text-cyan-600",
      "bg-blue-100 text-blue-600",
      "bg-indigo-100 text-indigo-600",
      "bg-violet-100 text-violet-600",
      "bg-purple-100 text-purple-600",
      "bg-fuchsia-100 text-fuchsia-600",
      "bg-pink-100 text-pink-600",
      "bg-rose-100 text-rose-600",
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
        <Loader2 className="text-primary h-10 w-10 animate-spin" />
        <p className="text-muted-foreground animate-pulse">Memuat kotak masuk...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 rounded-lg p-2">
            <Mail className="text-primary h-5 w-5" />
          </div>
          <span className="text-lg font-semibold">{messages.length} Pesan</span>
        </div>
        <Button size="sm" variant="outline" onClick={fetchMessages} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      <Card className="flex min-h-[500px] flex-col overflow-hidden">
        {messages.length === 0 ? (
          <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center py-12 text-center">
            <div className="bg-muted mb-4 rounded-full p-4">
              <MailIcon className="h-10 w-10 opacity-50" />
            </div>
            <h3 className="text-foreground text-lg font-semibold">Kotak Masuk Kosong</h3>
            <p className="mt-1 max-w-xs">Belum ada pesan baru dari pengunjung website saat ini.</p>
          </div>
        ) : (
          <div className="max-h-[700px] flex-1 overflow-y-auto">
            <div className="divide-y">
              {messages.map((item) => (
                <div
                  key={item.id}
                  role="button"
                  tabIndex={0}
                  className={`group hover:bg-muted/50 focus:bg-muted/50 flex cursor-pointer flex-col gap-4 p-4 transition-colors outline-none sm:flex-row ${!item.is_read ? "bg-primary/5" : ""}`}
                  onClick={() => handleViewMessage(item)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleViewMessage(item);
                    }
                  }}
                >
                  {/* Avatar */}
                  <div className="shrink-0 pt-1">
                    <Avatar className={`h-10 w-10 border ${getAvatarColor(item.name)}`}>
                      <AvatarFallback className="bg-transparent">
                        {getInitials(item.name)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Content */}
                  <div className="grid min-w-0 flex-1 gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4
                        className={`truncate text-sm font-semibold ${!item.is_read ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {item.name}
                      </h4>
                      <span
                        className={`text-xs whitespace-nowrap ${!item.is_read ? "text-primary font-medium" : "text-muted-foreground"}`}
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

                    {!item.is_read && (
                      <div className="mt-1 flex">
                        <Badge variant="default" className="h-5 px-1.5 py-0 text-[10px]">
                          Baru
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Quick Actions (Hover) */}
                  <div className="flex items-end justify-end gap-2 opacity-100 transition-opacity sm:flex-col sm:opacity-0 sm:group-hover:opacity-100">
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
        <DialogContent className="sm:max-w-[600px]">
          {selectedMessage && (
            <>
              <DialogHeader>
                <div className="mb-4 flex items-center gap-3">
                  <Avatar className={`h-12 w-12 border ${getAvatarColor(selectedMessage.name)}`}>
                    <AvatarFallback className="bg-transparent text-lg">
                      {getInitials(selectedMessage.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <DialogTitle className="text-xl">{selectedMessage.subject}</DialogTitle>
                    <DialogDescription className="text-foreground mt-1 font-medium">
                      {selectedMessage.name}{" "}
                      <span className="text-muted-foreground font-normal">
                        &lt;{selectedMessage.email}&gt;
                      </span>
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="text-muted-foreground bg-muted/30 mb-4 grid gap-1 rounded-md border p-3 text-xs">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    {format(new Date(selectedMessage.created_at), "EEEE, dd MMMM yyyy", {
                      locale: idLocale,
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5" />
                  <span>
                    {format(new Date(selectedMessage.created_at), "HH:mm 'WIB'", {
                      locale: idLocale,
                    })}
                  </span>
                </div>
              </div>

              <div className="bg-muted/10 min-h-[150px] rounded-md border p-4 text-sm leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </div>

              <DialogFooter className="gap-2 sm:justify-between">
                <div className="text-muted-foreground flex items-center gap-1 text-xs">
                  <MailOpen className="h-3.5 w-3.5" />
                  <span>Status: Sudah dibaca</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setSelectedMessage(null)}>
                    Tutup
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => window.open(`mailto:${selectedMessage.email}`)}
                  >
                    Balas Email
                  </Button>
                </div>
              </DialogFooter>
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
