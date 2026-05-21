import { NextRequest } from 'next/server';
import { challengeService, type Challenge } from '@/lib/models/challenges';
import { apiData, apiError } from '@/lib/api/response';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const challenges = await challengeService.getActiveChallenges();
    return apiData(challenges);
  } catch (error) {
    // console.error('GET /api/challenges', error);
    return apiError('Failed to load challenges', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const createdBy = body?.createdBy ?? body?.walletAddress;
    if (!createdBy || typeof createdBy !== 'string') {
      return apiError('createdBy (wallet address) is required');
    }

    const challengePayload: Omit<Challenge, 'id' | 'createdAt' | 'participants' | 'completions'> = {
      name: body.name,
      description: body.description,
      type: body.type,
      difficulty: body.difficulty,
      xp: Number(body.xp) || 0,
      reward: body.reward ?? '',
      category: body.category ?? 'General',
      deadlineTimestamp: Number(body.deadlineTimestamp),
      createdBy,
      codeTemplate: body.codeTemplate ?? '',
      solution: body.solution ?? '',
      designCriteria: body.designCriteria ?? [],
      repoUrl: body.repoUrl ?? '',
      requiredSkills: body.requiredSkills ?? [],
    };

    if (!challengePayload.name || !challengePayload.description || !challengePayload.deadlineTimestamp) {
      return apiError('name, description, and deadlineTimestamp are required');
    }

    const docId = await challengeService.createChallenge(challengePayload);
    const created = await challengeService.getChallenge(docId);
    if (!created) {
      return apiError('Challenge created but could not be loaded', 500);
    }
    return apiData(created, 201);
  } catch (error) {
    // console.error('POST /api/challenges', error);
    return apiError('Failed to create challenge', 500);
  }
}
