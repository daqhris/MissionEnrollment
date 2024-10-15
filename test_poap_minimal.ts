import { createPublicClient, http } from 'viem'
import { gnosis } from 'viem/chains'
import { poapABI } from './poapABI' // We'll create this file next

const POAP_CONTRACT_ADDRESS = '0x22C1f6050E56d2876009903609a2cC3fEf83B415'
const WALLET_ADDRESS = '0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82'
const POAP_ID = '7169394'

const publicClient = createPublicClient({
  chain: gnosis,
  transport: http()
})

async function verifyPOAPOwnership() {
  try {
    const balance = await publicClient.readContract({
      address: POAP_CONTRACT_ADDRESS,
      abi: poapABI,
      functionName: 'balanceOf',
      args: [WALLET_ADDRESS]
    })

    console.log(`POAP balance: ${balance}`)

    for (let i = 0; i < Number(balance); i++) {
      const tokenId = await publicClient.readContract({
        address: POAP_CONTRACT_ADDRESS,
        abi: poapABI,
        functionName: 'tokenOfOwnerByIndex',
        args: [WALLET_ADDRESS, BigInt(i)]
      })

      console.log(`Token ID: ${tokenId}`)

      if (tokenId.toString() === POAP_ID) {
        console.log(`POAP with ID ${POAP_ID} found for wallet ${WALLET_ADDRESS}`)
        return true
      }
    }

    console.log(`POAP with ID ${POAP_ID} not found for wallet ${WALLET_ADDRESS}`)
    return false
  } catch (error) {
    console.error('Error verifying POAP ownership:', error)
    return false
  }
}

verifyPOAPOwnership().then((result) => {
  console.log(`POAP verification result: ${result}`)
}).catch(console.error)
