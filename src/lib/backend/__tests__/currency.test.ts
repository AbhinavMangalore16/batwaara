import { describe, it, expect } from 'vitest';
import { convertCurrency, DEFAULT_EXCHANGE_RATES } from '../currency';

describe('Multi-Currency Conversion Engine', () => {
  it('returns exact amount when source and target currencies are identical', () => {
    const result = convertCurrency(100, 'USD', 'USD');
    expect(result).toBe(100);
  });

  it('converts USD to EUR correctly using default exchange rate', () => {
    // 100 USD * 0.92 = 92 EUR
    const result = convertCurrency(100, 'USD', 'EUR');
    expect(result).toBe(92);
  });

  it('converts EUR to INR correctly via USD base conversion', () => {
    // 100 EUR -> USD: 100 / 0.92 = 108.69565 USD
    // 108.69565 USD -> INR: 108.69565 * 83.5 = 9076.09 INR
    const result = convertCurrency(100, 'EUR', 'INR', DEFAULT_EXCHANGE_RATES);
    expect(result).toBe(9076.09);
  });

  it('throws error for unsupported currency codes', () => {
    expect(() => convertCurrency(100, 'XYZ', 'USD')).toThrow('Unsupported source currency: XYZ');
  });
});
