import { CreditCard, Plus } from "lucide-react";
import clsx from "clsx";

export function BillingPage({ highlightPayment }: { highlightPayment: boolean }) {
  return (
    <div className="mx-auto w-full max-w-[980px] px-5 py-8 md:px-10 md:py-11">
      <div className="mb-3 flex items-center gap-2 text-[11px] font-medium text-[#777980]">
        <span>Organization</span><span>/</span><span className="text-[#aaaab0]">Billing</span>
      </div>
      <h1 className="text-[30px] font-semibold tracking-[-0.035em] text-[#f5f5f6]">Billing</h1>
      <p className="mt-2 text-sm text-[#8f9198]">Manage credits, payment methods, and invoices.</p>
      <section className="mt-8 rounded-xl border border-white/[0.08] bg-[#1b1c1f] p-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-sm font-medium text-[#c9c9cc]">Credit balance</p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-white">$0.00</p>
            <p className="mt-2 text-xs text-[#777980]">API requests pause when your balance reaches zero.</p>
          </div>
          <button className="rounded-lg border border-white/[0.1] bg-white/[0.04] px-4 py-2.5 text-sm font-medium text-[#d8d8da] hover:bg-white/[0.08]">Add to balance</button>
        </div>
      </section>
      <section
        className={clsx(
          "mt-5 rounded-xl border bg-[#1b1c1f] p-6 transition duration-500",
          highlightPayment
            ? "border-[#4a9b73] ring-4 ring-[#4a9b73]/15"
            : "border-white/[0.08]",
        )}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-[#ededee]">Payment methods</h2>
            <p className="mt-1 text-xs text-[#7f8188]">No payment method is attached to this account.</p>
          </div>
          <div className="grid size-10 place-items-center rounded-lg border border-white/[0.07] bg-white/[0.04] text-[#96989f]">
            <CreditCard size={18} />
          </div>
        </div>
        <button className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#eeeeef] px-4 py-2.5 text-sm font-medium text-[#171719] hover:bg-white">
          <Plus size={15} />
          Add payment method
        </button>
      </section>
    </div>
  );
}
