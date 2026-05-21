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

    const ok = await challengeService.joinChallenge(id, walletAddress);
    if (!ok) {
      return apiError('Could not join challenge (not found or already joined)', 409);
    }
    const challenge = await challengeService.getChallenge(id);
    return apiData({ ok: true, challenge });
  } catch (error) {
    // console.error('POST /api/challenges/[id]/join', error);
    return apiError('Failed to join challenge', 500);
  }
}
