import { challengeService } from '@/lib/models/challenges';
import { apiData, apiError } from '@/lib/api/response';

export const dynamic = 'force-dynamic';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const challenge = await challengeService.getChallenge(id);
    if (!challenge) {
      return apiError('Challenge not found', 404);
    }
    return apiData(challenge);
  } catch (error) {
    // console.error('GET /api/challenges/[id]', error);
    return apiError('Failed to load challenge', 500);
  }
}
