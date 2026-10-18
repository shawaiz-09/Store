# Online Veterinary Store — POS

A complete Point-of-Sale and online shop for a veterinary pharmacy, built with **React 19**, **Vite**, and **Tailwind CSS v4**. Product catalog is modeled after a Pakistani vet pharmacy (livestock, pet care, poultry, vaccines, vitamins — prices in PKR ₨).

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Logins

| Role     | Email         | Password |
| -------- | ------------- | -------- |
| Admin    | admin@me.com  | 123      |
| Customer | user@me.com   | 123      |

## Features

**Customer shop** (`/`)
- Home page with hero, categories and featured products
- Shop with search, category filters and sorting; Rx badges on prescription items
- Quick-view product modal with quantity picker
- Cart drawer (persisted in localStorage)
- Checkout with delivery details, payment method and free delivery over ₨ 10,000
- My Orders with status and printable receipts

**Admin panel** (`/admin`)
- Dashboard: today/total revenue, pending orders, inventory value, 7-day revenue chart, low-stock alerts
- POS Terminal: tap-to-add products, discount %, payment method (Cash/Card/Transfer), customer name, printable receipt — invoices auto-numbered `OVS-YYMMDD-####`
- Inventory: add / edit / delete products, one-click restock (+25), stock value, reset demo data
- Sales & Orders: filter by channel/status, fulfil pending online orders, view receipts

Stock is shared across channels — a POS sale and an online order both decrement the same inventory. All data persists in `localStorage`; use **Inventory → Reset Demo Data** to start fresh.
