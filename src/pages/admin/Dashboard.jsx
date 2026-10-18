import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'
import { fmtDate, money } from '../../lib/format'

export default function Dashboard() {
  const { sales, products } = useStore()

  const stats = useMemo(() => {
    const today = new Date().toDateString()
    const todaySales = sales.filter((s) => new Date(s.date).toDateString() === today)
    const totalRevenue = sales.reduce((n, s) => n + s.total, 0)
    const inventoryValue = products.reduce((n, p) => n + p.price * p.stock, 0)
    const lowStock = products.filter((p) => p.stock <= 5)
    return {
      todayRevenue: todaySales.reduce((n, s) => n + s.total, 0),
      todayCount: todaySales.length,
      totalRevenue,
      totalSales: sales.length,
      pendingOrders: sales.filter((s) => s.status === 'pending').length,
      inventoryValue,
      lowStock,
    }
  }, [sales, products])

  const week = useMemo(() => {
    const days = [...Array(7)].map((_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      const key = d.toDateString()
      const revenue = sales
        .filter((s) => new Date(s.date).toDateString() === key)
        .reduce((n, s) => n + s.total, 0)
      return { label: d.toLocaleDateString('en', { weekday: 'short' }), revenue }
    })
    return days
  }, [sales])

  const maxRevenue = Math.max(...week.map((d) => d.revenue), 1)

  const cards = [
    { label: "Today's Revenue", value: money(stats.todayRevenue), sub: `${stats.todayCount} sale${stats.todayCount !== 1 ? 's' : ''} today`, icon: '💰', tone: 'bg-emerald-50 text-emerald-700' },
    { label: 'Total Revenue', value: money(stats.totalRevenue), sub: `${stats.totalSales} lifetime sales`, icon: '📈', tone: 'bg-sky-50 text-sky-700' },
    { label: 'Pending Orders', value: stats.pendingOrders, sub: 'online orders to fulfil', icon: '⏳', tone: 'bg-amber-50 text-amber-700' },
    { label: 'Inventory Value', value: money(stats.inventoryValue), sub: `${products.length} products`, icon: '📦', tone: 'bg-violet-50 text-violet-700' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-500">Overview of your store performance</p>
        </div>
        <Link
          to="/admin/pos"
          className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          🖥️ New Sale
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{c.label}</p>
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl text-base ${c.tone}`}>
                {c.icon}
              </span>
            </div>
            <p className="mt-3 text-2xl font-extrabold text-slate-800">{c.value}</p>
            <p className="mt-1 text-xs text-slate-400">{c.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue chart */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-800">Revenue — Last 7 Days</h2>
            <span className="text-xs text-slate-400">max {money(maxRevenue)}</span>
          </div>
          <div className="mt-6 flex h-48 items-end gap-3">
            {week.map((d) => (
              <div key={d.label} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-[10px] font-semibold text-slate-500 opacity-0 transition group-hover:opacity-100">
                  {money(d.revenue)}
                </span>
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-400 transition-all group-hover:from-emerald-700 group-hover:to-emerald-500"
                  style={{ height: `${Math.max(4, (d.revenue / maxRevenue) * 100)}%`, minHeight: d.revenue > 0 ? 8 : 4 }}
                />
                <span className="text-xs font-medium text-slate-400">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-800">Low Stock Alerts</h2>
            <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-600">
              {stats.lowStock.length}
            </span>
          </div>
          {stats.lowStock.length === 0 ? (
            <p className="mt-6 text-sm text-slate-400">All products are well stocked ✅</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {stats.lowStock.slice(0, 6).map((p) => (
                <li key={p.id} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-base">
                    {p.emoji}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-slate-700">{p.name}</span>
                    <span className="text-xs text-slate-400">{p.brand}</span>
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                      p.stock === 0 ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {p.stock} left
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link
            to="/admin/inventory"
            className="mt-4 block rounded-xl border border-slate-200 py-2.5 text-center text-sm font-semibold text-slate-600 transition hover:border-emerald-400 hover:text-emerald-700"
          >
            Manage Inventory →
          </Link>
        </div>
      </div>

      {/* Recent sales */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-slate-800">Recent Sales</h2>
          <Link to="/admin/sales" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
            View all →
          </Link>
        </div>
        {sales.length === 0 ? (
          <p className="mt-6 text-sm text-slate-400">
            No sales yet — open the POS terminal to record your first sale.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-125 text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                  <th className="pb-2 font-semibold">Invoice</th>
                  <th className="pb-2 font-semibold">Date</th>
                  <th className="pb-2 font-semibold">Customer</th>
                  <th className="pb-2 font-semibold">Channel</th>
                  <th className="pb-2 font-semibold">Status</th>
                  <th className="pb-2 text-right font-semibold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {sales.slice(0, 6).map((s) => (
                  <tr key={s.id}>
                    <td className="py-3 font-semibold text-slate-700">{s.invoiceNo}</td>
                    <td className="py-3 text-slate-500">{fmtDate(s.date)}</td>
                    <td className="py-3 text-slate-600">{s.customer?.name}</td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          s.channel === 'pos' ? 'bg-sky-50 text-sky-700' : 'bg-violet-50 text-violet-700'
                        }`}
                      >
                        {s.channel === 'pos' ? 'In-store' : 'Online'}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          s.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-bold text-slate-800">{money(s.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
