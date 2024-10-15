import { createPublicClient, http, PublicClient } from 'viem'
import { gnosis } from 'viem/chains'
import { poapABI } from '../../poapABI'
import type { NextApiRequest, NextApiResponse } from 'next'

const POAP_CONTRACT_ADDRESS = '0x22C1f6050E56d2876009903609a2cC3fEf83B415'
const WALLET_ADDRESS = '0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82'
const POAP_ID = '7169394'

const publicClient: PublicClient = createPublicClient({
  chain: gnosis,
  transport: http()
})

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  try {
    console.log('Starting POAP verification...')
    const balance = await publicClient.readContract({
      address: POAP_CONTRACT_ADDRESS,
      abi: poapABI,
      functionName: 'balanceOf',
      args: [WALLET_ADDRESS]
    }) as bigint

    console.log(`POAP balance for ${WALLET_ADDRESS}: ${balance}`)

    let poapFound = false

    for (let i = 0; i < Number(balance); i++) {
      const tokenId = await publicClient.readContract({
        address: POAP_CONTRACT_ADDRESS,
        abi: poapABI,
        functionName: 'tokenOfOwnerByIndex',
        args: [WALLET_ADDRESS, BigInt(i)]
      }) as bigint

      console.log(`Token ID: ${tokenId}`)

      if (tokenId.toString() === POAP_ID) {
        poapFound = true
        console.log(`POAP with ID ${POAP_ID} found for wallet ${WALLET_ADDRESS}`)
        break
      }
    }

    if (!poapFound) {
      console.log(`POAP with ID ${POAP_ID} not found for wallet ${WALLET_ADDRESS}`)
    }

    console.log('POAP verification completed.')

    res.status(200).json({
      success: true,
      poapFound,
      message: poapFound ? `POAP with ID ${POAP_ID} found for wallet ${WALLET_ADDRESS}` : `POAP with ID ${POAP_ID} not found for wallet ${WALLET_ADDRESS}`
    })
  } catch (error) {
    console.error('Error verifying POAP ownership:', error)
    res.status(500).json({ success: false, error: 'Error verifying POAP ownership' })
  }
}
