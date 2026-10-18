import { categoryMeta } from '../data/seed'
import { money } from '../lib/format'

export default function ProductCard({ product, onAdd, onView }) {
  const meta = categoryMeta(product.category)
  const outOfStock = product.stock < 1
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg">
      <button
        onClick={() => onView(product)}
        className={`relative flex h-40 items-center justify-center bg-gradient-to-br text-6xl ${meta.gradient}`}
        aria-label={`View ${product.name}`}
      >
        <span className="transition-transform duration-300 group-hover:scale-110">{product.emoji}</span>
        {product.rx && (
          <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-700 backdrop-blur">
            Rx
          </span>
        )}
        {outOfStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/60 text-sm font-bold uppercase tracking-widest text-slate-600 backdrop-blur-[2px]">
            Out of stock
          </span>
        )}
      </button>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">{meta.label}</p>
        <button onClick={() => onView(product)} className="mt-1 text-left">
          <h3 className="text-sm font-semibold leading-snug text-slate-800 group-hover:text-emerald-700">
            {product.name}
          </h3>
        </button>
        <p className="mt-0.5 text-xs text-slate-400">by {product.brand}</p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div>
            <p className="text-base font-extrabold text-slate-800">{money(product.price)}</p>
            <p className={`text-[11px] ${product.stock <= 5 ? 'font-semibold text-amber-600' : 'text-slate-400'}`}>
              {product.stock <= 5 ? `Only ${product.stock} left` : `${product.stock} in stock`}
            </p>
          </div>
          <button
            onClick={() => onAdd(product)}
            disabled={outOfStock}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm transition hover:bg-emerald-700 active:scale-95 disabled:cursor-not-allowed disabled:bg-slate-300"
            aria-label={`Add ${product.name} to cart`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
