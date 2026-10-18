import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES } from '../data/seed'
import { useStore } from '../context/StoreContext'
import ProductCard from '../components/ProductCard'
import QuickView from '../components/QuickView'

export default function Home() {
  const { products, addToCart } = useStore()
  const [quickView, setQuickView] = useState(null)

  const featured = [...products]
    .sort((a, b) => Number(b.stock > 0) - Number(a.stock > 0))
    .slice(0, 8)

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500">
        <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-teal-300/20 blur-2xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-emerald-50 backdrop-blur">
              🇵🇰 Trusted vet pharmacy · Karachi
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight text-white sm:text-5xl">
              Care for every animal you raise
            </h1>
            <p className="mt-4 max-w-lg text-emerald-50/90">
              Genuine medicines, vaccines and supplements for livestock, pets and poultry —
              from trusted brands like Zoetis, Merck, Elanco and Huvepharma.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-emerald-700 shadow-lg transition hover:bg-emerald-50"
              >
                Shop Now →
              </Link>
              <a
                href="#categories"
                className="rounded-xl border border-white/40 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10"
              >
                Browse Categories
              </a>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-emerald-50/90">
              <span>✅ 100% genuine products</span>
              <span>🚚 Nationwide delivery</span>
              <span>🩺 Vet-approved</span>
            </div>
          </div>
          <div className="hidden justify-center gap-4 lg:flex">
            {['🐄', '🐕', '🐔', '🐈', '🐐', '🐴'].map((animal, i) => (
              <div
                key={animal}
                className={`flex h-24 w-24 items-center justify-center rounded-3xl bg-white/15 text-4xl backdrop-blur ${
                  i % 2 === 0 ? 'mt-8' : ''
                }`}
              >
                {animal}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Shop by Category</h2>
            <p className="mt-1 text-sm text-slate-500">Everything for farm and home animals</p>
          </div>
          <Link to="/shop" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
            View all products →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((cat) => {
            const count = products.filter((p) => p.category === cat.id).length
            return (
              <Link
                key={cat.id}
                to={`/shop?category=${encodeURIComponent(cat.id)}`}
                className={`group flex flex-col items-center gap-3 rounded-2xl border border-slate-200 bg-gradient-to-br p-6 text-center transition hover:-translate-y-0.5 hover:shadow-lg ${cat.gradient}`}
              >
                <span className="text-4xl transition-transform group-hover:scale-110">{cat.emoji}</span>
                <span className="text-sm font-bold text-slate-700">{cat.label}</span>
                <span className="text-xs text-slate-500">{count} products</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Featured Products</h2>
            <p className="mt-1 text-sm text-slate-500">Best sellers from our pharmacy</p>
          </div>
          <Link to="/shop" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">
            Shop all →
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={(prod) => addToCart(prod.id)} onView={setQuickView} />
          ))}
        </div>
      </section>

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </div>
  )
}
