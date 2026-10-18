import { useState } from 'react'
import { useStore } from '../context/StoreContext'
import Modal from '../components/Modal'
import Receipt from '../components/Receipt'
import { fmtDate, money } from '../lib/format'

export default function MyOrders() {
  const { sales, user } = useStore()
  const [receiptFor, setReceiptFor] = useState(null)

  const myOrders = sales.filter((s) => s.channel === 'online' && s.customer?.email === user?.email)

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-800">My Orders</h1>
      <p className="mt-1 text-sm text-slate-500">Your online order history with {user?.email}</p>

      {myOrders.length === 0 ? (
        <div className="mt-12 flex flex-col items-center gap-3 rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center">
          <span className="text-5xl">📦</span>
          <p className="font-medium text-slate-600">No orders yet</p>
          <p className="text-sm text-slate-400">When you place an order it will appear here.</p>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          {myOrders.map((order) => (
            <div key={order.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-bold text-slate-800">{order.invoiceNo}</p>
                  <p className="text-xs text-slate-400">{fmtDate(order.date)}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold ${
                    order.status === 'completed'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-600'
                  }`}
                >
                  {order.status === 'completed' ? '✓ Completed' : '⏳ Pending'}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
                <div className="min-w-0">
                  <p className="truncate text-sm text-slate-600">
                    {order.items.map((i) => `${i.name} ×${i.qty}`).join(', ')}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''} · {order.payment}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-extrabold text-slate-800">{money(order.total)}</span>
                  <button
                    onClick={() => setReceiptFor(order)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-400 hover:text-emerald-700"
                  >
                    View Receipt
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!receiptFor} onClose={() => setReceiptFor(null)} title="Order Receipt">
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
