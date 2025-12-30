"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface TableSkeletonProps {
  /** Number of skeleton rows to display */
  rows?: number;
  /** Number of columns in the table */
  cols: number;
  /** Additional class name for the skeleton cells */
  className?: string;
}

/**
 * Reusable skeleton loader for table content
 * Displays animated pulse rows while data is loading
 */
export function TableSkeleton({ rows = 5, cols, className }: TableSkeletonProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <TableCell key={colIndex} className="py-4">
              <div
                className={cn(
                  "bg-muted h-4 animate-pulse rounded",
                  colIndex === 0 ? "w-24" : "mx-auto w-full max-w-[120px]",
                  className
                )}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

export default TableSkeleton;
