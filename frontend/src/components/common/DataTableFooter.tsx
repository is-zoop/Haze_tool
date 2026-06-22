import { Pagination } from "@/components/ui/pagination";

interface DataTableFooterProps {
  totalItems: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: { value: number; label: string }[];
  totalLabel?: string;
  itemsLabel?: string;
  langCode?: string;
}

export function DataTableFooter({
  totalItems,
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions,
  totalLabel,
  itemsLabel,
  langCode = "ZH",
}: DataTableFooterProps) {
  // Localized defaults
  let finalTotalLabel = totalLabel || "共";
  let finalItemsLabel = itemsLabel || "项";
  let defaultPageSizes = pageSizeOptions || [
    { value: 6, label: "6 项/页" },
    { value: 12, label: "12 项/页" },
    { value: 18, label: "18 项/页" },
    { value: 24, label: "24 项/页" },
  ];

  if (langCode === "EN") {
    finalTotalLabel = totalLabel || "Total";
    finalItemsLabel = itemsLabel || "items";
    if (!pageSizeOptions) {
      defaultPageSizes = [
        { value: 6, label: "6 / page" },
        { value: 12, label: "12 / page" },
        { value: 18, label: "18 / page" },
        { value: 24, label: "24 / page" },
      ];
    }
  } else if (langCode === "JA") {
    finalTotalLabel = totalLabel || "合計";
    finalItemsLabel = itemsLabel || "件";
    if (!pageSizeOptions) {
      defaultPageSizes = [
        { value: 6, label: "6 件/ページ" },
        { value: 12, label: "12 件/ページ" },
        { value: 18, label: "18 件/ページ" },
        { value: 24, label: "24 件/ページ" },
      ];
    }
  } else if (langCode === "ES") {
    finalTotalLabel = totalLabel || "Total";
    finalItemsLabel = itemsLabel || "ítems";
    if (!pageSizeOptions) {
      defaultPageSizes = [
        { value: 6, label: "6 / pág." },
        { value: 12, label: "12 / pág." },
        { value: 18, label: "18 / pág." },
        { value: 24, label: "24 / pág." },
      ];
    }
  }

  return (
    <div className="h-12 px-4 flex flex-row items-center justify-between gap-2 shrink-0">
      <div className="flex items-center gap-3 text-xs text-muted-foreground font-semibold">
        <span>{finalTotalLabel} {totalItems} {finalItemsLabel}</span>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        pageSize={pageSize}
        onPageSizeChange={onPageSizeChange}
        pageSizeOptions={defaultPageSizes}
        className="w-auto"
      />
    </div>
  );
}
