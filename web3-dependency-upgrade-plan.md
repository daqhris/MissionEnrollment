# Web3 Dependency Upgrade Plan

## Current Analysis
Based on `npm outdated` output, several web3/blockchain dependencies need updating:

### Priority Updates (Minor Versions)
- @coinbase/onchainkit: 0.35.8 -> 0.38.5
- @ensdomains/ensjs: 3.7.0 -> 4.0.2
- @rainbow-me/rainbowkit: 2.2.1 -> 2.2.4
- viem: 2.21.55 -> 2.25.0
- wagmi: 2.14.3 -> 2.14.16
- @wagmi/core: 2.16.0 -> 2.16.7
- ethers: 6.13.4 -> 6.13.5
- alchemy-sdk: 3.5.0 -> 3.5.6

### Major Version Updates (Requires Careful Testing)
- @openzeppelin/contracts: 4.9.6 -> 5.2.0
- @openzeppelin/contracts-upgradeable: 4.9.6 -> 5.2.0
- @mui/material: 5.16.11 -> 7.0.1
- @mui/icons-material: 6.2.0 -> 7.0.1
- tailwindcss: 3.4.16 -> 4.1.3
- daisyui: 4.12.20 -> 5.0.12
- react: 18.3.1 -> 19.1.0
- react-dom: 18.3.1 -> 19.1.0

## Implementation Strategy
1. Update minor version dependencies first
2. Test functionality after each update
3. Evaluate major version updates separately
4. Document breaking changes and required code modifications

