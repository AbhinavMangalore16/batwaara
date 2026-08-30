import { NextResponse } from 'next/server';
import { getGroupSummary } from '@/lib/backend/services';
import { generateGroupInsights } from '@/lib/backend/ai-insights';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { groupId } = body;

    if (!groupId) {
      return NextResponse.json(
        { success: false, error: 'groupId is required' },
        { status: 400 }
      );
    }

    const groupData = await getGroupSummary(groupId);
    const insights = await generateGroupInsights(
      groupData.group.name,
      groupData.group.currency,
      groupData.members,
      groupData.expenses
    );

    return NextResponse.json({
      success: true,
      summary: insights.summary,
      tokensUsed: insights.tokensUsed,
    });
  } catch (error: any) {
    console.error('AI Insights API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to generate AI insights' },
      { status: 500 }
    );
  }
}
