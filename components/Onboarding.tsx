'use client';

import React, { createContext, useContext, ReactNode } from 'react';

export type OnboardingStep = 'identity' | 'attendance' | 'attestation' | 'success';

export interface OnboardingContextType {
  currentStep: OnboardingStep;
  setCurrentStep: (step: OnboardingStep) => void;
  completedSteps: OnboardingStep[];
  markStepComplete: (step: OnboardingStep) => void;
}

const OnboardingContext = createContext<OnboardingContextType>({
  currentStep: 'identity',
  setCurrentStep: () => {},
  completedSteps: [],
  markStepComplete: () => {}
});

export const useOnboarding = () => {
  return useContext(OnboardingContext);
};

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = React.useState<OnboardingStep>('identity');
  const [completedSteps, setCompletedSteps] = React.useState<OnboardingStep[]>([]);

  const markStepComplete = (step: OnboardingStep) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        completedSteps,
        markStepComplete
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const Tooltip: React.FC<{ id: string; content: string; children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export const HelpButton: React.FC<{ targetStep: OnboardingStep }> = () => {
  return null;
};

export const ProgressIndicator: React.FC = () => {
  const { currentStep } = useOnboarding();
  
  return (
    <div className="text-sm text-center text-base-content/70 mb-4">
      {currentStep === 'identity' && 'Step 1: Identity Verification'}
      {currentStep === 'attendance' && 'Step 2: Event Attendance Validation'}
      {currentStep === 'attestation' && 'Step 3: Create Attestation'}
      {currentStep === 'success' && 'Complete!'}
    </div>
  );
};
