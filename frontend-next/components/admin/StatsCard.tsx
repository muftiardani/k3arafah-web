import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  className?: string; // Additional classes
  variant?: "default" | "blue" | "green" | "orange" | "purple";
}

const variants = {
  default:
    "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100",
  blue: "bg-white dark:bg-slate-950 border-blue-100 dark:border-blue-900/50 text-blue-900 dark:text-blue-50 shadow-blue-100/50 dark:shadow-blue-900/20",
  green:
    "bg-white dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-50 shadow-emerald-100/50 dark:shadow-emerald-900/20",
  orange:
    "bg-white dark:bg-orange-950/40 border-orange-100 dark:border-orange-900/50 text-orange-900 dark:text-orange-50 shadow-orange-100/50 dark:shadow-orange-900/20",
  purple:
    "bg-white dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/50 text-purple-900 dark:text-purple-50 shadow-purple-100/50 dark:shadow-purple-900/20",
};

const iconUiVariants = {
  default: "bg-zinc-50 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
  green: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
  orange: "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400",
  purple: "bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400",
};

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  className,
  variant = "default",
}: StatsCardProps) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        variants[variant],
        className
      )}
    >
      {/* Background Gradient Blob */}
      <div
        className={cn(
          "absolute -top-24 -right-24 h-48 w-48 rounded-full opacity-50 blur-3xl dark:opacity-20",
          variant === "blue" && "bg-blue-400",
          variant === "green" && "bg-emerald-400",
          variant === "orange" && "bg-orange-400",
          variant === "purple" && "bg-purple-400",
          variant === "default" && "bg-zinc-400"
        )}
      />

      {/* Watermark Icon */}
      <div className="pointer-events-none absolute -right-8 -bottom-8 opacity-[0.06] dark:opacity-[0.04]">
        <Icon className="h-36 w-36 -rotate-12 text-current" />
      </div>

      <CardContent className="relative z-10 p-6">
        <div className="flex items-center justify-between space-y-0">
          <p className="text-muted-foreground/90 text-sm font-medium">{title}</p>
          <div className={cn("rounded-xl p-2.5 backdrop-blur-sm", iconUiVariants[variant])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-1">
          <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
          {description && (
            <p className="text-muted-foreground text-xs font-medium">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
