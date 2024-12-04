# Mission Enrollment

**An enrollment tool for a collaborative mission on the Superchain.**

<img src="https://raw.githubusercontent.com/daqhris/MissionEnrollment/master/public/logo.png" alt="Mission Enrollment Logo" width="250" height="250">

This web app allows the enrollment of its connected user for a up-coming onchain mission.
Its use requires the verification of an onchain name, a token from an in-person event, and an attestation signed by the mission coordinator on the **Base** blockchain.

This project implements a transparent process reliant on 3 steps of control and validation: identity check, event attendance, and enrollment attestation.
It is built as a web application with **Next.js** and **React**, and runs on top of smart contracts integrating blockchain protocols: **Basename (ENS)**, **Proof of Attendance Protocol (POAP)** and **Ethereum Attestation Service (EAS)**.

## Key Stages

### 1. Identity Check

- Supports name submission and real-time Basenames resolution
- Displays an avatar and a connected wallet address with OnchainKit from Coinbase
- Robust error handling for invalid inputs

### 2. Event Attendance

- Asks the user whether they attended a hackathon or not
- Fetches and verifies a Proof of Attendance Protocol (POAP) token
- Features a short delay animation before revealing results
- Sends requests to a POAP API endpoint for reliable POAP data retrieval
- Filters specific POAPs related to ETHGlobal Brussels 2024
- Displays POAP data including event name, date, role and image

### 3. Enrollment Attestation

- Utilizes Ethereum Attestation Service (EAS) for creating trustworthy onchain records
- Primarily supports attestations on the Base Sepolia network
- Includes comprehensive attestation data
- Features attestation history tracking and display
- Provides real-time network status and validation

## Technical Stack

- Frontend: React with Next.js (Node.js v20)
- Blockchain Interaction: ethers.js, wagmi, viem
- Basename/ENS Integration: user name resolution via ethers.js with two-step verification
- POAP API: Custom API route with caching, rate limiting, and a delay implementation
- Smart Contracts: Solidity with OpenZeppelin libraries (UUPS proxy pattern)
- Attestation: Ethereum Attestation Service (EAS) SDK v2.7.0 with role-based access
- OnchainKit: Integrated for identity and wallet functionalities
- Middleware: Custom implementation for POAP API request handling with rate limiting
- GraphQL Integration: Apollo Client for querying attestation data from EAS GraphQL endpoint with pagination and caching
- Recent Attestations: Paginated view of attestations with error handling and fallback UI

### Other Dev Tools

- **State Management**: React Query
- **Wallet Login**: RainbowKit
- **Styling**: Tailwind CSS, daisy UI
- **Type Checking**: TypeScript
- **Code Quality**: ESLint, Jest

## Screenshots

| [![Step 0: Initial Screen](./public/Enrollment-Step0.png)](./public/Enrollment-Step0.png) | [![Step 1: Identity Check](./public/Enrollment-Step1.PNG)](./public/Enrollment-Step1.PNG) | [![Pause 1: Loading](./public/Enrollment-Pause1.PNG)](./public/Enrollment-Pause1.PNG) | [![Step 2: Event Attendance](./public/Enrollment-Step2.PNG)](./public/Enrollment-Step2.PNG) | [![Pause 2: Loading](./public/Enrollment-Pause2.PNG)](./public/Enrollment-Pause2.PNG) | [![Step 3: Attestation](./public/Enrollment-Step3.PNG)](./public/Enrollment-Step3.PNG) |
|:---:|:---:|:---:|:---:|:---:|:---:|
| Enrollment-Step0 | Enrollment-Step1 | Enrollment-Pause1 | Enrollment-Step2 | Enrollment-Pause2 | Enrollment-Step3 |


## Getting Started

### Prerequisites

