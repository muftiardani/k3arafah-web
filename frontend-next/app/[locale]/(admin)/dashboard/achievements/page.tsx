"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
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
} from "lucide-react";
import { toast } from "sonner";

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
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils/date";

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
  { bg: string; text: string; border: string; from: string; to: string }
> = {
  yellow: {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    border: "border-yellow-200",
    from: "from-yellow-50",
    to: "to-white",
  },
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-700",
    border: "border-blue-200",
    from: "from-blue-50",
    to: "to-white",
  },
  slate: {
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200",
    from: "from-slate-50",
    to: "to-white",
  },
  amber: {
    bg: "bg-amber-100",
    text: "text-amber-700",
    border: "border-amber-200",
    from: "from-amber-50",
    to: "to-white",
  },
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-700",
    border: "border-purple-200",
    from: "from-purple-50",
    to: "to-white",
  },
  emerald: {
    bg: "bg-emerald-100",
    text: "text-emerald-700",
    border: "border-emerald-200",
    from: "from-emerald-50",
    to: "to-white",
  },
  red: {
    bg: "bg-red-100",
    text: "text-red-700",
    border: "border-red-200",
    from: "from-red-50",
    to: "to-white",
  },
  orange: {
    bg: "bg-orange-100",
    text: "text-orange-700",
    border: "border-orange-200",
    from: "from-orange-50",
    to: "to-white",
  },
};

