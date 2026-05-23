export type PriceUnit = 'usd' | 'vndK'

export function priceUnitFor(value: number): PriceUnit {
  return value >= 100 ? 'vndK' : 'usd'
}

export function formatPrice(value: number, unit: PriceUnit = priceUnitFor(value)): string {
  if (unit === 'vndK') {
    return `${value.toLocaleString('vi-VN', { maximumFractionDigits: 0 })}k`
  }

  return `$${value.toFixed(2)}`
}

export function formatPriceDelta(value: number, unit: PriceUnit): string {
  return `+ ${formatPrice(value, unit)}`
}

export function structuredPrice(value: number): { priceCurrency: string; price: string } {
  if (priceUnitFor(value) === 'vndK') {
    return {
      priceCurrency: 'VND',
      price: String(value * 1000),
    }
  }

  return {
    priceCurrency: 'USD',
    price: value.toFixed(2),
  }
}
