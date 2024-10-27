import { create } from 'zustand';

interface VerificationState {
  isVerified: boolean;
  verifiedName: string | null;
  userInput: string;
  error: string | null;
  setVerified: (status: boolean) => void;
  setVerifiedName: (name: string | null) => void;
  setUserInput: (input: string) => void;
  setVerificationStatus: (status: boolean) => void;
  setError: (error: string | null) => void;
}

export const useVerificationStore = create<VerificationState>((set) => ({
  isVerified: false,
  verifiedName: null,
  userInput: '',
  error: null,
  setVerified: (status) => set({ isVerified: status }),
  setVerifiedName: (name) => set({ verifiedName: name }),
  setUserInput: (input) => set({ userInput: input }),
  setVerificationStatus: (status) => set({ isVerified: status }),
  setError: (error) => set({ error: error }),
}));
