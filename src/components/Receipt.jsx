import { STORE_INFO } from '../data/seed'
import { fmtDate, money } from '../lib/format'

/**
 * Printable receipt for a sale. Rendered inside a Modal.
 */
export default function Receipt({ sale }) {
  if (!sale) return null
  return (
    <div id="printable-receipt" className="mx-auto max-w-sm bg-white p-6 text-slate-800">
      <div className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-600 text-xl text-white">
          🐾
        </div>
        <p className="text-base font-extrabold tracking-tight">{STORE_INFO.name}</p>
        <p className="text-xs text-slate-500">
          {STORE_INFO.address} · {STORE_INFO.phone}
        </p>
      </div>

      <div className="mt-4 border-y border-dashed border-slate-300 py-3 text-xs leading-relaxed">
        <div className="flex justify-between">
          <span className="text-slate-500">Invoice</span>
          <span className="font-semibold">{sale.invoiceNo}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Date</span>
          <span>{fmtDate(sale.date)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Channel</span>
          <span className="capitalize">
            {sale.channel === 'pos' ? 'In-store (POS)' : 'Online Order'}
          </span>
        </div>
        {sale.cashier && sale.cashier !== '—' && (
          <div className="flex justify-between">
            <span className="text-slate-500">Cashier</span>
            <span>{sale.cashier}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-slate-500">Customer</span>
          <span>{sale.customer?.name || 'Walk-in Customer'}</span>
        </div>
        {sale.customer?.phone && (
          <div className="flex justify-between">
            <span className="text-slate-500">Phone</span>
            <span>{sale.customer.phone}</span>
          </div>
        )}
      </div>

      <table className="mt-3 w-full text-xs">
        <thead>
          <tr className="border-b border-slate-200 text-left text-slate-500">
            <th className="pb-1 font-medium">Item</th>
            <th className="pb-1 text-center font-medium">Qty</th>
            <th className="pb-1 text-right font-medium">Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {sale.items.map((item) => (
            <tr key={item.id}>
              <td className="py-1.5 pr-2">
                <span className="block font-medium leading-snug">{item.name}</span>
                <span className="text-slate-400">{money(item.price)}</span>
              </td>
              <td className="py-1.5 text-center">{item.qty}</td>
              <td className="py-1.5 text-right font-medium">{money(item.price * item.qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3 space-y-1 border-t border-dashed border-slate-300 pt-3 text-xs">
        <div className="flex justify-between">
          <span className="text-slate-500">Subtotal</span>
          <span>{money(sale.subtotal)}</span>
        </div>
        {sale.discount > 0 && (
          <div className="flex justify-between text-emerald-700">
            <span>Discount ({sale.discountPct}%)</span>
            <span>− {money(sale.discount)}</span>
          </div>
        )}
        {sale.deliveryFee > 0 && (
          <div className="flex justify-between">
            <span className="text-slate-500">Delivery</span>
            <span>{money(sale.deliveryFee)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-slate-300 pt-2 text-base font-extrabold">
          <span>Total</span>
          <span>{money(sale.total)}</span>
        </div>
        <div className="flex justify-between pt-1">
          <span className="text-slate-500">Payment</span>
          <span className="font-medium">{sale.payment}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Status</span>
          <span className={sale.status === 'completed' ? 'font-medium text-emerald-700' : 'font-medium text-amber-600'}>
            {sale.status === 'completed' ? 'Paid / Completed' : 'Pending'}
          </span>
        </div>
      </div>

      <p className="mt-5 text-center text-xs text-slate-500">
        Thank you for shopping with us! 🐾
        <br />
        Items requiring a prescription were dispensed as per policy.
      </p>
    </div>
  )
}
