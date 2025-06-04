import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventAttendanceValidation from '../components/EventAttendanceValidation';
import { mockPoapsResponse, mockValidWalletAddresses, mockEventInfo, EventInfo } from './mocks/poapData';
import { fetchPoaps, POAPEvent } from '../utils/fetchPoapsUtil';

// Mock fetchPoaps function
jest.mock('../utils/fetchPoapsUtil');
const mockedFetchPoaps = fetchPoaps as jest.MockedFunction<typeof fetchPoaps>;

// Mock setTimeout to control loading animation timing
jest.useFakeTimers();

describe('EventAttendanceValidation Component', () => {
  // Ensure mock data exists
  const mockAddress = mockValidWalletAddresses[0];
  if (!mockAddress) throw new Error('Mock wallet address is not defined');

  const mockApprovedName = mockEventInfo.verifiedName;
  const mockOnVerified = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockedFetchPoaps.mockResolvedValue(mockPoapsResponse);
  });

  it('displays initial Yes/No buttons and question', () => {
    render(
      <EventAttendanceValidation
        address={mockAddress}
        approvedName={mockApprovedName}
        onVerified={mockOnVerified}
      />
    );

    expect(screen.getByText(/did you attend ETHGlobal Brussels in person/i)).toBeInTheDocument();
    expect(screen.getByText('Yes, I attended')).toBeInTheDocument();
    expect(screen.getByText("No, I didn't attend")).toBeInTheDocument();
  });

  it('shows goodbye message when user clicks No', () => {
    render(
      <EventAttendanceValidation
        address={mockAddress}
        approvedName={mockApprovedName}
        onVerified={mockOnVerified}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /No, I didn't attend/i }));

    expect(screen.getByText(/Thank you for your honesty!/i)).toBeInTheDocument();
    expect(screen.getByText(/The enrollment process requires in-person attendance/i)).toBeInTheDocument();
    expect(mockOnVerified).toHaveBeenCalledWith(false);
  });

  it('shows loading animation and verifies POAP using wallet address', async () => {
    const mockPoap = mockPoapsResponse[0];
    if (!mockPoap) throw new Error('Mock POAP data is not defined');

    // Mock fetchPoaps to verify wallet address usage
    mockedFetchPoaps.mockImplementation(async (userAddress: string): Promise<POAPEvent[]> => {
      // Verify that the wallet address is used for verification
      expect(userAddress).toBe(mockAddress);
      await new Promise(resolve => setTimeout(resolve, 100));
      return [mockPoap];
    });

    render(
      <EventAttendanceValidation
        address={mockAddress}
        approvedName={mockApprovedName}
        onVerified={mockOnVerified}
      />
    );

    // Click Yes button and verify loading state
    fireEvent.click(screen.getByRole('button', { name: /Yes, I attended/i }));

    // Verify loading animation elements
    expect(screen.getByText('🎭 Verifying your attendance...')).toBeInTheDocument();
    expect(screen.getByText('🔍 Searching POAPs on Gnosis Chain')).toBeInTheDocument();
    expect(screen.getByText('🎪 Looking for ETHGlobal Brussels badges')).toBeInTheDocument();
    expect(screen.getByText('🎯 Matching your wallet address')).toBeInTheDocument();

    // Verify loading indicators are present
    expect(document.querySelector('.loading-spinner')).toBeInTheDocument();
    expect(document.querySelector('.loading-ring')).toBeInTheDocument();

    // Fast-forward through API call and drumroll effect
    await act(async () => {
      jest.advanceTimersByTime(3100); // API delay + drumroll effect
    });

    // Verify success state and POAP details
    await waitFor(() => {
      expect(screen.getByText('🎉 Event attendance verified!')).toBeInTheDocument();
      expect(screen.getByText(/ETHGlobal Brussels/)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Continue Enrollment/i })).toBeEnabled();
    });

    // Verify onVerified callback includes correct data
    expect(mockOnVerified).toHaveBeenCalledWith(true, expect.objectContaining({
      role: expect.any(String),
      date: expect.any(String),
      venue: expect.any(String),
      approvedName: mockApprovedName,
      tokenId: mockPoap.tokenId
    }));
  });

  it('shows error message when no POAP is found', async () => {
    mockedFetchPoaps.mockImplementation(async (userAddress: string): Promise<POAPEvent[]> => {
      expect(userAddress).toBe(mockAddress); // Verify wallet address is used
      await new Promise(resolve => setTimeout(resolve, 100));
      return [];
    });

    render(
      <EventAttendanceValidation
        address={mockAddress}
        approvedName={mockApprovedName}
        onVerified={mockOnVerified}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Yes, I attended/i }));

    // Fast-forward through API call and loading animation
    await act(async () => {
      jest.advanceTimersByTime(3100);
    });

    // Verify error state
    await waitFor(() => {
      expect(screen.getByText(/No ETHGlobal Brussels attendance record found/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Continue Enrollment/i })).toBeDisabled();
    });

    // Verify that onVerified was called with false
    expect(mockOnVerified).toHaveBeenCalledWith(false);
  });
});
