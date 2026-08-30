import { NextResponse } from 'next/server';
import { parseReceiptWithOCRSpace, extractReceiptDetails } from '@/lib/backend/ocr';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { imageUrl, rawText } = body;

    if (rawText && typeof rawText === 'string') {
      const parsedData = extractReceiptDetails(rawText);
      return NextResponse.json({ success: true, data: parsedData });
    }

    if (!imageUrl || typeof imageUrl !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid imageUrl or rawText' },
        { status: 400 }
      );
    }

    const parsedData = await parseReceiptWithOCRSpace(imageUrl);
    return NextResponse.json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('OCR API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to scan receipt' },
      { status: 500 }
    );
  }
}
