import { useMemo, useState } from 'react'
import { useStore } from '../../context/StoreContext'
import { fmtDate, money } from '../../lib/format'
import Modal from '../../components/Modal'
import Receipt from '../../components/Receipt'

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'pos', label: 'In-store (POS)' },
  { id: 'online', label: 'Online Orders' },
  { id: 'pending', label: 'Pending' },
]

export default function Sales() {
  const { sales, markSaleCompleted } = useStore()
  const [tab, setTab] = useState('all')
  const [receiptFor, setReceiptFor] = useState(null)

  const filtered = useMemo(() => {
    switch (tab) {
      case 'pos':
        return sales.filter((s) => s.channel === 'pos')
      case 'online':
        return sales.filter((s) => s.channel === 'online')
      case 'pending':
        return sales.filter((s) => s.status === 'pending')
      default:
        return sales
    }
  }, [sales, tab])

  const revenue = filtered.reduce((n, s) => n + s.total, 0)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Sales &amp; Orders</h1>
        <p className="mt-1 text-sm text-slate-500">
          {filtered.length} record{filtered.length !== 1 ? 's' : ''} · {money(revenue)} revenue
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => {
          const count =
            t.id === 'all'
              ? sales.length
              : t.id === 'pending'
                ? sales.filter((s) => s.status === 'pending').length
                : sales.filter((s) => s.channel === t.id).length
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab === t.id
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-200 bg-white text-slate-500 hover:border-emerald-400'
              }`}
            >
              {t.label} ({count})
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center">
          <span className="text-5xl">🧾</span>
          <p className="font-medium text-slate-600">No sales in this view yet</p>
          <p className="text-sm text-slate-400">Completed sales and online orders will appear here.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-200 text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3 font-semibold">Invoice</th>
                <th className="px-3 py-3 font-semibold">Date</th>
                <th className="px-3 py-3 font-semibold">Customer</th>
                <th className="px-3 py-3 font-semibold">Channel</th>
                <th className="px-3 py-3 font-semibold">Payment</th>
                <th className="px-3 py-3 text-center font-semibold">Items</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 text-right font-semibold">Total</th>
                <th className="px-5 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((s) => (
                <tr key={s.id} className="transition hover:bg-slate-50/60">
                  <td className="px-5 py-3 font-semibold text-slate-700">{s.invoiceNo}</td>
                  <td className="px-3 py-3 whitespace-nowrap text-slate-500">{fmtDate(s.date)}</td>
                  <td className="px-3 py-3">
                    <p className="font-medium text-slate-700">{s.customer?.name}</p>
                    {s.customer?.phone && <p className="text-xs text-slate-400">{s.customer.phone}</p>}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        s.channel === 'pos' ? 'bg-sky-50 text-sky-700' : 'bg-violet-50 text-violet-700'
                      }`}
                    >
                      {s.channel === 'pos' ? 'In-store' : 'Online'}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-slate-500">{s.payment}</td>
                  <td className="px-3 py-3 text-center text-slate-500">
                    {s.items.reduce((n, i) => n + i.qty, 0)}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        s.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right font-bold text-slate-800">{money(s.total)}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1.5">
                      {s.status === 'pending' && (
                        <button
                          onClick={() => markSaleCompleted(s.id)}
                          className="rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700"
                        >
                          ✓ Complete
                        </button>
                      )}
                      <button
                        onClick={() => setReceiptFor(s)}
                        className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-slate-400"
                      >
                        Receipt
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={!!receiptFor} onClose={() => setReceiptFor(null)} title="Sale Receipt">
        <div className="p-2">
          <Receipt sale={receiptFor} />
          <div className="flex gap-3 p-4">
            <button
              onClick={() => window.print()}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-400"
            >
              🖨 Print
            </button>
            <button
              onClick={() => setReceiptFor(null)}
              className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
