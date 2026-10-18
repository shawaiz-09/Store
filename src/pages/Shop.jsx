import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CATEGORIES } from '../data/seed'
import { useStore } from '../context/StoreContext'
import ProductCard from '../components/ProductCard'
import QuickView from '../components/QuickView'

export default function Shop() {
  const { products, addToCart } = useStore()
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('featured')
  const [quickView, setQuickView] = useState(null)

  const category = searchParams.get('category') || 'All'

  const filtered = useMemo(() => {
    let list = products.filter((p) => (category === 'All' ? true : p.category === category))
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.desc.toLowerCase().includes(q),
      )
    }
    switch (sort) {
      case 'price-asc':
        return [...list].sort((a, b) => a.price - b.price)
      case 'price-desc':
        return [...list].sort((a, b) => b.price - a.price)
      case 'name':
        return [...list].sort((a, b) => a.name.localeCompare(b.name))
      default:
        return list
    }
  }, [products, category, query, sort])

  const setCategory = (cat) => {
    if (cat === 'All') searchParams.delete('category')
    else searchParams.set('category', cat)
    setSearchParams(searchParams, { replace: true })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Shop Medicines</h1>
          <p className="mt-1 text-sm text-slate-500">
            {filtered.length} product{filtered.length !== 1 ? 's' : ''}
            {category !== 'All' && ` in ${category}`}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1 sm:w-64">
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
              placeholder="Search products, brands…"
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none transition focus:border-emerald-500"
          >
            <option value="featured">Featured</option>
            <option value="name">Name A–Z</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {['All', ...CATEGORIES.map((c) => c.id)].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              category === cat
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'border border-slate-200 bg-white text-slate-600 hover:border-emerald-400 hover:text-emerald-700'
            }`}
          >
            {cat === 'All' ? '🐾 All' : `${CATEGORIES.find((c) => c.id === cat)?.emoji} ${cat === 'Vitamins' ? 'Vitamins & Supplements' : cat}`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-3 text-center">
          <span className="text-5xl">🔍</span>
          <p className="font-medium text-slate-600">No products found</p>
          <p className="text-sm text-slate-400">Try a different search or category.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={(prod) => addToCart(prod.id)} onView={setQuickView} />
          ))}
        </div>
      )}

      <QuickView product={quickView} onClose={() => setQuickView(null)} />
    </div>
  )
}
