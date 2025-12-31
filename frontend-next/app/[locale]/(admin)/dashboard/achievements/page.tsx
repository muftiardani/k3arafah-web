"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Plus,
  Trash2,
  Award,
  Loader2,
  Trophy,
  Mic,
  Crown,
  Music,
  BookOpen,
  Medal,
  Zap,
  Pencil,
  MoreVertical,
  Star,
  Search,
  Save,
  AlignLeft,
} from "lucide-react";

import {
  useAchievements,
  useCreateAchievement,
  useUpdateAchievement,
  useDeleteAchievement,
} from "@/lib/hooks";
import { type Achievement } from "@/lib/services/achievementService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils/date";
import { Badge } from "@/components/ui/badge";

const ICON_OPTIONS = [
  { value: "trophy", label: "Trophy", icon: Trophy },
  { value: "award", label: "Award", icon: Award },
  { value: "medal", label: "Medal", icon: Medal },
  { value: "crown", label: "Crown", icon: Crown },
  { value: "star", label: "Star", icon: Star },
  { value: "mic", label: "Mic", icon: Mic },
  { value: "music", label: "Music", icon: Music },
  { value: "book", label: "Book", icon: BookOpen },
  { value: "zap", label: "Zap", icon: Zap },
];

const COLOR_MAP: Record<
  string,
  { bg: string; text: string; border: string; from: string; to: string; shadow: string }
> = {
  yellow: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-200",
    from: "from-yellow-50",
    to: "to-white",
    shadow: "shadow-yellow-500/20",
  },
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
    from: "from-blue-50",
    to: "to-white",
    shadow: "shadow-blue-500/20",
  },
  slate: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    from: "from-slate-50",
    to: "to-white",
    shadow: "shadow-slate-500/20",
  },
  amber: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
    from: "from-amber-50",
    to: "to-white",
    shadow: "shadow-amber-500/20",
  },
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-200",
    from: "from-purple-50",
    to: "to-white",
    shadow: "shadow-purple-500/20",
  },
  emerald: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
    from: "from-emerald-50",
    to: "to-white",
    shadow: "shadow-emerald-500/20",
  },
  red: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
    from: "from-red-50",
    to: "to-white",
    shadow: "shadow-red-500/20",
  },
  orange: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
    from: "from-orange-50",
    to: "to-white",
    shadow: "shadow-orange-500/20",
  },
};

