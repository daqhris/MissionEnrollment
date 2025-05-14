import React from 'react';

interface TourStepProps {
  title: string;
  content: string;
  target: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

export const identityTourSteps: TourStepProps[] = [
  {
    title: 'Welcome to Mission Enrollment',
    content: 'This guided tour will help you understand how to enroll for the Zinneke Rescue Mission on the Base blockchain.',
    target: 'welcome-card',
    position: 'bottom'
  },
  {
    title: 'Connect Your Wallet',
    content: 'First, connect your Ethereum wallet by clicking this button. You\'ll need a wallet like MetaMask, Coinbase Wallet, or WalletConnect.',
    target: 'wallet-connect-button',
    position: 'bottom'
  },
  {
    title: 'Onchain Identity Check',
    content: 'Enter your Base name (yourname.base.eth) to verify your onchain identity. This is required for enrollment.',
    target: 'identity-input',
    position: 'bottom'
  },
  {
    title: 'Submit Your Name',
    content: 'After entering your name, click REPLY to verify it matches your wallet\'s onchain identity.',
    target: 'identity-submit-button',
    position: 'right'
  }
];

export const attendanceTourSteps: TourStepProps[] = [
  {
    title: 'Event Attendance Verification',
    content: 'In this step, we\'ll verify your attendance at one of our approved blockchain events using your POAP tokens.',
    target: 'attendance-card',
    position: 'top'
  },
  {
    title: 'Confirm Attendance',
    content: 'Select "Yes, I attended" if you participated in ETHGlobal Brussels or ETHDenver Coinbase events.',
    target: 'attendance-yes-button',
    position: 'bottom'
  },
  {
    title: 'POAP Verification',
    content: 'We\'ll automatically check your wallet for POAP tokens from our approved events.',
    target: 'poap-verification-area',
    position: 'bottom'
  },
  {
    title: 'Role Recognition',
    content: 'Your role at the event (Hacker, Mentor, Judge, etc.) will be automatically detected from your POAP.',
    target: 'role-badge',
    position: 'right'
  },
  {
    title: 'Network Switching',
    content: 'After verification, you\'ll need to switch to Base Sepolia network for attestation creation.',
    target: 'network-switch-button',
    position: 'bottom'
  }
];

export const attestationTourSteps: TourStepProps[] = [
  {
    title: 'Create Your Attestation',
    content: 'Now you\'ll create an onchain attestation to officially enroll in the Zinneke Rescue Mission.',
    target: 'attestation-card',
    position: 'top'
  },
  {
    title: 'Review Your Information',
    content: 'Verify your name, role, and event details before proceeding.',
    target: 'attestation-details',
    position: 'bottom'
  },
  {
    title: 'Sign Message',
    content: 'You\'ll need to sign a message with your wallet to verify your identity.',
    target: 'sign-message-button',
    position: 'bottom'
  },
  {
    title: 'Create Attestation',
    content: 'Click this button to create your attestation on the Base Sepolia network.',
    target: 'create-attestation-button',
    position: 'bottom'
  }
];

export const successTourSteps: TourStepProps[] = [
  {
    title: 'Enrollment Complete!',
    content: 'Congratulations! You\'ve successfully enrolled in the Zinneke Rescue Mission.',
    target: 'success-card',
    position: 'top'
  },
  {
    title: 'View Your Attestation',
    content: 'Click here to view your attestation on the Base Sepolia blockchain explorer.',
    target: 'view-attestation-button',
    position: 'bottom'
  },
  {
    title: 'Share Your Enrollment',
    content: 'Share your participation in this collaborative artistic mission on social media.',
    target: 'share-button',
    position: 'right'
  }
];

export const allTourSteps = {
  identity: identityTourSteps,
  attendance: attendanceTourSteps,
  attestation: attestationTourSteps,
  success: successTourSteps
};
