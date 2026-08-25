import type { CartItem } from "@/context/CartContext";
import type { SelectedRate } from "./types";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export default function OrderSummary({
  items,
  total,
  selectedRate,
  freeShipping,
}: {
  items: CartItem[];
  total: number;
  selectedRate?: SelectedRate | null;
  freeShipping?: boolean;
}) {
  const shippingCost = freeShipping ? 0 : (selectedRate?.rate ?? 0);
  // TODO: promo/discount code system — deferred to post-launch Phase 2. When it lands, subtract
  // the discount here before computing grandTotal.
  const grandTotal = total + shippingCost;

  return (
    <div className="rounded-[20px] glass-card-light p-6 ">
      <h3 className="font-cormorant text-[22px] text-ink">Order Summary</h3>
      {items.length === 0 ? (
        <p className="mt-4 font-inter text-[13px] italic text-muted">Your Cart is Empty</p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between font-inter text-[13px] text-body">
              <span>
                {item.product?.name ?? "Product"} × {item.quantity}
              </span>
              <span>{formatCurrency(item.price_snapshot * item.quantity)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex flex-col gap-3 border-t border-violet/10 pt-6">
        <div className="flex items-center justify-between font-inter text-[13px] text-body">
          <span>Subtotal</span>
          <span>{formatCurrency(total)}</span>
        </div>
        <div className="flex items-center justify-between font-inter text-[13px] text-body">
          <span>
            Shipping
            {selectedRate && !freeShipping && (
              <span className="ml-1 text-muted">
                ({selectedRate.carrier} — {selectedRate.service})
              </span>
            )}
          </span>
          <span className={freeShipping ? "font-semibold text-teal" : ""}>
            {freeShipping ? "Free" : selectedRate ? formatCurrency(shippingCost) : "—"}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-violet/10 pt-3 font-inter text-[15px] font-semibold text-ink">
          <span>Total</span>
          <span className="text-violet">{formatCurrency(grandTotal)}</span>
        </div>
      </div>
    </div>
  );
}
