import { create } from 'zustand';

interface VerificationState {
  isVerified: boolean;
  verifiedName: string | null;
  setVerified: (status: boolean) => void;
  setVerifiedName: (name: string | null) => void;
}

export const useVerificationStore = create<VerificationState>((set) => ({
  isVerified: false,
  verifiedName: null,
  setVerified: (status) => set({ isVerified: status }),
  setVerifiedName: (name) => set({ verifiedName: name }),
}));
