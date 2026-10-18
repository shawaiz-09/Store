import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { seedProducts } from '../data/seed'

const StoreContext = createContext(null)

const SESSION_KEY = 'ovs_session'
const PRODUCTS_KEY = 'ovs_products'
const SALES_KEY = 'ovs_sales'
const CART_KEY = 'ovs_cart'

const ACCOUNTS = [
  { email: 'admin@me.com', password: '123', role: 'admin', name: 'Admin' },
  { email: 'user@me.com', password: '123', role: 'user', name: 'Customer' },
]

const uid = () =>
  (crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36))

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null) return fallback
    const parsed = JSON.parse(raw)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable — session-only fallback */
  }
}

export function StoreProvider({ children }) {
  const [user, setUser] = useState(() => load(SESSION_KEY, null))
  const [products, setProducts] = useState(() => load(PRODUCTS_KEY, seedProducts))
  const [sales, setSales] = useState(() => load(SALES_KEY, []))
  const [cart, setCart] = useState(() => load(CART_KEY, [])) // [{ id, qty }]
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  useEffect(() => save(SESSION_KEY, user), [user])
  useEffect(() => save(PRODUCTS_KEY, products), [products])
  useEffect(() => save(SALES_KEY, sales), [sales])
  useEffect(() => save(CART_KEY, cart), [cart])

  const notify = useCallback((message, type = 'success') => {
    setToast({ message, type, key: Date.now() })
    clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 2600)
  }, [])

  // ── Auth ───────────────────────────────────────────────────
  const login = useCallback((email, password) => {
    const account = ACCOUNTS.find(
      (a) => a.email === email.trim().toLowerCase() && a.password === password,
    )
    if (!account) return { ok: false, error: 'Invalid email or password. Please try again.' }
    const session = { email: account.email, name: account.name, role: account.role }
    setUser(session)
    return { ok: true, user: session }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setCartOpen(false)
  }, [])

  // ── User cart (online shop) ────────────────────────────────
  const cartItems = useMemo(
    () =>
      cart
        .map((line) => {
          const product = products.find((p) => p.id === line.id)
          return product ? { ...product, qty: Math.min(line.qty, product.stock) } : null
        })
        .filter(Boolean),
    [cart, products],
  )

  const cartCount = cartItems.reduce((n, i) => n + i.qty, 0)
  const cartSubtotal = cartItems.reduce((n, i) => n + i.qty * i.price, 0)

  const addToCart = useCallback(
    (productId, qty = 1) => {
      const product = products.find((p) => p.id === productId)
      if (!product) return
      if (product.stock < 1) {
        notify(`${product.name} is out of stock`, 'error')
        return
      }
      setCart((prev) => {
        const line = prev.find((l) => l.id === productId)
        const currentQty = line ? line.qty : 0
        const nextQty = Math.min(currentQty + qty, product.stock)
        if (nextQty === currentQty) {
          notify(`Only ${product.stock} units of ${product.name} in stock`, 'error')
          return prev
        }
        return line
          ? prev.map((l) => (l.id === productId ? { ...l, qty: nextQty } : l))
          : [...prev, { id: productId, qty: nextQty }]
      })
      notify(`${product.name} added to cart`)
    },
    [products, notify],
  )

  const setCartQty = useCallback((productId, qty) => {
    setCart((prev) =>
      prev.flatMap((l) => (l.id === productId ? (qty > 0 ? [{ ...l, qty }] : []) : [l])),
    )
  }, [])

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => prev.filter((l) => l.id !== productId))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  // ── Sales ──────────────────────────────────────────────────
  const nextInvoiceNo = useCallback(() => {
    const now = new Date()
    const dayPrefix = `${String(now.getFullYear()).slice(2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`
    const todayCount = sales.filter(
      (s) => new Date(s.date).toDateString() === now.toDateString(),
    ).length
    return `OVS-${dayPrefix}-${String(todayCount + 1).padStart(4, '0')}`
  }, [sales])

  const commitSale = useCallback(
    ({ items, discountPct = 0, payment, customer, channel, deliveryFee = 0, status }) => {
      const lines = items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty }))
      const subtotal = lines.reduce((n, i) => n + i.price * i.qty, 0)
      const discount = Math.round((subtotal * discountPct) / 100)
      const total = subtotal - discount + deliveryFee
      const sale = {
        id: uid(),
        invoiceNo: nextInvoiceNo(),
        items: lines,
        subtotal,
        discountPct,
        discount,
        deliveryFee,
        total,
        payment,
        customer,
        channel, // 'pos' | 'online'
        status, // 'completed' | 'pending'
        cashier: channel === 'pos' ? 'Admin' : '—',
        date: new Date().toISOString(),
      }
      // decrement stock
      setProducts((prev) =>
        prev.map((p) => {
          const line = lines.find((l) => l.id === p.id)
          return line ? { ...p, stock: Math.max(0, p.stock - line.qty) } : p
        }),
      )
      setSales((prev) => [sale, ...prev])
      return sale
    },
    [nextInvoiceNo],
  )

  const placeOnlineOrder = useCallback(
    ({ name, phone, address, payment }) => {
      const fee = cartSubtotal >= 10000 ? 0 : 250
      const sale = commitSale({
        items: cartItems,
        payment,
        customer: { name, phone, address, email: user?.email || 'guest' },
        channel: 'online',
        deliveryFee: fee,
        status: 'pending',
      })
      clearCart()
      return sale
    },
    [cartItems, cartSubtotal, commitSale, clearCart, user],
  )

  const posCheckout = useCallback(
    ({ items, discountPct, payment, customer }) =>
      commitSale({
        items,
        discountPct,
        payment,
        customer: { name: customer?.name || 'Walk-in Customer', phone: customer?.phone || '', address: '', email: '' },
        channel: 'pos',
        deliveryFee: 0,
        status: 'completed',
      }),
    [commitSale],
  )

  const markSaleCompleted = useCallback(
    (saleId) => {
      setSales((prev) => prev.map((s) => (s.id === saleId ? { ...s, status: 'completed' } : s)))
      notify('Order marked as completed')
    },
    [notify],
  )

  // ── Inventory ──────────────────────────────────────────────
  const addProduct = useCallback(
    (data) => {
      setProducts((prev) => [{ ...data, id: uid() }, ...prev])
      notify(`"${data.name}" added to inventory`)
    },
    [notify],
  )

  const updateProduct = useCallback(
    (id, data) => {
      setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)))
      notify(`"${data.name}" updated`)
    },
    [notify],
  )

  const deleteProduct = useCallback(
    (id) => {
      const product = products.find((p) => p.id === id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
      setCart((prev) => prev.filter((l) => l.id !== id))
      notify(`"${product?.name ?? 'Product'}" removed from inventory`)
    },
    [products, notify],
  )

  const restockProduct = useCallback(
    (id, amount) => {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stock: p.stock + amount } : p)),
      )
      notify(`Stock increased by ${amount}`)
    },
    [notify],
  )

  const resetDemoData = useCallback(() => {
    setProducts(seedProducts)
    setSales([])
    setCart([])
    notify('Demo data reset')
  }, [notify])

  const value = {
    user,
    login,
    logout,
    products,
    sales,
    addProduct,
    updateProduct,
    deleteProduct,
    restockProduct,
    resetDemoData,
    cartItems,
    cartCount,
    cartSubtotal,
    addToCart,
    setCartQty,
    removeFromCart,
    clearCart,
    cartOpen,
    setCartOpen,
    placeOnlineOrder,
    posCheckout,
    markSaleCompleted,
    notify,
    toast,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
