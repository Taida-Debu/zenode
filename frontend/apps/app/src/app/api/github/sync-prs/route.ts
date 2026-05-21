import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from 'octokit';
import { userService } from '@/lib/models/users';
import { pullRequestService } from '@/lib/models/pull_requests';

export const dynamic = 'force-dynamic';

interface GitHubSearchItem {
  number: number;
  title: string;
  html_url: string;
  state: string;
  pull_request?: { merged_at: string | null };
  repository_url?: string;
  base?: { repo?: { full_name?: string } };
}

function repoFromSearchItem(item: GitHubSearchItem): string | null {
  if (item.base?.repo?.full_name) return item.base.repo.full_name;
  if (item.repository_url) {
    const parts = item.repository_url.split('/repos/')[1]?.split('/');
    if (parts && parts.length >= 2) return `${parts[0]}/${parts[1]}`;
  }
  return null;
}

function mapState(item: GitHubSearchItem): 'open' | 'closed' | 'merged' {
  if (item.pull_request?.merged_at) return 'merged';
  if (item.state === 'open') return 'open';
  return 'closed';
}

/**
 * Syncs PRs for a wallet-linked GitHub username against tracked challenge repos.
 * Server-only: uses GITHUB_TOKEN; never expose token to the client.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');
    const walletAddress = searchParams.get('wallet');

    if (!username || !walletAddress) {
      return NextResponse.json(
        { error: 'username and wallet query params are required' },
        { status: 400 }
      );
    }

    const profile = await userService.getUser(walletAddress);
    if (!profile || profile.githubUsername.toLowerCase() !== username.toLowerCase()) {
      return NextResponse.json(
        { error: 'GitHub username does not match wallet profile' },
        { status: 403 }
      );
    }

    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      return NextResponse.json(
        { error: 'GITHUB_TOKEN is not configured for PR search' },
        { status: 503 }
      );
    }

    const trackedRepos = profile.trackedRepos ?? [];
    if (trackedRepos.length === 0) {
      return NextResponse.json({ synced: [], message: 'No tracked repos. Join a challenge with a repo URL first.' });
    }

    const octokit = new Octokit({ auth: token });
    const searchResult = await octokit.request('GET /search/issues', {
      q: `author:${username} type:pr`,
      per_page: 100,
      headers: { 'X-GitHub-Api-Version': '2022-11-28' },
    });

    const items = (searchResult.data.items ?? []) as GitHubSearchItem[];
    const synced = [];

    for (const item of items) {
      const repoFullName = repoFromSearchItem(item);
      if (!repoFullName || !trackedRepos.includes(repoFullName)) continue;

      const pr = {
        walletAddress,
        githubUsername: username,
        repoFullName,
        prNumber: item.number,
        title: item.title,
        htmlUrl: item.html_url,
        state: mapState(item),
      };

      await pullRequestService.upsertPullRequest(pr);
      synced.push(pr);
    }

    return NextResponse.json({ synced, count: synced.length });
  } catch (error) {
    // console.error('sync-prs error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Sync failed' },
      { status: 500 }
    );
  }
}
