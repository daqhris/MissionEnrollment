'use client';

import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';

type OnboardingStep = 'identity' | 'attendance' | 'attestation' | 'success';

interface TooltipProps {
  id: string;
  content: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  children: ReactNode;
}

interface OnboardingContextType {
  isFirstTimeUser: boolean;
  setIsFirstTimeUser: (value: boolean) => void;
  currentStep: OnboardingStep;
  setCurrentStep: (step: OnboardingStep) => void;
  showTooltips: boolean;
  setShowTooltips: (show: boolean) => void;
  completedSteps: OnboardingStep[];
  markStepComplete: (step: OnboardingStep) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isFirstTimeUser, setIsFirstTimeUser] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('identity');
  const [showTooltips, setShowTooltips] = useState<boolean>(true);
  const [completedSteps, setCompletedSteps] = useState<OnboardingStep[]>([]);

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (!hasVisitedBefore) {
      setIsFirstTimeUser(true);
      localStorage.setItem('hasVisitedBefore', 'true');
    }
  }, []);

  const markStepComplete = (step: OnboardingStep) => {
    if (!completedSteps.includes(step)) {
      setCompletedSteps([...completedSteps, step]);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        isFirstTimeUser,
        setIsFirstTimeUser,
        currentStep,
        setCurrentStep,
        showTooltips,
        setShowTooltips,
        completedSteps,
        markStepComplete
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export const Tooltip: React.FC<TooltipProps> = ({ id, content, position = 'top', children }) => {
  const { showTooltips } = useOnboarding();
  const [isVisible, setIsVisible] = useState(false);

  if (!showTooltips) {
    return <>{children}</>;
  }

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-800',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-800',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-800',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-800'
  };

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
      id={id}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-800 rounded-md shadow-lg transition-opacity duration-300 ${
            positionClasses[position]
          }`}
          role="tooltip"
        >
          {content}
          <div
            className={`absolute w-0 h-0 border-4 border-transparent ${arrowClasses[position]}`}
          ></div>
        </div>
      )}
    </div>
  );
};


export const HelpButton: React.FC<{ targetStep: OnboardingStep }> = ({ targetStep }) => {
  const { setCurrentStep } = useOnboarding();
  
  const handleClick = () => {
    setCurrentStep(targetStep);
  };
  
  return (
    <button
      className="btn btn-circle btn-sm btn-ghost text-primary"
      onClick={handleClick}
      aria-label="Get help"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </button>
  );
};

export const ProgressIndicator: React.FC = () => {
  const { currentStep, completedSteps } = useOnboarding();
  
  const steps: { id: OnboardingStep; label: string }[] = [
    { id: 'identity', label: 'Identity Check' },
    { id: 'attendance', label: 'Event Attendance' },
    { id: 'attestation', label: 'Create Attestation' },
    { id: 'success', label: 'Complete' }
  ];
  
  return (
    <div className="w-full py-4">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = currentStep === step.id;
          
          return (
            <React.Fragment key={step.id}>
              {/* Step circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted
                      ? 'bg-success text-white'
                      : isCurrent
                      ? 'bg-primary text-white'
                      : 'bg-base-300 text-base-content/50'
                  }`}
                >
                  {isCompleted ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={`text-xs mt-1 ${
                    isCurrent ? 'text-primary font-medium' : 'text-base-content/70'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 ${
                    completedSteps.includes(step.id) ? 'bg-success' : 'bg-base-300'
                  }`}
                ></div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
