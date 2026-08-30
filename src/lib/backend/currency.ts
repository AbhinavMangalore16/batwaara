export interface ExchangeRates {
  [currencyCode: string]: number; // Rate relative to USD (1 USD = rate)
}

export const DEFAULT_EXCHANGE_RATES: ExchangeRates = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.5,
  CAD: 1.36,
  AUD: 1.52,
  JPY: 155.0,
};

export function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: ExchangeRates = DEFAULT_EXCHANGE_RATES
): number {
  if (fromCurrency === toCurrency) {
    return Math.round(amount * 100) / 100;
  }

  const fromRate = rates[fromCurrency.toUpperCase()];
  const toRate = rates[toCurrency.toUpperCase()];

  if (!fromRate) {
    throw new Error(`Unsupported source currency: ${fromCurrency}`);
  }
  if (!toRate) {
    throw new Error(`Unsupported target currency: ${toCurrency}`);
  }

  // Convert to USD base first, then to target currency
  const amountInUSD = amount / fromRate;
  const convertedAmount = amountInUSD * toRate;

  return Math.round(convertedAmount * 100) / 100;
}
