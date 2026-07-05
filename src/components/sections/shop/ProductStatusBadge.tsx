import type { ProductStatus } from "@/types";

export function getProductCta(status: ProductStatus): { label: string; disabled: boolean } {
  switch (status) {
    case "sold-out":
      return { label: "Notify Me", disabled: false };
    case "available":
      return { label: "Add To Cart", disabled: false };
    case "coming-soon":
      return { label: "Coming Soon", disabled: true };
  }
}

export default function ProductStatusBadge({ status }: { status: ProductStatus }) {
  if (status === "sold-out") {
    return (
      <span className="rounded-full border border-muted/40 px-3 py-1 font-inter text-[10px] font-semibold uppercase tracking-[0.15em] text-muted">
        Sold Out
      </span>
    );
  }
  if (status === "available") {
    return (
      <span className="rounded-full bg-teal/15 px-3 py-1 font-inter text-[10px] font-semibold uppercase tracking-[0.15em] text-teal">
        Available
      </span>
    );
  }
  return (
    <span className="rounded-full border border-violet px-3 py-1 font-inter text-[10px] font-semibold uppercase tracking-[0.15em] text-violet">
      Coming Soon
    </span>
  );
}
