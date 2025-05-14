'use client';

import React from 'react';
import Onboarding from '../../components/Onboarding';

export function OnboardingProvider({ children }: { children: React.ReactNode }) {
  return (
    <Onboarding>
      {children}
    </Onboarding>
  );
}
