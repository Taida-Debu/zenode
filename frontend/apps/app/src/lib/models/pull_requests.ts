import {
  collection,
  doc,
  getDocs,
  query,
  where,
  setDoc,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase.config';

export type PullRequestState = 'open' | 'closed' | 'merged';

export interface TrackedPullRequest {
  id: string;
  walletAddress: string;
  githubUsername: string;
  repoFullName: string;
  prNumber: number;
  title: string;
  htmlUrl: string;
  state: PullRequestState;
  challengeId?: string;
  proposalId?: string;
  syncedAt: number;
}

export class PullRequestService {
  private prCollection = collection(db, 'pull_requests');

  private docId(username: string, repo: string, prNumber: number) {
    return `${username}_${repo.replace('/', '_')}_${prNumber}`.toLowerCase();
  }

  async upsertPullRequest(pr: Omit<TrackedPullRequest, 'id' | 'syncedAt'>): Promise<void> {
    const id = this.docId(pr.githubUsername, pr.repoFullName, pr.prNumber);
    const ref = doc(this.prCollection, id);
    await setDoc(
      ref,
      {
        ...pr,
        id,
        syncedAt: Date.now(),
      },
      { merge: true }
    );
  }

  async listByWallet(walletAddress: string): Promise<TrackedPullRequest[]> {
    const q = query(
      this.prCollection,
      where('walletAddress', '==', walletAddress),
      orderBy('syncedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => d.data() as TrackedPullRequest);
  }

  async listByGithubUsername(githubUsername: string): Promise<TrackedPullRequest[]> {
    const q = query(
      this.prCollection,
      where('githubUsername', '==', githubUsername),
      orderBy('syncedAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => d.data() as TrackedPullRequest);
  }
}

export const pullRequestService = new PullRequestService();
