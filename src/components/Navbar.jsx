import { NavLink, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/orders', label: 'My Orders' },
]

export default function Navbar() {
  const { user, logout, cartCount, setCartOpen } = useStore()
  const navigate = useNavigate()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-lg text-white shadow-sm">
            🐾
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold leading-tight text-slate-800">Online Veterinary Store</p>
            <p className="text-xs text-slate-500">Vet Pharmacy &amp; Supplies</p>
          </div>
        </NavLink>

        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCartOpen(true)}
            className="relative rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-emerald-400 hover:text-emerald-700"
            aria-label="Open cart"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-emerald-600 px-1 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>

          <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white py-1 pl-1 pr-2 sm:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-sm font-bold text-emerald-700">
              {(user?.name || 'G')[0]}
            </span>
            <span className="text-xs font-medium text-slate-600">{user?.name || 'Guest'}</span>
          </div>

          <button
            onClick={() => {
              logout()
              navigate('/login')
            }}
            className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-500 transition hover:border-rose-300 hover:text-rose-600"
            title="Sign out"
            aria-label="Sign out"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
