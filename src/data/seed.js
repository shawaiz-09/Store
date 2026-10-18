export const CATEGORIES = [
  { id: 'Livestock', label: 'Livestock', emoji: '🐄', gradient: 'from-lime-100 to-emerald-50' },
  { id: 'Pet Care', label: 'Pet Care', emoji: '🐕', gradient: 'from-amber-100 to-orange-50' },
  { id: 'Poultry', label: 'Poultry', emoji: '🐔', gradient: 'from-sky-100 to-blue-50' },
  { id: 'Vaccines', label: 'Vaccines', emoji: '💉', gradient: 'from-violet-100 to-purple-50' },
  { id: 'Vitamins', label: 'Vitamins & Supplements', emoji: '💊', gradient: 'from-rose-100 to-pink-50' },
]

export const categoryMeta = (id) =>
  CATEGORIES.find((c) => c.id === id) || { id, label: id, emoji: '💊', gradient: 'from-slate-100 to-stone-50' }

export const seedProducts = [
  // ── Livestock ──────────────────────────────────────────────
  {
    id: 'p01', name: 'Actibol 100ml Energy Injection', brand: 'ICI Pakistan',
    category: 'Livestock', price: 1550, stock: 42, emoji: '💉', rx: false,
    desc: 'Energy and supportive injection for cattle, buffalo, goats and sheep. Helps recovery from stress, weakness and transport fatigue.',
  },
  {
    id: 'p02', name: 'Amivicom 50ml Injection', brand: 'Selmore',
    category: 'Livestock', price: 850, stock: 60, emoji: '💉', rx: false,
    desc: 'Broad-spectrum supportive injection for livestock and pets. Widely used by vets across Pakistan.',
  },
  {
    id: 'p03', name: 'Camectin 1% Ivermectin Injection 50ml', brand: 'Selmore',
    category: 'Livestock', price: 5200, stock: 18, emoji: '🐄', rx: true,
    desc: 'Ivermectin 1% for the treatment and control of internal and external parasites in cattle, buffalo, sheep and goats.',
  },
  {
    id: 'p04', name: 'CIDR Progesterone Insert for Goats', brand: 'Zoetis',
    category: 'Livestock', price: 2550, stock: 25, emoji: '🐐', rx: true,
    desc: 'Controlled internal drug release device for oestrus synchronisation in goats. Pack of 1 insert.',
  },
  {
    id: 'p05', name: 'CIDR Progesterone Insert for Cattle', brand: 'Zoetis',
    category: 'Livestock', price: 5600, stock: 14, emoji: '🐄', rx: true,
    desc: 'CIDR insert for reproductive management and oestrus synchronisation in cattle and buffalo.',
  },
  {
    id: 'p06', name: 'Cefent DC Dry Cow Intramammary', brand: 'Selmore',
    category: 'Livestock', price: 1880, stock: 30, emoji: '🥛', rx: true,
    desc: 'Cephalosporin dry-cow therapy for the prevention of mastitis during the dry period. Single syringe.',
  },
  {
    id: 'p07', name: 'Oxytetracycline 20% LA Injection 50ml', brand: 'Generic',
    category: 'Livestock', price: 1200, stock: 48, emoji: '💉', rx: false,
    desc: 'Long-acting oxytetracycline 20% for bacterial infections in cattle, goats, sheep and camels.',
  },
  {
    id: 'p08', name: 'Cal-D-Mag Calcium Magnesium 500ml', brand: 'Star Labs',
    category: 'Livestock', price: 1450, stock: 36, emoji: '🧪', rx: false,
    desc: 'Calcium, magnesium and phosphorus injection for milk fever and mineral deficiency in dairy animals.',
  },
  // ── Pet Care ───────────────────────────────────────────────
  {
    id: 'p09', name: 'Bravecto 1000mg Chewable Tablets (Large Dogs)', brand: 'Merck',
    category: 'Pet Care', price: 12500, stock: 12, emoji: '🐕', rx: true,
    desc: 'Fluralaner chew for dogs 20–40 kg. Gives 12 weeks of protection against fleas and ticks.',
  },
  {
    id: 'p10', name: 'Biomax Plus Horse Dewormer Paste', brand: 'Selmore',
    category: 'Pet Care', price: 2400, stock: 22, emoji: '🐴', rx: false,
    desc: 'Ivermectin and praziquantel paste for horses. One syringe treats up to 600 kg bodyweight.',
  },
  {
    id: 'p11', name: 'Milbemax Cat Dewormer Tablets', brand: 'Elanco',
    category: 'Pet Care', price: 2100, stock: 28, emoji: '🐈', rx: true,
    desc: 'Milbemycin oxime and praziquantel tablets for the treatment of roundworm, hookworm and tapeworm in cats.',
  },
  {
    id: 'p12', name: 'PetMectin Spot-On for Dogs 3 Pack', brand: 'Star Labs',
    category: 'Pet Care', price: 1650, stock: 33, emoji: '🐕', rx: false,
    desc: 'Topical spot-on for the control of ticks, fleas and mites in dogs. Three pipettes per pack.',
  },
  // ── Poultry ────────────────────────────────────────────────
  {
    id: 'p13', name: 'FA.TRY.BANIL Water Soluble Sachet 100g', brand: 'Ibn Sina',
    category: 'Poultry', price: 480, stock: 85, emoji: '🐔', rx: false,
    desc: 'Water-soluble supportive formula for poultry flocks. Mix in drinking water as directed.',
  },
  {
    id: 'p14', name: 'Vitamin C WS Poultry 500g', brand: 'Huvepharma',
    category: 'Poultry', price: 950, stock: 55, emoji: '💊', rx: false,
    desc: 'Water-soluble vitamin C powder for heat stress support in broilers, layers and breeders.',
  },
  {
    id: 'p15', name: 'Amprol 20% Coccidiostat 500g', brand: 'Huvepharma',
    category: 'Poultry', price: 1750, stock: 26, emoji: '🐔', rx: false,
    desc: 'Amprolium 20% for the treatment and prevention of coccidiosis in poultry.',
  },
  // ── Vaccines ───────────────────────────────────────────────
  {
    id: 'p16', name: 'Talovac 105 Poultry Vaccine 1000 Dose', brand: 'Hester',
    category: 'Vaccines', price: 4800, stock: 9, emoji: '💉', rx: false,
    desc: 'Live vaccine for the immunisation of chickens against infectious bursal disease. 1000 doses.',
  },
  {
    id: 'p17', name: 'DHPPi Vaccine for Dogs (1 Dose)', brand: 'Velcat',
    category: 'Vaccines', price: 2300, stock: 16, emoji: '🐕', rx: true,
    desc: 'Combined canine vaccine against distemper, hepatitis, parvovirus and parainfluenza. Single dose vial.',
  },
  {
    id: 'p18', name: 'Feline Tricat Vaccine (1 Dose)', brand: 'Velcat',
    category: 'Vaccines', price: 3100, stock: 11, emoji: '🐈', rx: true,
    desc: 'Core vaccine for cats against panleukopenia, calicivirus and herpesvirus. Single dose vial.',
  },
  // ── Vitamins & Supplements ─────────────────────────────────
  {
    id: 'p19', name: 'Hepagen 50ml Liver Tonic', brand: 'Huvepharma',
    category: 'Vitamins', price: 3250, stock: 24, emoji: '🧪', rx: false,
    desc: 'Liver support tonic with essential phospholipids for cattle, horses, dogs and cats.',
  },
  {
    id: 'p20', name: 'ADE Vitamin Injection 100ml', brand: 'Star Labs',
    category: 'Vitamins', price: 1380, stock: 40, emoji: '💊', rx: false,
    desc: 'Fat-soluble vitamins A, D3 and E injection for growth, fertility and immunity support.',
  },
  {
    id: 'p21', name: 'Stresscare Calming Chews for Pets 60 Tabs', brand: 'PetCare',
    category: 'Vitamins', price: 1900, stock: 31, emoji: '🦴', rx: false,
    desc: 'Natural calming chews that help dogs and cats stay relaxed during travel, storms and vet visits.',
  },
]

export const STORE_INFO = {
  name: 'Online Veterinary Store',
  phone: '+92 333 2734108',
  address: 'Karachi, Pakistan',
  hours: 'Mon–Sat · 9:00 AM – 9:00 PM',
}
