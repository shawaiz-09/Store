import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { money, deliveryFeeFor } from '../lib/format'
import { categoryMeta } from '../data/seed'

const PAYMENT_METHODS = [
  { id: 'Cash on Delivery', icon: '💵', note: 'Pay when your order arrives' },
  { id: 'Bank Transfer', icon: '🏦', note: 'Share receipt on WhatsApp' },
  { id: 'Card on Delivery', icon: '💳', note: 'Swipe on our POS machine' },
]

export default function Checkout() {
  const { cartItems, cartSubtotal, placeOnlineOrder, user } = useStore()
  const navigate = useNavigate()
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [payment, setPayment] = useState(PAYMENT_METHODS[0].id)
  const [error, setError] = useState('')
  const [placedOrder, setPlacedOrder] = useState(null)

  const deliveryFee = useMemo(() => deliveryFeeFor(cartSubtotal), [cartSubtotal])
  const total = cartSubtotal + deliveryFee

  const submit = (e) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setError('Please fill in your name, phone and delivery address.')
      return
    }
    if (phone.trim().length < 10) {
      setError('Please enter a valid phone number (at least 10 digits).')
      return
    }
    const sale = placeOnlineOrder({ name: name.trim(), phone: phone.trim(), address: address.trim(), payment })
    setPlacedOrder(sale)
  }

  if (placedOrder) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center sm:px-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-4xl">✅</div>
        <h1 className="mt-6 text-2xl font-extrabold text-slate-800">Order placed successfully!</h1>
        <p className="mt-2 text-sm text-slate-500">
          Thank you, {placedOrder.customer.name}! Your order{' '}
          <span className="font-bold text-emerald-700">{placedOrder.invoiceNo}</span> is confirmed and
          will be delivered in 2–4 working days. We&apos;ll call {placedOrder.customer.phone} to confirm.
        </p>
        <div className="mt-8 w-full rounded-2xl border border-slate-200 bg-white p-6 text-left">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Subtotal</span>
            <span>{money(placedOrder.subtotal)}</span>
          </div>
          <div className="mt-1 flex justify-between text-sm">
            <span className="text-slate-500">Delivery</span>
            <span>{placedOrder.deliveryFee === 0 ? 'Free' : money(placedOrder.deliveryFee)}</span>
          </div>
          <div className="mt-3 flex justify-between border-t border-slate-100 pt-3 text-base font-extrabold">
            <span>Total ({placedOrder.payment})</span>
            <span>{money(placedOrder.total)}</span>
          </div>
        </div>
        <div className="mt-8 flex gap-3">
          <Link
            to="/orders"
            className="rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            View My Orders
          </Link>
          <Link
            to="/shop"
            className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-emerald-400"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center sm:px-6">
        <span className="text-5xl">🛒</span>
        <h1 className="mt-4 text-xl font-bold text-slate-800">Your cart is empty</h1>
        <p className="mt-1 text-sm text-slate-500">Add some products before checking out.</p>
        <button
          onClick={() => navigate('/shop')}
          className="mt-6 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Go to Shop
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold text-slate-800">Checkout</h1>
      <p className="mt-1 text-sm text-slate-500">Enter delivery details and choose a payment method.</p>

      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Delivery Details</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="co-name" className="mb-1.5 block text-sm font-medium text-slate-700">Full name *</label>
                <input
                  id="co-name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError('') }}
                  placeholder="e.g. Ali Raza"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div>
                <label htmlFor="co-phone" className="mb-1.5 block text-sm font-medium text-slate-700">Phone *</label>
                <input
                  id="co-phone"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setError('') }}
                  placeholder="03XX-XXXXXXX"
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="co-address" className="mb-1.5 block text-sm font-medium text-slate-700">Delivery address *</label>
                <textarea
                  id="co-address"
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); setError('') }}
                  rows={3}
                  placeholder="House / street / area, city"
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Email (account)</label>
                <input
                  value={user?.email || ''}
                  readOnly
                  className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-500"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Payment Method</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {PAYMENT_METHODS.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setPayment(m.id)}
                  className={`rounded-xl border-2 p-4 text-left transition ${
                    payment === m.id
                      ? 'border-emerald-500 bg-emerald-50/60'
                      : 'border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  <span className="text-xl">{m.icon}</span>
                  <span className="mt-1.5 block text-sm font-semibold text-slate-800">{m.id}</span>
                  <span className="mt-0.5 block text-xs text-slate-400">{m.note}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">Order Summary</h2>
            <ul className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
              {cartItems.map((item) => {
                const meta = categoryMeta(item.category)
                return (
                  <li key={item.id} className="flex items-center gap-3">
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${meta.gradient}`}>
                      {item.emoji}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-slate-700">{item.name}</span>
                      <span className="text-xs text-slate-400">{item.qty} × {money(item.price)}</span>
                    </span>
                    <span className="text-sm font-semibold text-slate-800">{money(item.qty * item.price)}</span>
                  </li>
                )
              })}
            </ul>
            <div className="mt-5 space-y-2 border-t border-slate-100 pt-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Subtotal</span>
                <span>{money(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Delivery</span>
                <span className={deliveryFee === 0 ? 'font-semibold text-emerald-600' : ''}>
                  {deliveryFee === 0 ? 'Free' : money(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-3 text-lg font-extrabold text-slate-800">
                <span>Total</span>
                <span>{money(total)}</span>
              </div>
            </div>

            {error && (
              <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="mt-5 w-full rounded-xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.99]"
            >
              Place Order · {money(total)}
            </button>
            <p className="mt-3 text-center text-xs text-slate-400">
              Free delivery on orders over ₨ 10,000
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}
