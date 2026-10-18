import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { categoryMeta } from '../data/seed'
import { money } from '../lib/format'

export default function CartDrawer() {
  const { cartOpen, setCartOpen, cartItems, cartSubtotal, setCartQty, removeFromCart } = useStore()
  const navigate = useNavigate()

  if (!cartOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h3 className="text-lg font-semibold text-slate-800">
            Cart <span className="text-sm font-normal text-slate-400">({cartItems.length} items)</span>
          </h3>
          <button
            onClick={() => setCartOpen(false)}
            className="rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close cart"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <span className="text-5xl">🛒</span>
            <p className="font-medium text-slate-600">Your cart is empty</p>
            <p className="text-sm text-slate-400">Browse the shop and add medicines you need.</p>
            <button
              onClick={() => {
                setCartOpen(false)
                navigate('/shop')
              }}
              className="mt-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Continue shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y divide-slate-100 overflow-y-auto px-6">
              {cartItems.map((item) => {
                const meta = categoryMeta(item.category)
                return (
                  <div key={item.id} className="flex gap-4 py-4">
                    <div
                      className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-2xl ${meta.gradient}`}
                    >
                      {item.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-400">{money(item.price)} each</p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-lg border border-slate-200">
                          <button
                            onClick={() => setCartQty(item.id, item.qty - 1)}
                            className="px-2.5 py-1 text-slate-500 transition hover:text-emerald-700"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="min-w-8 text-center text-sm font-semibold">{item.qty}</span>
                          <button
                            onClick={() => setCartQty(item.id, Math.min(item.qty + 1, item.stock))}
                            className="px-2.5 py-1 text-slate-500 transition hover:text-emerald-700 disabled:opacity-30"
                            disabled={item.qty >= item.stock}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-slate-800">{money(item.price * item.qty)}</span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-xs font-medium text-rose-500 transition hover:text-rose-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="border-t border-slate-100 p-6">
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span className="text-lg font-bold text-slate-800">{money(cartSubtotal)}</span>
              </div>
              <button
                onClick={() => {
                  setCartOpen(false)
                  navigate('/checkout')
                }}
                className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
              >
                Proceed to Checkout
              </button>
              <p className="mt-3 text-center text-xs text-slate-400">
                Free delivery on orders over ₨ 10,000
              </p>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}
