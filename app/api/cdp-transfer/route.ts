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

    const cdp = new CdpClient();

    const sender = await cdp.evm.getOrCreateAccount({ name: "MissionEnrollmentDonationSender" });

    const cdpNetwork = network === 'base-mainnet' ? 'base' : 'base-sepolia';

    console.log(`Initiating CDP transfer: ${amount} ETH to ${to} on ${cdpNetwork}`);
    console.log(`Sender account: ${sender.address}`);

    const transferResult = await sender.transfer({
      to: to,
      amount: parseEther(amount.toString()),
      token: "eth",
      network: cdpNetwork
    });

    const transactionHash = transferResult.transactionHash;
    
    console.log(`CDP transfer completed with hash: ${transactionHash}`);

    return NextResponse.json({
      success: true,
      transactionHash,
      senderAddress: sender.address,
      to,
      amount: parseFloat(amount),
      network: cdpNetwork,
      timestamp: new Date().toISOString(),
      status: 'completed',
      explorerUrl: cdpNetwork === 'base' 
        ? `https://basescan.org/tx/${transactionHash}`
        : `https://sepolia.basescan.org/tx/${transactionHash}`
    });

  } catch (error) {
    console.error('CDP transfer error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        error: 'Transfer failed', 
        details: errorMessage,
        stack: errorStack,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
