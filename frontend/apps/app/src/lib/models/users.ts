import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import { db } from '../firebase.config';

export interface UserProfile {
  walletAddress: string;
  githubUsername: string;
  trackedRepos?: string[];
  updatedAt: number;
}

export class UserService {
  private usersCollection = collection(db, 'users');

  private docId(walletAddress: string) {
    return walletAddress.toLowerCase();
  }

  async upsertUser(params: {
    walletAddress: string;
    githubUsername: string;
    trackedRepos?: string[];
  }): Promise<void> {
    const ref = doc(this.usersCollection, this.docId(params.walletAddress));
    const existing = await getDoc(ref);
    const payload: UserProfile = {
      walletAddress: params.walletAddress,
      githubUsername: params.githubUsername,
      trackedRepos: params.trackedRepos ?? existing.data()?.trackedRepos ?? [],
      updatedAt: Date.now(),
    };
    await setDoc(ref, payload, { merge: true });
  }

  async getUser(walletAddress: string): Promise<UserProfile | null> {
    const ref = doc(this.usersCollection, this.docId(walletAddress));
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    return snap.data() as UserProfile;
  }

  async addTrackedRepo(walletAddress: string, repoFullName: string): Promise<void> {
    const ref = doc(this.usersCollection, this.docId(walletAddress));
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      await setDoc(ref, {
        walletAddress,
        githubUsername: '',
        trackedRepos: [repoFullName],
        updatedAt: Date.now(),
      });
      return;
    }
    await updateDoc(ref, {
      trackedRepos: arrayUnion(repoFullName),
      updatedAt: Date.now(),
    });
  }
}

export const userService = new UserService();
