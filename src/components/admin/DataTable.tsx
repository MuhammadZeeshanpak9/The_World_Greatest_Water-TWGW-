"use client";

import type { ReactNode } from "react";
import { Search, ChevronLeft, ChevronRight, AlertTriangle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Column<T> = {
  header: string;
  accessor: (row: T) => ReactNode;
  className?: string;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  emptyIcon: LucideIcon;
  emptyMessage: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRowClick?: (row: T) => void;
  rowClassName?: (row: T) => string;
};

export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  loading,
  error,
  onRetry,
  emptyIcon: EmptyIcon,
  emptyMessage,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search…",
  filters,
  page,
  totalPages,
  onPageChange,
  onRowClick,
  rowClassName,
}: DataTableProps<T>) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5">
      {(onSearchChange || filters) && (
        <div className="flex flex-wrap items-center gap-3 border-b border-white/10 p-4">
          {onSearchChange && (
            <div className="relative min-w-[200px] flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-white/40"
              />
              <input
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-lg bg-white/[0.08] py-2 pr-3 pl-9 font-inter text-sm text-white placeholder:text-white/40 focus:ring-1 focus:ring-[#6B2FA0] focus:outline-none"
              />
            </div>
          )}
          {filters}
        </div>
      )}

      {error ? (
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <AlertTriangle size={28} className="text-[#EF4444]" />
          <p className="font-inter text-sm text-white/60">{error}</p>
          <button
            onClick={onRetry}
            className="rounded-lg bg-[#6B2FA0] px-4 py-2 font-inter text-sm font-semibold text-white hover:opacity-90"
          >
            Retry
          </button>
        </div>
      ) : loading ? (
        <div className="space-y-3 p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded-lg bg-white/5" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <EmptyIcon size={28} className="text-white/30" />
          <p className="font-inter text-sm text-white/50">{emptyMessage}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/10">
                {columns.map((col) => (
                  <th
                    key={col.header}
                    className={`px-4 py-3 font-inter text-[11px] font-semibold tracking-wider text-white/40 uppercase ${col.className ?? ""}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={rowKey(row)}
                  onClick={() => onRowClick?.(row)}
                  className={`border-b border-white/5 transition-colors hover:bg-[#6B2FA0]/10 ${onRowClick ? "cursor-pointer" : ""} ${rowClassName?.(row) ?? ""}`}
                >
                  {columns.map((col) => (
                    <td
                      key={col.header}
                      className={`px-4 py-3 font-inter text-sm text-white/90 ${col.className ?? ""}`}
                    >
                      {col.accessor(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!error && !loading && rows.length > 0 && totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
          <span className="font-inter text-xs text-white/40">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="rounded-lg border border-white/10 p-1.5 text-white/60 hover:text-white disabled:opacity-30"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
              className="rounded-lg border border-white/10 p-1.5 text-white/60 hover:text-white disabled:opacity-30"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
