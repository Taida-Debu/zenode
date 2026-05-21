import type { Challenge } from '@/lib/models/challenges';

async function parseJson<T>(res: Response): Promise<T> {
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body?.error ?? `Request failed (${res.status})`);
  }
  return body as T;
}

export async function fetchActiveChallenges(): Promise<Challenge[]> {
  const res = await fetch('/api/challenges', { cache: 'no-store' });
  const json = await parseJson<{ data: Challenge[] }>(res);
  return json.data ?? [];
}

export async function fetchChallenge(id: string): Promise<Challenge | null> {
  const res = await fetch(`/api/challenges/${encodeURIComponent(id)}`, { cache: 'no-store' });
  if (res.status === 404) return null;
  const json = await parseJson<{ data: Challenge }>(res);
  return json.data ?? null;
}

export async function createChallengeApi(
  payload: Record<string, unknown>
): Promise<Challenge> {
  const res = await fetch('/api/challenges', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const json = await parseJson<{ data: Challenge }>(res);
  if (!json.data) throw new Error('Challenge was not returned');
  return json.data;
}

export async function joinChallengeApi(challengeId: string, walletAddress: string): Promise<void> {
  const res = await fetch(`/api/challenges/${encodeURIComponent(challengeId)}/join`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress }),
  });
  await parseJson<{ data: { ok: boolean } }>(res);
}

export async function submitChallengeApi(
  challengeId: string,
  walletAddress: string,
  submissionUrl?: string
): Promise<void> {
  const res = await fetch(`/api/challenges/${encodeURIComponent(challengeId)}/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ walletAddress, submissionUrl }),
  });
  await parseJson<{ data: { ok: boolean } }>(res);
}
