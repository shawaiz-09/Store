import { useMemo, useState } from 'react'
import { useStore } from '../../context/StoreContext'
import { CATEGORIES, categoryMeta } from '../../data/seed'
import { money } from '../../lib/format'
import Modal from '../../components/Modal'

const EMOJI_CHOICES = ['💉', '💊', '🐄', '🐐', '🐕', '🐈', '🐔', '🐴', '🥛', '🧪', '🦴', '🐾']

const emptyForm = {
  name: '',
  brand: '',
  category: CATEGORIES[0].id,
  price: '',
  stock: '',
  emoji: '💊',
  rx: false,
  desc: '',
}

export default function Inventory() {
  const { products, addProduct, updateProduct, deleteProduct, restockProduct, resetDemoData } = useStore()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [editing, setEditing] = useState(null) // null | 'new' | product object
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')

  const filtered = useMemo(() => {
    let list = products
    if (category !== 'All') list = list.filter((p) => p.category === category)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q))
    }
    return list
  }, [products, category, query])

  const openNew = () => {
    setForm(emptyForm)
    setFormError('')
    setEditing('new')
  }

  const openEdit = (product) => {
    setForm({ ...product, price: String(product.price), stock: String(product.stock) })
    setFormError('')
    setEditing(product)
  }

  const saveForm = (e) => {
    e.preventDefault()
    const name = form.name.trim()
    const price = Number(form.price)
    const stock = Number(form.stock)
    if (!name || !form.brand.trim()) return setFormError('Product name and brand are required.')
    if (!Number.isFinite(price) || price <= 0) return setFormError('Enter a valid price greater than 0.')
    if (!Number.isInteger(stock) || stock < 0) return setFormError('Stock must be a whole number ≥ 0.')

    const data = {
      name,
      brand: form.brand.trim(),
      category: form.category,
      price,
      stock,
      emoji: form.emoji || '💊',
      rx: !!form.rx,
      desc: form.desc.trim() || 'Veterinary product.',
    }
    if (editing === 'new') addProduct(data)
    else updateProduct(editing.id, data)
    setEditing(null)
  }

  const totalValue = products.reduce((n, p) => n + p.price * p.stock, 0)

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Inventory</h1>
          <p className="mt-1 text-sm text-slate-500">
            {products.length} products · stock value {money(totalValue)}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              if (window.confirm('Reset all products, sales and cart to demo data?')) resetDemoData()
            }}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-500 transition hover:border-slate-400"
          >
            ↺ Reset Demo Data
          </button>
          <button
            onClick={openNew}
            className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
          >
            + Add Product
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-52 flex-1 sm:max-w-xs">
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
            placeholder="Search inventory…"
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-4 text-sm outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {['All', ...CATEGORIES.map((c) => c.id)].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                category === cat
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-200 bg-white text-slate-500 hover:border-emerald-400'
              }`}
            >
              {cat === 'All' ? 'All' : `${categoryMeta(cat).emoji} ${cat === 'Vitamins' ? 'Vitamins' : cat}`}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-200 text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60 text-left text-xs uppercase tracking-wide text-slate-400">
              <th className="px-5 py-3 font-semibold">Product</th>
              <th className="px-3 py-3 font-semibold">Category</th>
              <th className="px-3 py-3 font-semibold">Price</th>
              <th className="px-3 py-3 text-center font-semibold">Stock</th>
              <th className="px-3 py-3 text-center font-semibold">Rx</th>
              <th className="px-5 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map((p) => {
              const meta = categoryMeta(p.category)
              return (
                <tr key={p.id} className="transition hover:bg-slate-50/60">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-xl ${meta.gradient}`}>
                        {p.emoji}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-slate-700">{p.name}</p>
                        <p className="text-xs text-slate-400">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      {meta.label}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-semibold text-slate-700">{money(p.price)}</td>
                  <td className="px-3 py-3 text-center">
                    <span
                      className={`inline-block min-w-14 rounded-full px-2.5 py-1 text-xs font-bold ${
                        p.stock === 0
                          ? 'bg-rose-100 text-rose-600'
                          : p.stock <= 5
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">{p.rx ? '🔒' : '—'}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1.5">
                      <button
                        onClick={() => restockProduct(p.id, 25)}
                        className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-emerald-400 hover:text-emerald-700"
                        title="Add 25 to stock"
                      >
                        +25
                      </button>
                      <button
                        onClick={() => openEdit(p)}
                        className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-sky-400 hover:text-sky-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete "${p.name}" from inventory?`)) deleteProduct(p.id)
                        }}
                        className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-semibold text-rose-500 transition hover:border-rose-400 hover:text-rose-700"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="6" className="px-5 py-12 text-center text-sm text-slate-400">
                  No products match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing === 'new' ? 'Add Product' : 'Edit Product'}>
        <form onSubmit={saveForm} className="space-y-4 p-6">
          <div>
            <label htmlFor="inv-name" className="mb-1.5 block text-sm font-medium text-slate-700">Product name *</label>
            <input
              id="inv-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Actibol 100ml Energy Injection"
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="inv-brand" className="mb-1.5 block text-sm font-medium text-slate-700">Brand *</label>
              <input
                id="inv-brand"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                placeholder="e.g. Zoetis"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-emerald-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="inv-price" className="mb-1.5 block text-sm font-medium text-slate-700">Price (₨) *</label>
              <input
                id="inv-price"
                type="number"
                min="1"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="1500"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label htmlFor="inv-stock" className="mb-1.5 block text-sm font-medium text-slate-700">Stock quantity *</label>
              <input
                id="inv-stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="20"
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Icon</label>
            <div className="flex flex-wrap gap-2">
              {EMOJI_CHOICES.map((em) => (
                <button
                  type="button"
                  key={em}
                  onClick={() => setForm({ ...form, emoji: em })}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border text-xl transition ${
                    form.emoji === em ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'
                  }`}
                >
                  {em}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="inv-desc" className="mb-1.5 block text-sm font-medium text-slate-700">Description</label>
            <textarea
              id="inv-desc"
              value={form.desc}
              onChange={(e) => setForm({ ...form, desc: e.target.value })}
              rows={3}
              placeholder="What is this product used for?"
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-500"
            />
          </div>

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
            <input
              type="checkbox"
              checked={form.rx}
              onChange={(e) => setForm({ ...form, rx: e.target.checked })}
              className="h-4 w-4 accent-emerald-600"
            />
            <span className="text-sm text-slate-700">
              Prescription required <span className="text-slate-400">(shows an Rx badge in the shop)</span>
            </span>
          </label>

          {formError && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {formError}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              {editing === 'new' ? 'Add Product' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
