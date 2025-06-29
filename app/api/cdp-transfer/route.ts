import { NextRequest, NextResponse } from 'next/server';
import { CdpClient } from '@coinbase/cdp-sdk';
import { parseEther } from 'viem';

export async function POST(request: NextRequest) {
  try {
    const { to, amount, network } = await request.json();

    if (!to || !amount || !network) {
      return NextResponse.json(
        { error: 'Missing required parameters: to, amount, network' },
        { status: 400 }
      );
    }

    console.log('Environment variables check:', {
      CDP_API_KEY_ID: process.env.CDP_API_KEY_ID ? `${process.env.CDP_API_KEY_ID.substring(0, 8)}...` : 'MISSING',
      CDP_API_KEY_SECRET: process.env.CDP_API_KEY_SECRET ? 'SET' : 'MISSING',
      CDP_WALLET_SECRET: process.env.CDP_WALLET_SECRET ? 'SET' : 'MISSING'
    });

    if (!process.env.CDP_API_KEY_ID || !process.env.CDP_API_KEY_SECRET || !process.env.CDP_WALLET_SECRET) {
      console.error('Missing CDP SDK environment variables:', {
        CDP_API_KEY_ID: !!process.env.CDP_API_KEY_ID,
        CDP_API_KEY_SECRET: !!process.env.CDP_API_KEY_SECRET,
        CDP_WALLET_SECRET: !!process.env.CDP_WALLET_SECRET
      });
      return NextResponse.json(
        { error: 'CDP SDK not properly configured. Missing required environment variables.' },
        { status: 500 }
      );
    }

    console.log('Initializing CDP client...');
    const cdp = new CdpClient({
      apiKeyId: process.env.CDP_API_KEY_ID!,
      apiKeySecret: process.env.CDP_API_KEY_SECRET!,
      walletSecret: process.env.CDP_WALLET_SECRET!
    });
    console.log('CDP client initialized successfully');

    const cdpNetwork = network === 'base-mainnet' ? 'base-sepolia' : 'base-sepolia';
    console.log(`Using network: ${cdpNetwork} (requested: ${network})`);

    console.log('Creating/getting account with name: MissionEnrollmentDonationSender');
    const sender = await cdp.evm.getOrCreateAccount({ name: "MissionEnrollmentDonationSender" });
    console.log('Account created/retrieved:', { address: sender.address, name: sender.name });

    console.log(`Initiating CDP transfer: ${amount} ETH to ${to} on ${cdpNetwork}`);
    console.log(`Sender account: ${sender.address}`);

    const transferResult = await sender.transfer({
      amount: parseEther(amount),
      token: 'eth',
      to: to,
      network: cdpNetwork
    });

    console.log('Transfer initiated, waiting for completion...');
    const transactionHash = transferResult.transactionHash;
    const transferStatus = 'complete';
    
    console.log(`CDP transfer completed with hash: ${transactionHash}, status: ${transferStatus}`);

    if (transferStatus === 'complete') {
      return NextResponse.json({
        success: true,
        transactionHash,
        senderAddress: sender.address,
        to,
        amount: parseFloat(amount),
        network: cdpNetwork,
        timestamp: new Date().toISOString(),
        status: transferStatus,
        explorerUrl: cdpNetwork === 'base-sepolia' 
          ? `https://sepolia.basescan.org/tx/${transactionHash}`
          : `https://basescan.org/tx/${transactionHash}`
      });
    } else {
      throw new Error(`Transfer failed with status: ${transferStatus}`);
    }

  } catch (error) {
    console.error('CDP transfer error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      errorType: error instanceof Error ? error.constructor.name : 'Unknown',
      timestamp: new Date().toISOString()
    });
    
    let userFriendlyMessage = 'Transfer failed';
    if (error instanceof Error) {
      if (error.message.includes('insufficient')) {
        userFriendlyMessage = 'Insufficient funds in donation account';
      } else if (error.message.includes('network')) {
        userFriendlyMessage = 'Network configuration error';
      } else if (error.message.includes('auth')) {
        userFriendlyMessage = 'Authentication error with CDP SDK';
      }
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        error: userFriendlyMessage, 
        details: errorMessage,
        stack: errorStack,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
