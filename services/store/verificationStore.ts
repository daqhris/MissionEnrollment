import { create } from 'zustand';

interface VerificationState {
  isVerified: boolean;
  verifiedName: string;
  setVerified: (status: boolean) => void;
  setVerifiedName: (name: string) => void;
}

export const useVerificationStore = create<VerificationState>((set) => ({
  isVerified: false,
  verifiedName: '',
  setVerified: (status: boolean) => set({ isVerified: status }),
  setVerifiedName: (name: string) => set({ verifiedName: name }),
}));
