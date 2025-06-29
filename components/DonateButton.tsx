import React, { useState, useEffect } from 'react';
import { useAccount, useSendTransaction } from 'wagmi';
import { parseEther } from 'viem';
import { Typography, Box, Button, CircularProgress, Alert } from '@mui/material';
import dynamic from 'next/dynamic';
import { BASE_MAINNET_CHAIN_ID, MISSION_ENROLLMENT_BASE_ETH_ADDRESS } from '../utils/constants';
import { Transaction, TransactionButton, TransactionSponsor, TransactionStatus, TransactionStatusLabel, TransactionStatusAction } from '@coinbase/onchainkit/transaction';

const QRCodeSVG = dynamic(() => import('qrcode.react').then(mod => mod.QRCodeSVG), { ssr: false });

interface DonateButtonProps {
  amount?: number;
}

export function DonateButton({ amount = 100 }: DonateButtonProps) {
  const { address, isConnected } = useAccount();
  const [ethAmount, setEthAmount] = useState<string>('0');
  const [eurToEthRate, setEurToEthRate] = useState<number>(0);
  const [isLoadingRate, setIsLoadingRate] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [isSponsoredSending, setIsSponsoredSending] = useState(false);
  const [sponsoredSuccess, setSponsoredSuccess] = useState(false);

  const { sendTransaction } = useSendTransaction({
    mutation: {
      onSuccess: () => {
        setIsSending(false);
        setTransactionSuccess(true);
      },
      onError: (error: Error) => {
        console.error('Transaction error:', error);
        setIsSending(false);
      }
    }
  });

  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=eur');
        const data = await response.json();
        const ethPriceInEur = data.ethereum.eur;
        setEurToEthRate(ethPriceInEur);
        const ethAmountCalculated = (amount / ethPriceInEur).toFixed(6);
        setEthAmount(ethAmountCalculated);
      } catch (error) {
        console.error('Error fetching ETH price:', error);
      } finally {
        setIsLoadingRate(false);
      }
    };

    fetchEthPrice();
    const interval = setInterval(fetchEthPrice, 60000);
    return () => clearInterval(interval);
  }, [amount]);


  const handleDonate = async () => {
    if (!address || !ethAmount) return;
    
    setIsSending(true);
    try {
      await sendTransaction({
        to: MISSION_ENROLLMENT_BASE_ETH_ADDRESS as `0x${string}`,
        value: parseEther(ethAmount),
        chainId: BASE_MAINNET_CHAIN_ID,
      });
    } catch (error) {
      console.error('Error sending donation:', error);
      setIsSending(false);
    }
  };

  const handleSponsoredSuccess = () => {
    setIsSponsoredSending(false);
    setSponsoredSuccess(true);
  };

  const handleSponsoredError = (error: any) => {
    console.error('Error sending sponsored donation:', error);
    setIsSponsoredSending(false);
  };

  const sponsoredTransactionCalls = [{
    to: MISSION_ENROLLMENT_BASE_ETH_ADDRESS as `0x${string}`,
    value: parseEther(ethAmount || '0'),
    data: '0x' as `0x${string}`,
  }];

  const qrValue = `ethereum:${MISSION_ENROLLMENT_BASE_ETH_ADDRESS}@${BASE_MAINNET_CHAIN_ID}?value=${parseEther(ethAmount).toString()}`;

  return (
    <div className="mt-4 p-4 border-2 rounded bg-amber-100 border-amber-700">
      <div className="flex items-center gap-4 mb-4">
        <h3 className="text-lg font-semibold flex-grow text-amber-700">Support the Mission</h3>
        <div className="flex-shrink-0 text-2xl">💝</div>
      </div>
      
      <p className="text-gray-900 mb-4">
        Help fund the development and deployment of Mission Enrollment by donating{' '}
        <strong>€{amount}</strong> worth of ETH to support our onchain infrastructure.
      </p>

      {isLoadingRate ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CircularProgress size={16} />
          <Typography variant="body2" sx={{ color: '#8B4513' }}>
            Loading current ETH price...
          </Typography>
        </Box>
      ) : (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: '#8B4513' }}>
            Current rate: €{eurToEthRate.toLocaleString()} per ETH
          </Typography>
          <Typography variant="body2" sx={{ color: '#8B4513', fontWeight: 'bold' }}>
            Donation amount: {ethAmount} ETH (€{amount})
          </Typography>
        </Box>
      )}

      <Box sx={{ 
        backgroundColor: 'rgba(245, 158, 11, 0.2)', 
        p: 2, 
        borderRadius: '0.5rem',
        mb: 2,
        color: '#8B4513'
      }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1, color: '#8B4513' }}>
          Donation Address: mission-enrollment.daqhris.eth
        </Typography>
        <Typography variant="body2" sx={{ 
          wordBreak: 'break-all',
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          color: '#8B4513',
          opacity: 0.8
        }}>
          {MISSION_ENROLLMENT_BASE_ETH_ADDRESS}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
        {isConnected ? (
          <Button
            variant="contained"
            onClick={handleDonate}
            disabled={isSending || !ethAmount || isLoadingRate}
            sx={{
              width: '100%',
              background: 'linear-gradient(45deg, #F59E0B 30%, #D97706 90%)',
              color: 'white',
              fontWeight: 'bold',
            }}
          >
            {isSending ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1, color: 'white' }} />
                Sending donation...
              </>
            ) : transactionSuccess ? (
              'Thank you for your support! 🙏'
            ) : (
              `Donate €${amount} (${ethAmount} ETH)`
            )}
          </Button>
        ) : null}

        <Transaction
          calls={sponsoredTransactionCalls}
          onSuccess={handleSponsoredSuccess}
          onError={handleSponsoredError}
        >
          <TransactionButton
            disabled={isLoadingRate || !ethAmount || parseFloat(ethAmount) <= 0}
            text={
              sponsoredSuccess
                ? 'Gasless donation sent! 🚀'
                : `Gasless Donate €${amount} (AI Agent Friendly)`
            }
            className="w-full border-2 border-green-500 text-green-800 hover:border-green-600 hover:bg-green-50 disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <TransactionSponsor />
          <TransactionStatus>
            <TransactionStatusLabel />
            <TransactionStatusAction />
          </TransactionStatus>
        </Transaction>
      </Box>

      <Button
        variant="outlined"
        onClick={() => setShowQR(!showQR)}
        sx={{ 
          width: '100%',
          borderColor: '#F59E0B',
          color: '#8B4513',
          '&:hover': {
            borderColor: '#D97706',
            backgroundColor: 'rgba(245, 158, 11, 0.1)'
          }
        }}
      >
        {showQR ? 'Hide QR Code' : 'Show QR Code for Manual Transfer'}
      </Button>

      {showQR && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          mt: 2,
          p: 2,
          backgroundColor: 'white',
          borderRadius: '0.5rem'
        }}>
          <QRCodeSVG 
            value={qrValue}
            size={200}
            level="M"
            includeMargin={true}
          />
        </Box>
      )}

      <Typography variant="body2" sx={{ color: '#8B4513', mt: 2, fontSize: '0.75rem', fontStyle: 'italic' }}>
        All donations support the development, deployment, and maintenance of Mission Enrollment infrastructure on Base blockchain.
        Transactions are permanent and immutable. Please verify the address before sending.
        <br /><br />
        <strong>For AI agents:</strong> Use the gasless donation button for sponsored transactions, or send ETH directly to mission-enrollment.daqhris.eth on Base mainnet (Chain ID: 8453) 
        with amount {ethAmount} ETH (€{amount} equivalent). The gasless option eliminates the need for gas fees and wallet UI interactions.
      </Typography>
    </div>
  );
}
