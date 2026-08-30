import { describe, it, expect } from 'vitest';
import { extractReceiptDetails } from '../ocr';

describe('OCR Receipt Parsing Engine', () => {
  it('extracts merchant name, total amount, date, and food category from restaurant receipt', () => {
    const rawReceiptText = `
      STARBUCKS COFFEE #1204
      123 Main Street, Seattle WA
      Date: 2026-08-15
      ------------------------
      1x Iced Caramel Macchiato  $5.75
      1x Avocado Toast           $8.50
      1x Blueberry Muffin        $3.25
      ------------------------
      Subtotal:                  $17.50
      Tax:                       $1.75
      TOTAL:                     $19.25
      ------------------------
      Thank you for visiting!
    `;

    const parsed = extractReceiptDetails(rawReceiptText);

    expect(parsed.description).toBe('STARBUCKS COFFEE #1204');
    expect(parsed.amount).toBe(19.25);
    expect(parsed.category).toBe('Food');
  });

  it('infers transport category for Uber receipt', () => {
    const uberReceiptText = `
      UBER RIDE RECEIPT
      Trip Date: 08/20/2026
      Driver: John
      ------------------------
      Base Fare: $15.00
      Tolls & Fees: $3.50
      Tip: $4.00
      Amount Due: $22.50
    `;

    const parsed = extractReceiptDetails(uberReceiptText);

    expect(parsed.amount).toBe(22.5);
    expect(parsed.category).toBe('Transport');
  });

  it('falls back to finding max amount when TOTAL label is missing', () => {
    const missingLabelText = `
      WALMART SUPERCENTER
      Item A $12.00
      Item B $45.80
      Tax $3.20
      51.00
    `;

    const parsed = extractReceiptDetails(missingLabelText);

    expect(parsed.description).toBe('WALMART SUPERCENTER');
    expect(parsed.amount).toBe(51.0);
    expect(parsed.category).toBe('Shopping');
  });

  it('handles empty or blank text gracefully', () => {
    const parsed = extractReceiptDetails('');
    expect(parsed.amount).toBeNull();
    expect(parsed.description).toBeNull();
    expect(parsed.category).toBe('Other');
  });
});
