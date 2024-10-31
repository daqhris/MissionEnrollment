import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EventAttendanceVerification from '../components/EventAttendanceVerification';
import { mockPoapsResponse, mockValidWalletAddresses, mockEventInfo } from './mocks/poapData';
import { fetchPoaps } from '../utils/fetchPoapsUtil';

// Mock fetchPoaps function
jest.mock('../utils/fetchPoapsUtil');
const mockedFetchPoaps = fetchPoaps as jest.MockedFunction<typeof fetchPoaps>;

// Mock setTimeout to control loading animation timing
jest.useFakeTimers();

describe('EventAttendanceVerification Component', () => {
  const mockAddress = mockValidWalletAddresses[0];
  const mockVerifiedName = mockEventInfo.verifiedName;
  const mockOnVerified = jest.fn();

  if (!mockAddress) throw new Error('Mock address is undefined');

  beforeEach(() => {
    jest.clearAllMocks();
    mockedFetchPoaps.mockResolvedValue(mockPoapsResponse);
  });

  it('displays initial Yes/No buttons and question', () => {
    render(
      <EventAttendanceVerification
        address={mockAddress}
        verifiedName={mockVerifiedName}
        onVerified={mockOnVerified}
      />
    );

    expect(screen.getByText(/did you attend ETHGlobal Brussels in person/i)).toBeInTheDocument();
    expect(screen.getByText('Yes, I attended')).toBeInTheDocument();
    expect(screen.getByText("No, I didn't attend")).toBeInTheDocument();
  });

  it('shows goodbye message when user clicks No', () => {
    render(
      <EventAttendanceVerification
        address={mockAddress}
        verifiedName={mockVerifiedName}
        onVerified={mockOnVerified}
      />
    );

    fireEvent.click(screen.getByText("No, I didn't attend"));

    expect(screen.getByText('Thank you for your honesty!')).toBeInTheDocument();
    expect(screen.getByText(/The enrollment process requires in-person attendance/i)).toBeInTheDocument();
    expect(mockOnVerified).toHaveBeenCalledWith(false);
  });

  it('shows loading animation and verifies POAP when user clicks Yes', async () => {
    render(
      <EventAttendanceVerification
        address={mockAddress}
        verifiedName={mockVerifiedName}
        onVerified={mockOnVerified}
      />
    );

    // Click Yes button
    fireEvent.click(screen.getByRole('button', { name: /Yes, I attended/i }));

    // Check initial loading state
    expect(screen.getByText('🎭 Verifying your attendance...')).toBeInTheDocument();
    expect(screen.getByText('🔍 Searching POAPs on Gnosis Chain')).toBeInTheDocument();

    // Fast-forward through loading animation (3 seconds)
    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    // Wait for verification to complete and results to display
    await waitFor(() => {
      expect(screen.getByText('🎉 Event attendance verified!')).toBeInTheDocument();
    });

    // Verify POAP details are displayed
    expect(screen.getByText(/ETHGlobal Brussels/)).toBeInTheDocument();
    expect(screen.getByText(/Role:/)).toBeInTheDocument();
    expect(screen.getByText(/Date:/)).toBeInTheDocument();
    expect(screen.getByText(/Venue:/)).toBeInTheDocument();
    expect(screen.getByText(/Token ID:/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Continue Enrollment/i })).toBeEnabled();
  });

  it('shows error message when no POAP is found', async () => {
    mockedFetchPoaps.mockResolvedValueOnce([]);

    render(
      <EventAttendanceVerification
        address={mockAddress}
        verifiedName={mockVerifiedName}
        onVerified={mockOnVerified}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /Yes, I attended/i }));

    await act(async () => {
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() => {
      expect(screen.getByText(/No ETHGlobal Brussels attendance record found/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /Continue Enrollment/i })).toBeDisabled();
  });
});
