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
  default: "bg-background text-foreground hover:border-zinc-400",
  blue: "bg-linear-to-br from-blue-50 via-white to-blue-50 text-blue-900 border-blue-100 hover:border-blue-300 dark:from-blue-950/40 dark:via-blue-900/10 dark:to-blue-950/40 dark:text-blue-100 dark:border-blue-800",
  green:
    "bg-linear-to-br from-emerald-50 via-white to-emerald-50 text-emerald-900 border-emerald-100 hover:border-emerald-300 dark:from-emerald-950/40 dark:via-emerald-900/10 dark:to-emerald-950/40 dark:text-emerald-100 dark:border-emerald-800",
  orange:
    "bg-linear-to-br from-orange-50 via-white to-orange-50 text-orange-900 border-orange-100 hover:border-orange-300 dark:from-orange-950/40 dark:via-orange-900/10 dark:to-orange-950/40 dark:text-orange-100 dark:border-orange-800",
  purple:
    "bg-linear-to-br from-purple-50 via-white to-purple-50 text-purple-900 border-purple-100 hover:border-purple-300 dark:from-purple-950/40 dark:via-purple-900/10 dark:to-purple-950/40 dark:text-purple-100 dark:border-purple-800",
};

const iconVariants = {
  default: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300",
  blue: "bg-white text-blue-600 shadow-sm shadow-blue-100 dark:bg-blue-900/50 dark:text-blue-300 dark:shadow-none",
  green:
    "bg-white text-emerald-600 shadow-sm shadow-emerald-100 dark:bg-emerald-900/50 dark:text-emerald-300 dark:shadow-none",
  orange:
    "bg-white text-orange-600 shadow-sm shadow-orange-100 dark:bg-orange-900/50 dark:text-orange-300 dark:shadow-none",
  purple:
    "bg-white text-purple-600 shadow-sm shadow-purple-100 dark:bg-purple-900/50 dark:text-purple-300 dark:shadow-none",
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
        "relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
        variants[variant],
        className
      )}
    >
      {/* Watermark Icon */}
      <div className="pointer-events-none absolute -right-6 -bottom-6 opacity-[0.05] dark:opacity-[0.03]">
        <Icon className="h-32 w-32 -rotate-12" />
      </div>

      <CardContent className="relative z-10 p-6">
        <div className="flex items-center justify-between space-y-0">
          <p className="text-sm font-medium opacity-80">{title}</p>
          <div className={cn("rounded-xl p-2.5", iconVariants[variant])}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <div className="mt-4 flex items-baseline justify-between">
          <h2 className="text-3xl font-bold tracking-tight">{value}</h2>
        </div>
        {description && (
          <p className="text-muted-foreground/80 mt-1 text-xs font-medium">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