- Node.js (v20 or later)
- Yarn
- An Ethereum wallet (recommended: Coinbase Wallet)
- Environment Variables:
  - `NEXT_PUBLIC_ONCHAINKIT_API_KEY`: API key for OnchainKit integration
  - `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: Project ID for WalletConnect
  - `NEXT_PUBLIC_ALCHEMY_API_KEY`: API key for Alchemy services
  - `NEXT_PUBLIC_POAP_API_KEY`: API key for POAP data retrieval
  - `NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL`: RPC URL for Base Sepolia network
  - `NEXT_PUBLIC_EAS_CONTRACT_ADDRESS`: Address of the EAS contract
  - `NEXT_PUBLIC_DEFAULT_CHAIN`: Chain ID (default: 8453 for Base)

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

**Mission Enrollment** provides a streamlined, one-page application for a select number of talented individuals to enroll in advance of the **_Zinneke Rescue Mission_**.

1. User connects their Ethereum wallet using the prioritized scaffold-eth connector and verifies their identity with Basename or ENS name verification.
2. The application fetches and displays relevant POAPs, specifically ETHGlobal Brussels 2024, extracting role information dynamically.
3. The EventAttendanceVerification component verifies event attendance and role through POAPs before proceeding to attestation.
4. User creates an attestation on the Base Sepolia network using EAS, with blockchain network switching if needed.

## API Routes

- `/api/fetchPoaps`: Fetches POAPs for a given Ethereum address, Basename or ENS name.

## Smart Contracts

`POAPVerification.sol`: Integrates with the POAP protocol for verifying real-life event attendance.

`AttestationService.sol`: This contract implements an onchain attestation using the Ethereum Attestation Service (EAS). Integration with EAS is handled through the official EAS SDK v2.7.0.

## Smart Contract Functions

1. `createMissionEnrollmentSchema()`: Creates the schema for enrollment attestations with 10 fields
2. `createMissionEnrollmentAttestation()`: Creates an attestation for a user with their bits of information
3. `verifyAttestation(bytes32 attestationId)`: Verifies the validity of an attestation

## EAS Architecture and Schema

The attestation system leverages the Ethereum Attestation Service (EAS) infrastructure with the following components:

### Schema Details
- **Schema Structure**: `address userAddress,string verifiedName,string proofMethod,string eventName,string eventType,string assignedRole,string missionName,uint256 timestamp,address attester,string proofProtocol`
- **Schema UID**: 0xa580685123e4b999c5f1cdd30ade707da884eb258416428f2cbda0b0609f64cd
- **View on EAS Explorer**: [Base Sepolia Schema](https://base-sepolia.easscan.org/schema/view/0xa580685123e4b999c5f1cdd30ade707da884eb258416428f2cbda0b0609f64cd)
- **Fields**:
  - `userAddress`: Ethereum address of the enrolled user
  - `verifiedName`: User's verified Basename or ENS name
  - `proofMethod`: Method used for verification (e.g., "POAP")
  - `eventName`: Name of the verified event (e.g., "ETHGlobal Brussels 2024")
  - `eventType`: Type of event attended (e.g., "Hackathon")
  - `assignedRole`: Role assigned at the event (dynamically extracted from POAP)
  - `missionName`: Name of the mission being enrolled for
  - `timestamp`: Unix timestamp of attestation creation
  - `attester`: Address of the attestation creator
  - `proofProtocol`: Protocol used for proof (e.g., "POAP")

### Contract Architecture
- **Proxy Pattern**: UUPS (Universal Upgradeable Proxy Standard)
  - Allows contract upgrades while preserving state and address
  - Implements access control for upgrade operations
- **Integration**:
  - Uses EAS SDK v2.7.0 for attestation operations
  - Connects to Base's EAS contract at 0x4200000000000000000000000000000000000021
  - Implements role-based access control for attestation creation

### Onchain Attestation Resources
- [EAS Documentation](https://docs.attest.sh/)
- [EAS SDK Reference](https://github.com/ethereum-attestation-service/eas-sdk)
- [Base Network EAS Guide](https://docs.base.org/guides/attestation-service)
- [Base Sepolia Explorer](https://sepolia.basescan.org/)
- [EAS Contract on Base Sepolia](https://sepolia.basescan.org/address/0x4200000000000000000000000000000000000021)
  
## Frontend Components

- `IdentityVerification.tsx`: This component handles user identity verification by validating Basenames. It ensures that users are properly authenticated before proceeding with event attendance.
- `EventAttendanceVerification.tsx`: This component verifies user attendance at events using POAPs, implementing a short delay animation and comprehensive error handling. It dynamically extracts role information from POAP data for attestation purposes.
- `EnrollmentAttestation.tsx`: This component manages the creation of onchain attestations on the Base Sepolia network. It handles automatic network switching, integrates with the user's wallet using wagmi hooks, and encodes user data including address, verified name, POAP verification status, and timestamp for attestation.
- `ContractUI.tsx`: This component provides the interface for attestation contract interactions, including network status, attestation creation, and history tracking.
- `RecentAttestationsView.tsx`: Implements paginated view of attestations fetched via GraphQL from the EAS endpoint, featuring error boundaries and fallback UI for a smooth user experience.
- `ClientApolloProvider.tsx`: Manages Apollo Client configuration for GraphQL integration, implementing caching policies and error handling for reliable data fetching.

## ETHGlobal Brussels 2024

This web app includes a special feature that is dependent on in-person participation at ETHGlobal Brussels 2024.
Users are invited to verify ownership of an ETHGlobal-certified POAP, adding an extra layer of credibility to their enrollment attestations.
The mission coordinator has participated in the global hackathon when it was held for the first time in Belgium.

### Affiliated Wallet Addresses
- __daqhris.base.eth__: 0xb5ee030c71e76c3e03b2a8d425dbb9b395037c82
- __mission-enrollment.base.eth__: 0xF0bC5CC2B4866dAAeCb069430c60b24520077037

_**Note**: Contract addresses are maintained and updated regularly as the app is still under construction._

## External Resources

- [Ethereum Attestation Service Documentation](https://docs.attest.sh/)
- [Basename Documentation](https://onchainkit.xyz/identity/name)
- [POAP Documentation](https://documentation.poap.tech/)

## Disclaimer

This project builds upon components from [Scaffold-ETH 2](https://github.com/scaffold-eth/scaffold-eth-2) and leverages open-source protocols for blockchain functionality.
If necessary, users should verify the authenticity of mission enrollments through additional public means.

The creation of this dApp was initiated by **daqhris** during a virtual hackathon: [ETHGlobal Superhack 2024](https://ethglobal.com/events/superhack2024).
It is built thanks to the help and collaboration of **Devin**, the world's first AI software engineer from [Cognition.AI](https://www.cognition.ai/).

**Hackathon Submission**: [ethglobal.com/showcase/missionenrollment-i4fkr](https://ethglobal.com/showcase/missionenrollment-i4fkr)

**Short Demo Video** _(November 17)_: [mission-enrollment.daqhris.com/Preview-MissionEnrollment-WebApp](https://mission-enrollment.daqhris.com/Preview-MissionEnrollment-WebApp.mp4)