export default function AchievementsPage() {
  const t = useTranslations("Dashboard.AchievementsPage");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    icon: "trophy",
    color: "yellow",
  });

  // Use hooks with caching
  const { data: achievements = [], isLoading } = useAchievements();
  const createMutation = useCreateAchievement();
  const updateMutation = useUpdateAchievement();
  const deleteMutation = useDeleteAchievement();

  const filteredAchievements = achievements.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (confirm(t("delete_confirm"))) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (item: Achievement) => {
    setEditingAchievement(item);
    setFormData({
      title: item.title,
      subtitle: item.subtitle || "",
      description: item.description || "",
      icon: item.icon,
      color: item.color,
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingAchievement(null);
    setFormData({ title: "", subtitle: "", description: "", icon: "trophy", color: "yellow" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAchievement) {
      updateMutation.mutate(
        { id: editingAchievement.id, data: formData },
        { onSuccess: closeDialog }
      );
    } else {
      createMutation.mutate(formData, { onSuccess: closeDialog });
    }
  };

  const getIconComponent = (iconName: string) => {
    const found = ICON_OPTIONS.find((i) => i.value === iconName);
    return found ? found.icon : Trophy;
  };

  const getColorStyles = (colorName: string) => {
    return COLOR_MAP[colorName] || COLOR_MAP["yellow"];
  };

  if (isLoading) {
    return (
      <div className="flex w-full flex-col gap-8 pb-10">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="bg-muted h-8 w-48 animate-pulse rounded-lg" />
            <div className="bg-muted h-4 w-64 animate-pulse rounded-lg" />
          </div>
          <div className="bg-muted h-10 w-32 animate-pulse rounded-lg" />
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-muted h-64 animate-pulse rounded-3xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-8 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground text-lg">{t("description")}</p>
        </div>

        <div className="flex items-center gap-3">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingAchievement(null);
                  setFormData({
                    title: "",
                    subtitle: "",
                    description: "",
                    icon: "trophy",
                    color: "yellow",
                  });
                }}
                className="bg-yellow-600 text-white shadow-lg shadow-yellow-500/20 transition-all hover:scale-105 hover:bg-yellow-700"
              >
                <Plus className="mr-2 h-5 w-5" /> {t("add_new")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[95vw] overflow-hidden border-none p-0 shadow-2xl lg:max-w-4xl">
              <div className="bg-background grid h-[85vh] lg:h-auto lg:grid-cols-5">
                {/* Left Column: Form */}
                <div className="flex flex-col overflow-y-auto p-6 lg:col-span-3 lg:p-8">
                  <DialogHeader className="mb-6 px-1">
                    <DialogTitle className="text-2xl font-bold">
                      {editingAchievement ? "Edit Prestasi" : t("add_new")}
                    </DialogTitle>
                    <DialogDescription className="text-base">
                      Catat dan rayakan pencapaian terbaru di sini.
                    </DialogDescription>
                  </DialogHeader>

                  <form id="achievement-form" onSubmit={handleSubmit} className="flex-1 space-y-5">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-foreground text-sm font-semibold">Icon</Label>
                          <Select
                            value={formData.icon}
                            onValueChange={(val) => setFormData({ ...formData, icon: val })}
                          >
                            <SelectTrigger className="h-10 border-zinc-200 bg-white font-medium transition-all focus:ring-yellow-500 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-yellow-600">
                              <SelectValue placeholder="Pilih Ikon" />
                            </SelectTrigger>
                            <SelectContent>
                              {ICON_OPTIONS.map((opt) => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  <div className="flex items-center gap-2">
                                    <opt.icon className="h-4 w-4" />
                                    <span className="capitalize">{opt.label}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label className="text-foreground text-sm font-semibold">Warna</Label>
                          <Select
                            value={formData.color}
                            onValueChange={(val) => setFormData({ ...formData, color: val })}
                          >
                            <SelectTrigger className="h-10 border-zinc-200 bg-white font-medium transition-all focus:ring-yellow-500 dark:border-zinc-800 dark:bg-zinc-950 dark:focus:ring-yellow-600">
                              <SelectValue placeholder="Pilih Warna" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.keys(COLOR_MAP).map((key) => (
                                <SelectItem key={key} value={key}>
                                  <div className="flex items-center gap-2">
                                    <div
                                      className={`h-3 w-3 rounded-full ${COLOR_MAP[key].bg.replace("bg-", "bg-")}`}
                                    />
                                    <span className="capitalize">{key}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="title" className="text-foreground text-sm font-semibold">
                          Judul Prestasi
                        </Label>
                        <div className="relative">
                          <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            placeholder="Misal: Juara 1 Lomba Sains"
                            className="h-10 border-zinc-200 bg-white pl-9 font-medium transition-all focus-visible:ring-yellow-500 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-visible:ring-yellow-600"
                          />
                          <Trophy className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subtitle" className="text-foreground text-sm font-semibold">
                          Subjudul / Tingkat
                        </Label>
                        <div className="relative">
                          <Input
                            id="subtitle"
                            value={formData.subtitle}
                            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                            placeholder="Misal: Tingkat Nasional 2024"
                            className="h-10 border-zinc-200 bg-white pl-9 font-medium transition-all focus-visible:ring-yellow-500 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-visible:ring-yellow-600"
                          />
                          <Crown className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor="description"
                          className="text-foreground text-sm font-semibold"
                        >
                          Deskripsi
                        </Label>
                        <div className="relative">
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) =>
                              setFormData({ ...formData, description: e.target.value })
                            }
                            placeholder="Deskripsi singkat, misal nama pemenang..."
                            rows={4}
                            className="min-h-[100px] resize-none border-zinc-200 bg-white pl-9 font-medium transition-all focus-visible:ring-yellow-500 dark:border-zinc-800 dark:bg-zinc-950 dark:focus-visible:ring-yellow-600"
                          />
                          <AlignLeft className="text-muted-foreground absolute top-3 left-3 h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </form>

                  <DialogFooter className="border-border/10 mt-8 border-t pt-4">
                    <Button type="button" variant="ghost" onClick={closeDialog}>
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      form="achievement-form"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      className="bg-yellow-600 text-white hover:bg-yellow-700"
                    >
                      {createMutation.isPending || updateMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      {createMutation.isPending || updateMutation.isPending
                        ? "Menyimpan..."
                        : editingAchievement
                          ? "Simpan Perubahan"
                          : "Simpan Prestasi"}
                    </Button>
                  </DialogFooter>
                </div>

                {/* Right Column: Preview */}
                <div className="bg-muted/30 border-border/50 relative hidden flex-col items-center justify-center border-l p-8 lg:col-span-2 lg:flex">
                  <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-[0.4] dark:opacity-[0.1]" />
                  <div className="z-10 flex w-full flex-col items-center gap-6">
                    <div className="text-muted-foreground border-border/50 flex items-center gap-2 rounded-full border bg-white/50 px-4 py-1.5 text-sm font-medium tracking-wider uppercase backdrop-blur-sm dark:bg-black/20">
                      <Star className="h-3.5 w-3.5" /> Live Preview
                    </div>

                    <div
                      className={`relative w-full max-w-[280px] overflow-hidden rounded-2xl border bg-linear-to-br p-6 shadow-2xl transition-all duration-500 ease-out hover:scale-[1.02] ${getColorStyles(formData.color).from} ${getColorStyles(formData.color).to} ${getColorStyles(formData.color).border} ${getColorStyles(formData.color).shadow}`}
                    >
                      {/* Shine Effect */}
                      <div className="pointer-events-none absolute top-0 right-0 -mt-10 -mr-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" />

                      <div
                        className={`mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm ring-4 ring-white/60 dark:ring-black/10 ${getColorStyles(formData.color).bg} ${getColorStyles(formData.color).text}`}
                      >
                        {(() => {
                          const Icon = getIconComponent(formData.icon);
                          return <Icon className="h-8 w-8" />;
                        })()}
                      </div>
                      <div className="space-y-1 text-center">
                        <h3 className="text-foreground line-clamp-2 text-xl font-bold tracking-tight">
                          {formData.title || "Judul Prestasi"}
                        </h3>
                        <p
                          className={`text-sm font-semibold ${getColorStyles(formData.color).text}`}
                        >
                          {formData.subtitle || "Tingkat/Tahun"}
                        </p>
                      </div>
                      <div className="mt-5 border-t border-black/5 pt-4 dark:border-white/5">
                        <p className="text-muted-foreground line-clamp-3 text-center text-sm leading-relaxed">
                          {formData.description || "Deskripsi akan muncul di sini secara detail..."}
                        </p>
                      </div>
                    </div>

                    <p className="text-muted-foreground max-w-[200px] text-center text-xs">
                      Preview tampilan kartu di halaman dashboard
                    </p>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats & Search */}
      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <Card className="border-none bg-linear-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20">
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <div className="rounded-xl border border-yellow-100 bg-white p-3 shadow-sm dark:border-yellow-900 dark:bg-slate-950">
                <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm font-medium">Total Prestasi</p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                  {achievements.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="min-w-[300px] flex-1">
          <div className="relative h-full">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Cari prestasi..."
              className="h-full border-zinc-200 bg-white pl-9 dark:border-zinc-800 dark:bg-slate-950"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {filteredAchievements.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAchievements.map((item) => {
            const Icon = getIconComponent(item.icon);
            const styles = getColorStyles(item.color);

            return (
              <div
                key={item.id}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-linear-to-br p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${styles.from} ${styles.to} ${styles.border} ${styles.shadow}`}
              >
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 -mt-6 -mr-6 h-24 w-24 rounded-full bg-white/20 blur-xl transition-all group-hover:bg-white/30" />

                {/* Action Menu */}
                <div className="absolute top-3 right-3 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-white/60 backdrop-blur-sm hover:bg-white dark:bg-black/20 dark:hover:bg-black/40"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(item)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600 focus:text-red-600"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div
                  className={`mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm ring-4 ring-white/60 dark:ring-white/10 ${styles.bg} ${styles.text} transition-transform group-hover:scale-110`}
                >
                  <Icon className="h-7 w-7" />
                </div>

                <div className="flex flex-1 flex-col text-center">
                  <h3
                    className="text-foreground group-hover:text-primary mb-1 line-clamp-2 text-lg font-bold tracking-tight transition-colors"
                    title={item.title}
                  >
                    {item.title}
                  </h3>
                  <Badge
                    variant="outline"
                    className={`mx-auto mb-4 border-none bg-white/50 px-3 py-1 text-xs font-semibold dark:bg-black/10 ${styles.text}`}
                  >
                    {item.subtitle}
                  </Badge>

                  {item.description && (
                    <p className="text-muted-foreground mt-auto line-clamp-3 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>

                <div className="text-muted-foreground/50 mt-5 border-t border-black/5 pt-3 text-center text-[10px] font-medium tracking-widest uppercase dark:border-white/5">
                  {formatDate(item.created_at, "long")}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="border-muted-foreground/20 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed bg-zinc-50 py-20 text-center dark:bg-zinc-900/30">
          <div className="mb-6 rounded-full bg-white p-6 shadow-sm dark:bg-slate-950">
            <Trophy className="h-12 w-12 text-zinc-300" />
          </div>
          <h3 className="mb-2 text-xl font-bold">{t("empty")}</h3>
          <p className="text-muted-foreground max-w-sm">
            {searchQuery
              ? "Tidak ada prestasi yang cocok dengan pencarian."
              : "Belum ada prestasi yang dicatat. Mulai tambahkan prestasi siswa atau sekolah."}
          </p>
        </div>
      )}
    </div>
  );
}
