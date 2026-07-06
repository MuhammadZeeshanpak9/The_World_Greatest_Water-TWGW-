export default function OrderSummary() {
  return (
    <div className="rounded-[20px] border border-violet/10 bg-white/70 p-6 shadow-[0_20px_60px_rgba(107,47,160,0.1)] backdrop-blur">
      <h3 className="font-cormorant text-[22px] text-ink">Order Summary</h3>
      <p className="mt-4 font-inter text-[13px] italic text-muted">Your Cart is Empty</p>

      <div className="mt-6 flex flex-col gap-3 border-t border-violet/10 pt-6">
        <div className="flex items-center justify-between font-inter text-[13px] text-body">
          <span>Subtotal</span>
          <span>$0.00</span>
        </div>
        <div className="flex items-center justify-between font-inter text-[13px] text-body">
          <span>Shipping</span>
          <span>$0.00</span>
        </div>
        <div className="flex items-center justify-between font-inter text-[13px] text-body">
          <span>Tax</span>
          <span>$0.00</span>
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-violet/10 pt-3 font-inter text-[15px] font-semibold text-ink">
          <span>Total</span>
          <span className="text-violet">$0.00</span>
        </div>
      </div>
    </div>
  );
}
