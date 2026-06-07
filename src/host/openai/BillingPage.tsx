import { CreditCard, Plus } from "lucide-react";
import clsx from "clsx";

export function BillingPage({ highlightPayment }: { highlightPayment: boolean }) {
  return (
    <div className="mx-auto w-full max-w-[920px] px-5 py-8 md:px-8 md:py-10">
      <h1 className="text-[28px] font-semibold tracking-[-0.025em]">Billing</h1>
      <p className="mt-2 text-sm text-[#676765]">Manage credits, payment methods, and invoices.</p>
      <section className="mt-8 rounded-xl border border-[#dededb] bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-5">
          <div>
            <p className="text-sm font-medium">Credit balance</p>
            <p className="mt-3 text-4xl font-semibold tracking-tight">$0.00</p>
            <p className="mt-2 text-xs text-[#777]">API requests pause when your balance reaches zero.</p>
          </div>
          <button className="rounded-lg border border-[#d9d9d6] px-4 py-2.5 text-sm font-medium">Add to balance</button>
        </div>
      </section>
      <section
        className={clsx(
          "mt-5 rounded-xl border bg-white p-6 transition duration-500",
          highlightPayment
            ? "border-[#3e8f70] ring-4 ring-[#3e8f70]/15"
            : "border-[#dededb]",
        )}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">Payment methods</h2>
            <p className="mt-1 text-xs text-[#777]">No payment method is attached to this account.</p>
          </div>
          <div className="grid size-10 place-items-center rounded-lg bg-[#f2f2f0] text-[#666]">
            <CreditCard size={18} />
          </div>
        </div>
        <button className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#111] px-4 py-2.5 text-sm font-medium text-white">
          <Plus size={15} />
          Add payment method
        </button>
      </section>
    </div>
  );
}
