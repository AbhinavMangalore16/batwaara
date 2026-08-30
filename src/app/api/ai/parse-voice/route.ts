import { NextResponse } from 'next/server';

/**
 * Natural Language & Voice AI Parser Route
 * Converts spoken voice strings or typed natural language inputs like:
 * "Paid 1200 rupees for Dinner at Khan Chacha split between Abhinav and Rahul"
 * into structured JSON: { amount, description, category, splitType, matchedMemberNames }
 */
export async function POST(request: Request) {
  try {
    const { prompt, memberNames } = await request.json();

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid prompt or voice transcription' },
        { status: 400 }
      );
    }

    const cleanPrompt = prompt.trim();
    const lower = cleanPrompt.toLowerCase();

    // 1. Extract Amount (e.g. 1200, 1200.50, $50, ₹450, 450 rupees)
    let amount: number | null = null;
    const amountMatch = cleanPrompt.match(/(?:rs\.?|inr|₹|\$)\s*(\d+(?:\.\d{1,2})?)|(\d+(?:\.\d{1,2})?)\s*(?:rupees|rs\.?|inr|\$)?/i);
    if (amountMatch) {
      const parsedNum = parseFloat(amountMatch[1] || amountMatch[2]);
      if (!isNaN(parsedNum) && parsedNum > 0) {
        amount = parsedNum;
      }
    }

    // 2. Infer Category from Keywords
    let category = 'Other';
    if (/dinner|lunch|breakfast|food|coffee|restaurant|pizza|burger|starbucks|biryani|meal|drinks|bar/i.test(lower)) {
      category = 'Food';
    } else if (/cab|uber|ola|taxi|auto|flight|train|metro|petrol|fuel|bus|ride/i.test(lower)) {
      category = 'Transport';
    } else if (/hotel|airbnb|resort|room|stay|lodging|hostel/i.test(lower)) {
      category = 'Lodging';
    } else if (/movie|cinema|ticket|game|bowling|concert|party|event|club|activities/i.test(lower)) {
      category = 'Activities';
    } else if (/grocery|supermarket|mall|clothes|shopping|amazon|flipkart|zara/i.test(lower)) {
      category = 'Shopping';
    }

    // 3. Infer Split Type
    let splitType = 'equal';
    if (/percentage|percent|%/i.test(lower)) {
      splitType = 'percentage';
    } else if (/exact|custom|specific/i.test(lower)) {
      splitType = 'exact';
    } else if (/shares|share|ratio/i.test(lower)) {
      splitType = 'shares';
    }

    // 4. Detect mentioned members in "split between X, Y" or "with X"
    const matchedMemberNames: string[] = [];
    if (Array.isArray(memberNames) && memberNames.length > 0) {
      memberNames.forEach((name: string) => {
        if (!name || name.length < 2) return;
        const nameLower = name.toLowerCase();
        const firstNameLower = nameLower.split(' ')[0];

        if (lower.includes(nameLower) || (firstNameLower.length >= 2 && lower.includes(firstNameLower))) {
          matchedMemberNames.push(name);
        }
      });
    }

    // 5. Extract Clean Description
    let description = cleanPrompt
      .replace(/(?:paid|spent|cost|bought|for|split|between|with|and|equal|percentage|exact|shares|rupees|rs\.?|inr|\$|\d+(?:\.\d{1,2})?)/gi, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!description || description.length < 2) {
      description = cleanPrompt;
    }

    description = description.charAt(0).toUpperCase() + description.slice(1);

    return NextResponse.json({
      success: true,
      data: {
        amount: amount || 0,
        description: description || 'Expense',
        category,
        splitType,
        matchedMemberNames,
        rawPrompt: cleanPrompt,
      },
    });
  } catch (err: any) {
    console.error('Voice Parsing error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to parse natural language voice prompt' },
      { status: 500 }
    );
  }
}
