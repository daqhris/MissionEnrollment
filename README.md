# Mission Enrollment

**An enrollment tool for a collaborative mission on the Superchain.**

[![Mission Enrollment Logo](./public/logo.png)](https://mission-enrollment.vercel.app/)

This web app has 3 main features that certify the enrollment of its connected user for an future mission.
Its use requires the verification of an onchain name, a token from an in-person event, and an attestation signed by the mission coordinator on the **Base** blockchain.

This project provides a transparent process reliant on 3 steps of control and validation: identity check, event attendance, and enrollment attestation.
It is built as a web application with **Next.js** and **React**, and runs on top of smart contracts integrating blockchain protocols: **Basename (ENS)**, **Proof of Attendance Protocol (POAP)** and **Ethereum Attestation Service (EAS)**.

## Key Stages

### 1. Identity Check

- Supports real-time Basename resolution
- Robust error handling for invalid inputs

### 2. Event Attendace

- Fetches and verifies Proof of Attendance Protocol (POAP) tokens
- Filters specific POAPs related to ETHGlobal Brussels 2024
- Displays POAP data including event name, date, role and image

### 3. Enrollment Attestation

- Utilizes Ethereum Attestation Service (EAS) for creating verifiable onchain records
- Supports attestations on Base Sepolia or Optimism Sepolia L2 rollups
- Includes onchain name and other in-person event info in the attestation data

### 4. Smart Contract

- Implements role-based access control for attestation creation
- Provides functions for schema creation, attestation, and verification

### 5. UI/UX Improvements

- Responsive design with clear user feedback
- Loading indicators and error messages for better user experience
- Step-by-step guided process from identity verification to enrollment attestation

## Technical Stack

- Frontend: React with Next.js
- Blockchain Interaction: ethers.js (v6), wagmi
- ENS Integration: ENS resolution via ethers.js
- POAP API: Custom API route with caching and rate limiting
- Smart Contracts: Solidity with OpenZeppelin libraries
- Attestation: Ethereum Attestation Service (EAS) SDK
- OnchainKit: Integrated for identity and wallet functionalities

### Other Dev Tools

- **State Management**: React Query (with singleton QueryClient instance)
- **Wallet Login**: Wagmi, prioritized Scaffold-ETH connector
- **Styling**: Tailwind CSS, daisy UI
- **Type Checking**: TypeScript
- **Code Quality**: ESLint, comprehensive test suite with Jest

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- Yarn
- An Ethereum wallet 
- Environment Variables:
  - `NEXT_PUBLIC_ONCHAINKIT_API_KEY`: API key for OnchainKit integration
  - `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: Project ID for WalletConnect
  - `NEXT_PUBLIC_ALCHEMY_API_KEY`: API key for Alchemy services
  - `MAINNET_RPC_URL`: RPC URL for Ethereum mainnet
  - `BASE_SEPOLIA_RPC_URL`: RPC URL for Base Sepolia network
- Note: Ensure that sensitive information such as private keys are securely managed and not included in public repositories. Use secure secrets management for deployment credentials.

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/daqhris/MissionEnrollment.git
   cd MissionEnrollment
   ```

2. Install dependencies:

   ```
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the necessary environment variables (refer to `.env.example` for required variables).

### Running the Application

1. Start the development server:

   ```
   yarn dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

**Mission Enrollment** provides a streamlined, one-page application for people to enroll in advance of the _Zinneke Rescue Mission_.

1. User connects their Ethereum wallet using the prioritized scaffold-eth connector and verifies their identity with .base.eth name verification.
2. The application fetches and displays relevant POAPs, specifically ETHGlobal Brussels 2024.
3. The EventAttendanceVerification component verifies event attendance through POAPs before proceeding to attestation.
4. User selects the desired L2 network (Base Sepolia or Optimism Sepolia) for attestation creation using EAS.

## API Routes

- `/api/fetchPoaps`: Fetches POAPs for a given Ethereum address or ENS name

## Smart Contracts

`POAPVerification.sol`: Integrates with the POAP protocol for verifying real-life event attendance.

`AttestationService.sol`: This contract implements onchain attestation using the Ethereum Attestation Service (EAS). It features role-based access control, with specific roles for attestation creators and administrators. The contract uses a custom schema for mission enrollment attestations, which includes the user's address, token ID, timestamp, and attester's address. Recent updates include hardhat configuration changes and ethers v6 integration.

## Smart Contract Functions

1. `createMissionEnrollmentSchema()`: Creates the schema for mission enrollment attestations
2. `createMissionEnrollmentAttestation(address recipient, uint256 tokenId)`: Creates an attestation for a user
3. `verifyAttestation(bytes32 attestationId)`: Verifies the validity of an attestation

## Frontend Components

- `IdentityVerification.tsx`: This component handles user identity verification by validating Ethereum addresses. It ensures that users are properly authenticated before proceeding with attestations.
- `OnchainAttestation.tsx`: This component manages the creation of onchain attestations, supporting both Base and Optimism L2 rollups. It integrates with the user's wallet using wagmi hooks and encodes POAP data for attestation.
- `EventAttendanceVerification.tsx`: This component verifies user attendance at events using POAPs, integrating with the POAP API to fetch and validate event participation.

## Testing

The project includes a comprehensive test suite using Jest, focusing on POAP verification and event attendance logic. Tests ensure robust handling of API interactions and user data validation. To run the tests, use the command `yarn test`. The test suite includes mock data located in the `test/mocks` directory for simulating API responses and covers various edge cases to ensure reliability. Test coverage reports are generated using Jest's built-in coverage tool to help identify untested areas of the codebase. Configuration for tests can be found in the `jest.config.js` file, which includes settings for handling TypeScript and React components.

## ETHGlobal Brussels 2024

This onchain app includes a special feature that is dependent on ETHGlobal Brussels 2024.
Users are invited to retrieve their ETHGlobal Brussels 2024 POAP, adding an extra layer of credibility to their enrollment attestations.
The app builder and mission coordinator participated in this global hackathon when it was held for the first time in Belgium.

## Deployed Contracts

The AttestationService contract has been deployed on the following networks:

### Base Sepolia
- Proxy Address: 0x9f040BD10a6D6e70772ea3Ab055FFfc8E5Af6deF
- Implementation Address: 0x23E6C11A0cd7322498c0eC85cfCCaeeD3F3E7843

### Optimism Sepolia
- Proxy Address: 0x2909d5554944ba93d75F418429249C6105CbeBff
- Implementation Address: 0x23E6C11A0cd7322498c0eC85cfCCaeeD3F3E7843

Both deployments use the following addresses:
- EAS Contract Address: 0xC2679fBD37d54388Ce493F1DB75320D236e1815e
- Schema Registry Address: 0x54f0e66D5A04702F5Df9BAe330295a11bD862c81

## External Resources

- [Ethereum Attestation Service Documentation](https://docs.attest.sh/)
- [Basename Documentation](https://onchainkit.xyz/identity/name)
- [POAP Documentation](https://documentation.poap.tech/)


## Disclaimer

If necessary, users should verify the authenticity of mission enrollments through additional public means.
This project builds upon components from [Scaffold-ETH 2](https://github.com/scaffold-eth/scaffold-eth-2) and integrates open-source protocols for blockchain functionality.

The creation of the dApp was initiated by **daqhris.eth** during a virtual hackathon: [ETHGlobal Superhack 2024](https://ethglobal.com/events/superhack2024).  
This became possible thanks to the help and collaboration of **Devin**, the world's first AI software engineer, created by [Cognition.AI](https://www.cognition.ai/).

[ethglobal.com/showcase/missionenrollment-i4fkr](https://ethglobal.com/showcase/missionenrollment-i4fkr)
