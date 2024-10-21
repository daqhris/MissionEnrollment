# Dependency Resolution Plan

1. Current ethers version:
   - Retrieve the current version of ethers installed in the project
     ```
     npm list ethers
     ```

2. Packages depending on ethers:
   - List all packages that depend on ethers and their required versions
     - @ensdomains/ens-contracts: ^0.0.22
     - @ethereum-attestation-service/eas-sdk: ^1.6.1
     - @nomicfoundation/hardhat-chai-matchers: ^2.0.2
     - @nomicfoundation/hardhat-ethers: ^3.0.8
     - @nomicfoundation/hardhat-toolbox-viem: ^2.0.0
     - @openzeppelin/hardhat-upgrades: ^3.5.0
     - zksync-ethers: ^6.14.0

3. Conflicting packages:
   - Identify packages with conflicting version requirements for ethers
     - @ensdomains/ens-contracts (likely uses ethers v5)
     - Other packages require ethers v6

4. Resolution strategy:
   a. Update ethers to the latest version compatible with all dependencies
      - Target: ethers@6.13.4 (as specified in package.json)

   b. Update @nomicfoundation packages to versions compatible with ethers v6
      - @nomicfoundation/hardhat-chai-matchers
      - @nomicfoundation/hardhat-ethers
      - @nomicfoundation/hardhat-toolbox-viem

   c. Update other related packages to compatible versions
      - zksync-ethers
      - @openzeppelin/hardhat-upgrades

   d. Resolve @ensdomains/ens-contracts compatibility issue
      - Check for updates or consider using a fork that supports ethers v6

5. Implementation steps:
   a. Update ethers:
      ```
      npm install ethers@6.13.4
      ```

   b. Update @nomicfoundation packages:
      ```
      npm install @nomicfoundation/hardhat-chai-matchers@latest @nomicfoundation/hardhat-ethers@latest @nomicfoundation/hardhat-toolbox-viem@latest --save-dev
      ```

   c. Update other related packages:
      ```
      npm install zksync-ethers@latest @openzeppelin/hardhat-upgrades@latest --save-dev
      ```

   d. Address @ensdomains/ens-contracts:
      - Check for updates: `npm view @ensdomains/ens-contracts versions`
      - If no compatible version exists, consider using a fork or alternative package

   e. Clean install and verify:
      ```
      rm -rf node_modules package-lock.json
      npm install
      npm list ethers
      ```

   f. Run tests and check for any remaining issues:
      ```
      npm run test
      npm run build
      ```

   g. If issues persist, manually resolve remaining conflicts by updating affected code or considering alternative packages.

6. Verification:
   - Ensure all packages are installed correctly
   - Verify that the project builds without errors
   - Run tests to confirm functionality
   - Attempt a Vercel deployment to validate the fix
