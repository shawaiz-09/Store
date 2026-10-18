export const money = (n) => '₨ ' + Number(n || 0).toLocaleString('en-US')

export const fmtDate = (iso) =>
  new Date(iso).toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

export const DELIVERY_FEE = 250
export const FREE_DELIVERY_OVER = 10000

export const deliveryFeeFor = (subtotal) =>
  subtotal >= FREE_DELIVERY_OVER || subtotal === 0 ? 0 : DELIVERY_FEE
