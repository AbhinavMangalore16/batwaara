import type { Category } from '@/types/database';

export interface ParsedReceiptData {
  amount: number | null;
  description: string | null;
  category: Category;
  date: string | null;
  rawText: string;
}

const CATEGORY_KEYWORDS: Record<Category, string[]> = {
  Food: [
    'restaurant',
    'cafe',
    'coffee',
    'kitchen',
    'diner',
    'bar',
    'grill',
    'pizza',
    'burger',
    'bakery',
    'food',
    'bistro',
    'menu',
    'meal',
    'lunch',
    'dinner',
    'breakfast',
    'starbucks',
    'mcdonald',
  ],
  Transport: [
    'uber',
    'lyft',
    'taxi',
    'cab',
    'airline',
    'flight',
    'rail',
    'train',
    'bus',
    'metro',
    'transit',
    'gas',
    'fuel',
    'shell',
    'chevron',
    'exxon',
    'parking',
    'toll',
  ],
  Lodging: [
    'hotel',
    'motel',
    'resort',
    'airbnb',
    'hostel',
    'inn',
    'lodging',
    'stay',
    'suite',
    'marriott',
    'hilton',
    'hyatt',
  ],
  Activities: [
    'cinema',
    'movie',
    'theater',
    'museum',
    'park',
    'zoo',
    'ticket',
    'concert',
    'event',
    'show',
    'bowling',
    'golf',
    'tour',
  ],
  Shopping: [
    'walmart',
    'target',
    'amazon',
    'store',
    'shop',
    'market',
    'mall',
    'apparel',
    'clothing',
    'electronics',
    'costco',
    'bestbuy',
  ],
  Other: [],
};

export function extractReceiptDetails(rawText: string): ParsedReceiptData {
  if (!rawText || rawText.trim() === '') {
    return {
      amount: null,
      description: null,
      category: 'Other',
      date: null,
      rawText: '',
    };
  }

  const lines = rawText
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // 1. Extract Amount
  let amount: number | null = null;

  // Look for total keywords first (excluding subtotal)
  const totalRegex = /(?<!sub)(?:\b(?:total|amount due|grand total|balance due|net total)\b)[\s:$]*([$₹€£]?\s*[\d,]+\.\d{2})/i;
  const matchTotal = rawText.match(totalRegex);

  if (matchTotal && matchTotal[1]) {
    const parsed = parseFloat(matchTotal[1].replace(/[^0-9.]/g, ''));
    if (!isNaN(parsed) && parsed > 0) {
      amount = parsed;
    }
  }

  // Fallback: Find the largest decimal number in the text
  if (amount === null) {
    const numberRegex = /[$₹€£]?\s*([\d,]+\.\d{2})\b/g;
    let match: RegExpExecArray | null;
    let maxVal = 0;

    while ((match = numberRegex.exec(rawText)) !== null) {
      const val = parseFloat(match[1].replace(/,/g, ''));
      if (!isNaN(val) && val > maxVal) {
        maxVal = val;
      }
    }

    if (maxVal > 0) {
      amount = maxVal;
    }
  }

  // 2. Extract Description (Merchant Name)
  let description: string | null = null;

  // Header line is usually merchant name (first 3 lines)
  for (const line of lines.slice(0, 3)) {
    const isAddressOrGeneric = /street|st\.|ave|avenue|road|rd\.|blvd|suite|pkwy|receipt|tax|date|total|invoice|welcome|order|tel:|phone:/i.test(line);
    if (!isAddressOrGeneric && line.length > 2) {
      description = line;
      break;
    }
  }

  if (!description && lines.length > 0) {
    description = lines[0];
  }

  // 3. Infer Category
  let inferredCategory: Category = 'Other';
  const lowerText = rawText.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => lowerText.includes(kw))) {
      inferredCategory = category as Category;
      break;
    }
  }

  // 4. Extract Date
  let date: string | null = null;
  const dateRegex = /\b(\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}[/-]\d{1,2}[/-]\d{1,2})\b/;
  const matchDate = rawText.match(dateRegex);

  if (matchDate) {
    try {
      const parsedDate = new Date(matchDate[1]);
      if (!isNaN(parsedDate.getTime())) {
        date = parsedDate.toISOString();
      }
    } catch {
      date = null;
    }
  }

  return {
    amount,
    description,
    category: inferredCategory,
    date,
    rawText,
  };
}

export async function parseReceiptWithOCRSpace(
  imageUrl: string,
  apiKey?: string
): Promise<ParsedReceiptData> {
  const key = apiKey || process.env.OCR_SPACE_API_KEY || 'helloworld';

  const formData = new FormData();
  formData.append('apikey', key);
  formData.append('isOverlayRequired', 'false');
  formData.append('OCREngine', '2');
  formData.append('detectOrientation', 'true');
  formData.append('isTable', 'true');
  formData.append('scale', 'true');

  if (imageUrl.startsWith('data:')) {
    formData.append('base64Image', imageUrl);
    const mimeMatch = imageUrl.match(/^data:image\/([a-zA-Z0-9]+);base64,/);
    const fileType = mimeMatch ? mimeMatch[1].toUpperCase() : 'JPG';
    formData.append('filetype', fileType === 'JPEG' ? 'JPG' : fileType);
  } else {
    formData.append('url', imageUrl);
    const extMatch = imageUrl.split('?')[0].split('.').pop()?.toUpperCase();
    const fileType = ['JPG', 'JPEG', 'PNG', 'PDF', 'WEBP'].includes(extMatch || '') ? (extMatch === 'JPEG' ? 'JPG' : extMatch!) : 'JPG';
    formData.append('filetype', fileType);
  }

  const response = await fetch('https://api.ocr.space/parse/image', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    console.error('OCR.space API Error Response:', response.status, errText);
    throw new Error(`OCR.space API HTTP error ${response.status}: ${response.statusText}`);
  }

  const result = await response.json();

  if (result.IsErroredOnProcessing) {
    const errorMsg = Array.isArray(result.ErrorMessage)
      ? result.ErrorMessage.join(', ')
      : result.ErrorMessage || 'OCR processing failed';
    throw new Error(`OCR Error: ${errorMsg}`);
  }

  const parsedResults = result.ParsedResults;
  if (!parsedResults || parsedResults.length === 0 || !parsedResults[0].ParsedText) {
    throw new Error('No text could be extracted from this receipt image. Try taking a clearer photo.');
  }

  const rawText = parsedResults.map((r: any) => r.ParsedText).join('\n');
  return extractReceiptDetails(rawText);
}
