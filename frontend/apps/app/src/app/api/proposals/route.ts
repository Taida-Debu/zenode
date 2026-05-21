import { NextRequest } from 'next/server';
import { proposalService } from '@/lib/models/proposals';
import { apiData, apiError } from '@/lib/api/response';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const wallet = request.nextUrl.searchParams.get('wallet');
    if (wallet) {
      const list = await proposalService.listByWallet(wallet);
      return apiData(list);
    }
    const list = await proposalService.listPublic();
    return apiData(list);
  } catch (error) {
    // console.error('GET /api/proposals', error);
    return apiError('Failed to load proposals', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = await proposalService.createProposal(body);
    return apiData({ id }, 201);
  } catch (error) {
    // console.error('POST /api/proposals', error);
    return apiError('Failed to create proposal', 500);
  }
}
