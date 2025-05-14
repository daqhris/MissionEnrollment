'use client';

import React from 'react';
import { OnboardingProvider as Onboarding } from '../../components/Onboarding';

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  return (
    <Onboarding>
      {children}
    </Onboarding>
  );
}