export default function AchievementsPage() {
  const t = useTranslations("Dashboard.AchievementsPage");
  const locale = useLocale();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    icon: "trophy",
    color: "yellow",
  });

  // Use hooks with caching
  const { data: achievements, isLoading } = useAchievements();
  const createMutation = useCreateAchievement();
  const updateMutation = useUpdateAchievement();
  const deleteMutation = useDeleteAchievement();

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
      updateMutation.mutate({ id: editingAchievement.id, data: formData });
    } else {
      createMutation.mutate(formData);
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
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="h-9 w-48 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="mt-2 h-5 w-72 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
          <div className="h-10 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        </div>
        <div className="h-px w-full bg-gray-200 dark:bg-gray-700" />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <div className="mx-auto mb-4 h-14 w-14 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="space-y-2 text-center">
                <div className="mx-auto h-5 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="mx-auto h-4 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
                <div className="mx-auto h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-8 pb-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
          <p className="text-muted-foreground text-lg">{t("description")}</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-primary/20 shadow-lg transition-all hover:scale-105">
              <Plus className="mr-2 h-5 w-5" /> {t("add_new")}
            </Button>
          </DialogTrigger>
          <DialogContent className="gap-0 overflow-hidden p-0 sm:max-w-4xl">
            <div className="grid h-full md:grid-cols-5">
              {/* Left Column: Form */}
              <div className="space-y-6 p-6 md:col-span-3">
                <DialogHeader className="px-0">
                  <DialogTitle className="text-xl">
                    {editingAchievement ? "Edit Prestasi" : t("add_new")}
                  </DialogTitle>
                  <DialogDescription>{t("description")}</DialogDescription>
                </DialogHeader>

                <form id="achievement-form" onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="icon">{t("form.icon")}</Label>
                      <Select
                        value={formData.icon}
                        onValueChange={(val) => setFormData({ ...formData, icon: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Ikon" />
                        </SelectTrigger>
                        <SelectContent>
                          {ICON_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              <div className="flex items-center gap-2">
                                <opt.icon className="h-4 w-4" />
                                <span>{opt.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="color">{t("form.color")}</Label>
                      <Select
                        value={formData.color}
                        onValueChange={(val) => setFormData({ ...formData, color: val })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Warna" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(COLOR_MAP).map((key) => (
                            <SelectItem key={key} value={key}>
                              <div className="flex items-center gap-2">
                                <div className={`h-4 w-4 rounded-full ${COLOR_MAP[key].bg}`} />
                                <span className="capitalize">{key}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title">{t("form.title")}</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      placeholder="Contoh: Juara 1 Lomba Pidato"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subtitle">{t("form.subtitle")}</Label>
                    <Input
                      id="subtitle"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      placeholder="Contoh: Tingkat Nasional 2024"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">{t("form.description")}</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Keterangan tambahan, misal nama siswa..."
                    />
                  </div>
                </form>

                <DialogFooter className="mt-8">
                  <Button type="button" variant="ghost" onClick={closeDialog}>
                    {t("form.cancel")}
                  </Button>
                  <Button
                    type="submit"
                    form="achievement-form"
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    {(createMutation.isPending || updateMutation.isPending) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {t("form.submit")}
                  </Button>
                </DialogFooter>
              </div>

              {/* Right Column: Preview */}
              <div className="bg-muted/30 relative flex flex-col items-center justify-center overflow-hidden border-l p-6 text-center md:col-span-2">
                <div className="from-primary/5 pointer-events-none absolute inset-0 bg-linear-to-br to-transparent" />
                <div className="z-10 w-full max-w-[280px]">
                  <p className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider uppercase">
                    Live Preview
                  </p>

                  {/* Card Preview */}
                  <div
                    className={`relative overflow-hidden rounded-xl border bg-linear-to-br p-6 shadow-xl transition-all ${getColorStyles(formData.color).from} ${getColorStyles(formData.color).to} ${getColorStyles(formData.color).border}`}
                  >
                    <div
                      className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full shadow-sm ring-4 ring-white ${getColorStyles(formData.color).bg} ${getColorStyles(formData.color).text}`}
                    >
                      {(() => {
                        const Icon = getIconComponent(formData.icon);
                        return <Icon className="h-8 w-8" />;
                      })()}
                    </div>
                    <h3 className="text-foreground line-clamp-2 text-lg font-bold tracking-tight">
                      {formData.title || "Judul Prestasi"}
                    </h3>
                    <p className={`mt-1 font-medium ${getColorStyles(formData.color).text}`}>
                      {formData.subtitle || "Tingkat/Tahun"}
                    </p>
                    <div className="mt-4 border-t pt-4">
                      <p className="text-muted-foreground line-clamp-3 text-sm">
                        {formData.description || "Deskripsi singkat mengenai pencapaian ini."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Separator className="bg-border/60" />

      {achievements && achievements.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {achievements.map((item) => {
            const Icon = getIconComponent(item.icon);
            const styles = getColorStyles(item.color);

            return (
              <div
                key={item.id}
                className={`group relative flex flex-col overflow-hidden rounded-xl border bg-linear-to-br p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${styles.from} ${styles.to} ${styles.border}`}
              >
                {/* Action Menu */}
                <div className="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground h-8 w-8 rounded-full bg-white/50 shadow-sm hover:bg-white"
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
                  className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full shadow-sm ring-4 ring-white ${styles.bg} ${styles.text}`}
                >
                  <Icon className="h-7 w-7" />
                </div>

                <div className="flex flex-1 flex-col text-center">
                  <h3
                    className="text-foreground mb-1 line-clamp-2 text-lg font-bold tracking-tight"
                    title={item.title}
                  >
                    {item.title}
                  </h3>
                  <p className={`mb-3 text-sm font-semibold ${styles.text}`}>{item.subtitle}</p>
                  {item.description && (
                    <p className="text-muted-foreground mt-auto line-clamp-3 border-t pt-3 text-xs leading-relaxed">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="text-muted-foreground/60 mt-4 flex w-full items-center justify-between border-t pt-3 text-[10px]">
                  <span>Ditambahkan:</span>
                  <span>{formatDate(item.created_at, "long")}</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-muted/30 border-muted-foreground/20 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed py-20 text-center">
          <div className="bg-background mb-6 rounded-full p-6 shadow-sm">
            <Trophy className="text-muted-foreground/50 h-12 w-12" />
          </div>
          <h3 className="mb-2 text-xl font-semibold">{t("empty")}</h3>
          <p className="text-muted-foreground max-w-sm">
            Belum ada prestasi yang dicatat. Mulai tambahkan prestasi siswa atau sekolah.
          </p>
          <Button variant="outline" className="mt-6" onClick={() => setIsDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Prestasi Baru
          </Button>
        </div>
      )}
    </div>
  );
}
