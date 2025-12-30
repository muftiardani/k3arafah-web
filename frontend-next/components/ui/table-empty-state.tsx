"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { FileX } from "lucide-react";
import { cn } from "@/lib/utils";

interface TableEmptyStateProps {
  /** Number of columns in the table (for colspan) */
  cols: number;
  /** Main title text */
  title: string;
  /** Optional description text */
  description?: string;
  /** Optional custom icon */
  icon?: React.ReactNode;
  /** Additional class name */
  className?: string;
}

/**
 * Reusable empty state component for tables
 * Displays when there's no data to show
 */
export function TableEmptyState({
  cols,
  title,
  description,
  icon,
  className,
}: TableEmptyStateProps) {
  return (
    <TableRow>
      <TableCell colSpan={cols} className={cn("h-64 text-center", className)}>
        <div className="text-muted-foreground flex flex-col items-center justify-center gap-3">
          <div className="bg-muted/50 rounded-full p-4">
            {icon || <FileX className="h-8 w-8 opacity-50" />}
          </div>
          <div className="space-y-1">
            <p className="text-lg font-semibold">{title}</p>
            {description && <p className="text-sm opacity-70">{description}</p>}
          </div>
        </div>
      </TableCell>
    </TableRow>
  );
}

export default TableEmptyState;
