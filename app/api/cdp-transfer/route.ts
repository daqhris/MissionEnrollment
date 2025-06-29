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

    const cdp = new CdpClient();

    const sender = await cdp.evm.getOrCreateAccount({ name: "DonationSender" });

    const cdpNetwork = network === 'base-mainnet' ? 'base' : 'base-sepolia';

    const { transactionHash } = await sender.transfer({
      to: to,
      amount: parseEther(amount.toString()),
      token: "eth",
      network: cdpNetwork
    });

    return NextResponse.json({
      success: true,
      transactionHash,
      to,
      amount: parseFloat(amount),
      network: cdpNetwork,
      timestamp: new Date().toISOString(),
      status: 'completed'
    });

  } catch (error) {
    console.error('CDP transfer error:', error);
    return NextResponse.json(
      { error: 'Transfer failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
