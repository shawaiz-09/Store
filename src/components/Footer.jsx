import { STORE_INFO } from '../data/seed'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-lg text-white">
              🐾
            </div>
            <div>
              <p className="font-bold text-slate-800">Online Veterinary Store</p>
              <p className="text-xs text-slate-500">Vet Pharmacy &amp; Supplies</p>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-500">
            Genuine veterinary medicines, vaccines and supplements for livestock, pets and
            poultry — delivered across Pakistan.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Shop</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>Livestock Medicine</li>
            <li>Pet Care</li>
            <li>Poultry Medicine</li>
            <li>Vaccinations</li>
            <li>Vitamins &amp; Supplements</li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>📍 {STORE_INFO.address}</li>
            <li>📞 {STORE_INFO.phone}</li>
            <li>🕘 {STORE_INFO.hours}</li>
            <li>💳 Cash on Delivery · Bank Transfer</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-100 py-4 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} {STORE_INFO.name}. All rights reserved.
      </div>
    </footer>
  )
}
