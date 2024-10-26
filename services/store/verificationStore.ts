import { create } from 'zustand';

interface VerificationState {
  isVerified: boolean;
  verifiedName: string;
  userInput: string;
  error: string | null;
  setVerified: (status: boolean) => void;
  setVerifiedName: (name: string) => void;
  setUserInput: (input: string) => void;
  setVerificationStatus: (status: boolean) => void;
  setError: (error: string | null) => void;
}

export const useVerificationStore = create<VerificationState>((set) => ({
  isVerified: false,
  verifiedName: '',
  userInput: '',
  error: null,
  setVerified: (status: boolean) => set({ isVerified: status }),
  setVerifiedName: (name: string) => set({ verifiedName: name }),
  setUserInput: (input: string) => set({ userInput: input }),
  setVerificationStatus: (status: boolean) => set({ isVerified: status }),
  setError: (error: string | null) => set({ error }),
}));
