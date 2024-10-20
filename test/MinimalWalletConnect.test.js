import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MinimalWalletConnect from '../components/MinimalWalletConnect';

// Mock the wagmi hooks
jest.mock('wagmi', () => ({
  useAccount: jest.fn(),
  useConnect: jest.fn(),
  useDisconnect: jest.fn(),
}));

describe('MinimalWalletConnect', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    jest.resetAllMocks();
  });

  it('renders without crashing', () => {
    const mockUseAccount = { isConnected: false };
    const mockUseConnect = { connect: jest.fn(), connectors: [{ id: 'injected' }] };
    const mockUseDisconnect = { disconnect: jest.fn() };

    require('wagmi').useAccount.mockReturnValue(mockUseAccount);
    require('wagmi').useConnect.mockReturnValue(mockUseConnect);
    require('wagmi').useDisconnect.mockReturnValue(mockUseDisconnect);

    render(<MinimalWalletConnect />);
    expect(screen.getByText('Minimal Wallet Connect')).toBeInTheDocument();
  });

  it('displays connect button when not connected', () => {
    const mockUseAccount = { isConnected: false };
    const mockUseConnect = { connect: jest.fn(), connectors: [{ id: 'injected' }] };
    const mockUseDisconnect = { disconnect: jest.fn() };

    require('wagmi').useAccount.mockReturnValue(mockUseAccount);
    require('wagmi').useConnect.mockReturnValue(mockUseConnect);
    require('wagmi').useDisconnect.mockReturnValue(mockUseDisconnect);

    render(<MinimalWalletConnect />);
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
  });

  it('displays disconnect button when connected', () => {
    const mockUseAccount = { isConnected: true, address: '0x1234...' };
    const mockUseConnect = { connect: jest.fn(), connectors: [{ id: 'injected' }] };
    const mockUseDisconnect = { disconnect: jest.fn() };

    require('wagmi').useAccount.mockReturnValue(mockUseAccount);
    require('wagmi').useConnect.mockReturnValue(mockUseConnect);
    require('wagmi').useDisconnect.mockReturnValue(mockUseDisconnect);

    render(<MinimalWalletConnect />);
    expect(screen.getByText('Disconnect')).toBeInTheDocument();
    expect(screen.getByText('Connected Account: 0x1234...')).toBeInTheDocument();
  });
});
