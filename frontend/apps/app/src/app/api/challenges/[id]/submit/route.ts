import { NextRequest } from 'next/server';
import { challengeService } from '@/lib/models/challenges';
import { apiData, apiError } from '@/lib/api/response';

export const dynamic = 'force-dynamic';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const walletAddress = body?.walletAddress;
    if (!walletAddress || typeof walletAddress !== 'string') {
      return apiError('walletAddress is required');
    }

    const ok = await challengeService.submitChallenge(
      id,
      walletAddress,
      body?.submissionUrl
    );
    if (!ok) {
      return apiError('Could not submit (join first or challenge not found)', 409);
    }
    const challenge = await challengeService.getChallenge(id);
    return apiData({ ok: true, challenge });
  } catch (error) {
    // console.error('POST /api/challenges/[id]/submit', error);
    return apiError('Failed to submit challenge', 500);
  }
}
