import { NextRequest } from 'next/server';
import { pullRequestService } from '@/lib/models/pull_requests';
import { apiData, apiError } from '@/lib/api/response';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const wallet = request.nextUrl.searchParams.get('wallet');
    if (!wallet) return apiError('wallet query param is required');
    const list = await pullRequestService.listByWallet(wallet);
    return apiData(list);
  } catch (error) {
    // console.error('GET /api/contributions/pull-requests', error);
    return apiError('Failed to load pull requests', 500);
  }
}
