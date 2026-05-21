import { NextRequest } from 'next/server';
import { userService } from '@/lib/models/users';
import { apiData, apiError } from '@/lib/api/response';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const wallet = request.nextUrl.searchParams.get('wallet');
    if (!wallet) return apiError('wallet query param is required');
    const profile = await userService.getUser(wallet);
    return apiData(profile);
  } catch (error) {
    // console.error('GET /api/users/profile', error);
    return apiError('Failed to load profile', 500);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const walletAddress = body?.walletAddress;
    const githubUsername = body?.githubUsername;
    if (!walletAddress || typeof walletAddress !== 'string') {
      return apiError('walletAddress is required');
    }
    if (!githubUsername || typeof githubUsername !== 'string') {
      return apiError('githubUsername is required');
    }
    await userService.upsertUser({ walletAddress, githubUsername });
    const profile = await userService.getUser(walletAddress);
    return apiData(profile);
  } catch (error) {
    // console.error('PATCH /api/users/profile', error);
    return apiError('Failed to update profile', 500);
  }
}
