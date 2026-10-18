import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

const DEMO_ACCOUNTS = [
  { role: 'Customer', email: 'user@me.com', password: '123', icon: '🛒', blurb: 'Shop medicines for livestock, pets & poultry' },
  { role: 'Admin', email: 'admin@me.com', password: '123', icon: '🩺', blurb: 'POS terminal, inventory & sales reports' },
]

export default function Login() {
  const { login, user } = useStore()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />
  }

  const submit = (e) => {
    e.preventDefault()
    if (!email.trim() || !password) {
      setError('Please enter both email and password.')
      return
    }
    const result = login(email, password)
    if (!result.ok) {
      setError(result.error)
      return
    }
    navigate(result.user.role === 'admin' ? '/admin' : '/', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Brand panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-500 lg:flex lg:flex-col lg:justify-between">
        <div className="p-12">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl backdrop-blur">
              🐾
            </div>
            <div>
              <p className="text-lg font-bold text-white">Online Veterinary Store</p>
              <p className="text-sm text-emerald-100">Vet Pharmacy &amp; Supplies</p>
            </div>
          </div>
        </div>
        <div className="p-12">
          <h1 className="text-4xl font-extrabold leading-tight text-white">
            Care for every animal you raise.
          </h1>
          <p className="mt-4 max-w-md text-emerald-100">
            Genuine medicines, vaccines and supplements for livestock, pets and poultry —
            delivered across Pakistan from our Karachi pharmacy.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 text-sm text-emerald-50">
            {[
              ['✅', '100% genuine products'],
              ['🚚', 'Fast nationwide delivery'],
              ['🩺', 'Vet-approved brands'],
              ['💳', 'Cash on delivery'],
            ].map(([icon, text]) => (
              <div key={text} className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 backdrop-blur">
                <span>{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="p-12 text-sm text-emerald-200/80">
          Karachi, Pakistan · +92 333 2734108 · Mon–Sat 9:00 AM – 9:00 PM
        </p>
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-teal-300/20 blur-2xl" />
      </div>

      {/* Login form */}
      <div className="flex w-full items-center justify-center p-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-xl text-white">
              🐾
            </div>
            <div>
              <p className="font-bold text-slate-800">Online Veterinary Store</p>
              <p className="text-xs text-slate-500">Vet Pharmacy &amp; Supplies</p>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-800">Welcome back</h2>
          <p className="mt-1 text-sm text-slate-500">Sign in with your email and password to continue.</p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setError('')
                }}
                placeholder="you@me.com"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-700">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
                placeholder="••••••"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 active:scale-[0.99]"
            >
              Sign in
            </button>
          </form>

          <div className="mt-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Demo accounts — click to fill
            </p>
            <div className="space-y-2.5">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => {
                    setEmail(acc.email)
                    setPassword(acc.password)
                    setError('')
                  }}
                  className="flex w-full items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-emerald-400 hover:shadow-sm"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-lg">
                    {acc.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-slate-800">
                      {acc.role} · {acc.email}
                    </span>
                    <span className="block truncate text-xs text-slate-500">{acc.blurb}</span>
                  </span>
                  <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-600">
                    pass: {acc.password}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
