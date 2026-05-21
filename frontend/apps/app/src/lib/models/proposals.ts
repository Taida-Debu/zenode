import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase.config';

export type ProposalStatus = 'draft' | 'submitted' | 'active' | 'closed';

export interface Proposal {
  id?: string;
  details: string;
  uri: string;
  contributors: string[];
  rewardPool: string;
  isPrivate: boolean;
  deadline: string;
  submitterWallet: string;
  githubUsername: string;
  status: ProposalStatus;
  createdAt: number;
}

export class ProposalService {
  private proposalsCollection = collection(db, 'proposals');

  async createProposal(
    proposal: Omit<Proposal, 'id' | 'status' | 'createdAt'>
  ): Promise<string> {
    const docRef = await addDoc(this.proposalsCollection, {
      ...proposal,
      status: 'submitted' as ProposalStatus,
      createdAt: Date.now(),
    });
    return docRef.id;
  }

  async listByWallet(walletAddress: string): Promise<Proposal[]> {
    const q = query(
      this.proposalsCollection,
      where('submitterWallet', '==', walletAddress),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Proposal));
  }

  async listPublic(): Promise<Proposal[]> {
    const q = query(
      this.proposalsCollection,
      where('isPrivate', '==', false),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as Proposal));
  }
}

export const proposalService = new ProposalService();
