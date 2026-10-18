import { useEffect, useState } from 'react'
import Modal from './Modal'
import { useStore } from '../context/StoreContext'
import { categoryMeta } from '../data/seed'
import { money } from '../lib/format'

export default function QuickView({ product, onClose }) {
  const { addToCart, setCartOpen } = useStore()
  const [qty, setQty] = useState(1)

  useEffect(() => setQty(1), [product])

  if (!product) return null
  const meta = categoryMeta(product.category)
  const outOfStock = product.stock < 1

  return (
    <Modal open={!!product} onClose={onClose} title="Product Details">
      <div className="p-6">
        <div className={`flex h-44 items-center justify-center rounded-2xl bg-gradient-to-br text-7xl ${meta.gradient}`}>
          {product.emoji}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            {meta.label}
          </span>
          {product.rx && (
            <span className="rounded-md bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-700">
              Prescription required
            </span>
          )}
          <span className={`rounded-md px-2.5 py-1 text-xs font-semibold ${outOfStock ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-600'}`}>
            {outOfStock ? 'Out of stock' : `${product.stock} in stock`}
          </span>
        </div>
        <h3 className="mt-3 text-xl font-bold text-slate-800">{product.name}</h3>
        <p className="text-sm text-slate-400">by {product.brand}</p>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{product.desc}</p>

        <div className="mt-6 flex items-center justify-between">
          <span className="text-2xl font-extrabold text-slate-800">{money(product.price)}</span>
          <div className="flex items-center rounded-xl border border-slate-200">
            <button
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-3.5 py-2 text-slate-500 transition hover:text-emerald-700"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="min-w-10 text-center text-sm font-bold">{qty}</span>
            <button
              onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
              className="px-3.5 py-2 text-slate-500 transition hover:text-emerald-700 disabled:opacity-30"
              disabled={qty >= product.stock}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            addToCart(product.id, qty)
            onClose()
            setCartOpen(true)
          }}
          disabled={outOfStock}
          className="mt-5 w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {outOfStock ? 'Out of Stock' : `Add ${qty} to Cart · ${money(product.price * qty)}`}
        </button>
      </div>
    </Modal>
  )
}
