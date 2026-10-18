import { useMemo, useState } from 'react'
import { useStore } from '../../context/StoreContext'
import { CATEGORIES, categoryMeta } from '../../data/seed'
import { money } from '../../lib/format'
import Modal from '../../components/Modal'
import Receipt from '../../components/Receipt'

const PAYMENTS = ['Cash', 'Card', 'Online Transfer']

export default function POS() {
  const { products, posCheckout, notify } = useStore()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [lines, setLines] = useState([]) // [{ id, name, price, qty, stock }]
  const [discountPct, setDiscountPct] = useState(0)
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [payment, setPayment] = useState('Cash')
  const [lastSale, setLastSale] = useState(null)

  const filtered = useMemo(() => {
    let list = products
    if (category !== 'All') list = list.filter((p) => p.category === category)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
    }
    return list
  }, [products, category, query])

  const subtotal = lines.reduce((n, l) => n + l.price * l.qty, 0)
  const discount = Math.round((subtotal * (Number(discountPct) || 0)) / 100)
  const total = subtotal - discount

  const addLine = (product) => {
    if (product.stock < 1) {
      notify(`${product.name} is out of stock`, 'error')
      return
    }
    setLines((prev) => {
      const existing = prev.find((l) => l.id === product.id)
      if (existing) {
        if (existing.qty >= product.stock) {
          notify(`Only ${product.stock} units in stock`, 'error')
          return prev
        }
        return prev.map((l) => (l.id === product.id ? { ...l, qty: l.qty + 1 } : l))
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, qty: 1, stock: product.stock }]
    })
  }

  const setQty = (id, qty) =>
    setLines((prev) =>
      prev.flatMap((l) => {
        if (l.id !== id) return [l]
        if (qty <= 0) return []
        if (qty > l.stock) {
          notify(`Only ${l.stock} units in stock`, 'error')
          return [{ ...l, qty: l.stock }]
        }
        return [{ ...l, qty }]
      }),
    )

  const charge = () => {
    if (lines.length === 0) {
      notify('Cart is empty — add products first', 'error')
      return
    }
    const sale = posCheckout({
      items: lines,
      discountPct: Number(discountPct) || 0,
      payment,
      customer: { name: customerName, phone: customerPhone },
    })
    setLastSale(sale)
    setLines([])
    setDiscountPct(0)
    setCustomerName('')
    setCustomerPhone('')
    notify(`Sale ${sale.invoiceNo} completed · ${money(sale.total)}`)
  }

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      {/* Product grid */}
      <div className="xl:col-span-2">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-52 flex-1">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search product or brand to add…"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <span className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-slate-500 shadow-sm">
            {filtered.length} products
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {['All', ...CATEGORIES.map((c) => c.id)].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                category === cat
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-200 bg-white text-slate-500 hover:border-emerald-400 hover:text-emerald-700'
              }`}
            >
              {cat === 'All' ? 'All' : `${categoryMeta(cat).emoji} ${cat === 'Vitamins' ? 'Vitamins' : cat}`}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((p) => {
            const meta = categoryMeta(p.category)
            const out = p.stock < 1
            const inCart = lines.find((l) => l.id === p.id)
            return (
              <button
                key={p.id}
                onClick={() => addLine(p)}
                disabled={out}
                className={`group flex flex-col rounded-2xl border bg-white p-3 text-left transition active:scale-[0.98] ${
                  inCart
                    ? 'border-emerald-500 ring-2 ring-emerald-100'
                    : 'border-slate-200 hover:border-emerald-400 hover:shadow-md'
                } ${out ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <div className={`flex h-20 items-center justify-center rounded-xl bg-gradient-to-br text-4xl ${meta.gradient}`}>
                  {p.emoji}
                </div>
                <p className="mt-2 line-clamp-2 min-h-9 text-xs font-semibold leading-snug text-slate-700">
                  {p.name}
                </p>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-slate-800">{money(p.price)}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      out ? 'bg-rose-100 text-rose-600' : p.stock <= 5 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {out ? 'Out' : `${p.stock}${inCart ? ` · ${inCart.qty}↗` : ''}`}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Sale panel */}
      <div className="xl:sticky xl:top-6 xl:self-start">
        <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="font-bold text-slate-800">
              Current Sale {lines.length > 0 && <span className="text-sm font-normal text-slate-400">({lines.reduce((n, l) => n + l.qty, 0)} items)</span>}
            </h2>
            {lines.length > 0 && (
              <button
                onClick={() => setLines([])}
                className="text-xs font-semibold text-rose-500 transition hover:text-rose-700"
              >
                Clear
              </button>
            )}
          </div>

          {lines.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-5 py-14 text-center">
              <span className="text-4xl">🧾</span>
              <p className="text-sm font-medium text-slate-500">No products yet</p>
              <p className="text-xs text-slate-400">Tap a product on the left to start a sale.</p>
            </div>
          ) : (
            <ul className="max-h-72 divide-y divide-slate-50 overflow-y-auto px-5">
              {lines.map((l) => (
                <li key={l.id} className="flex items-center gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-700">{l.name}</p>
                    <p className="text-xs text-slate-400">{money(l.price)} each</p>
                  </div>
                  <div className="flex items-center rounded-lg border border-slate-200">
                    <button onClick={() => setQty(l.id, l.qty - 1)} className="px-2 py-1 text-slate-500 hover:text-emerald-700" aria-label="Decrease">−</button>
                    <span className="min-w-7 text-center text-sm font-bold">{l.qty}</span>
                    <button onClick={() => setQty(l.id, l.qty + 1)} className="px-2 py-1 text-slate-500 hover:text-emerald-700" aria-label="Increase">+</button>
                  </div>
                  <span className="w-20 text-right text-sm font-bold text-slate-800">{money(l.price * l.qty)}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="space-y-4 border-t border-slate-100 p-5">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="pos-name" className="mb-1 block text-xs font-semibold text-slate-500">Customer name</label>
                <input
                  id="pos-name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Walk-in Customer"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label htmlFor="pos-phone" className="mb-1 block text-xs font-semibold text-slate-500">Phone (optional)</label>
                <input
                  id="pos-phone"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="03XX-XXXXXXX"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex items-end gap-3">
              <div className="w-28">
                <label htmlFor="pos-discount" className="mb-1 block text-xs font-semibold text-slate-500">Discount %</label>
                <input
                  id="pos-discount"
                  type="number"
                  min="0"
                  max="100"
                  value={discountPct}
                  onChange={(e) => setDiscountPct(Math.min(100, Math.max(0, e.target.value)))}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex-1 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-semibold text-slate-700">{money(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Discount</span>
                  <span className="font-semibold text-emerald-700">− {money(discount)}</span>
                </div>
                <div className="flex justify-between border-t border-dashed border-slate-200 pt-1.5 text-lg font-extrabold text-slate-800">
                  <span>Total</span>
                  <span>{money(total)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {PAYMENTS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPayment(p)}
                  className={`flex-1 rounded-xl border py-2 text-xs font-bold transition ${
                    payment === p
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : 'border-slate-200 text-slate-500 hover:border-emerald-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={charge}
              disabled={lines.length === 0}
              className="w-full rounded-xl bg-slate-900 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Charge {money(total)} · {payment}
            </button>
          </div>
        </div>
      </div>

      {/* Receipt modal */}
      <Modal open={!!lastSale} onClose={() => setLastSale(null)} title="Sale Completed">
        <div className="p-2">
          <Receipt sale={lastSale} />
          <div className="flex gap-3 p-4">
            <button
              onClick={() => window.print()}
              className="flex-1 rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-slate-400"
            >
              🖨 Print Receipt
            </button>
            <button
              onClick={() => setLastSale(null)}
              className="flex-1 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              New Sale
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
