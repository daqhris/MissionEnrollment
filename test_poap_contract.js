console.log('Testing POAP contract interaction...');
const { gnosisClient, POAP_CONTRACT_ADDRESS, POAP_ABI, safePoapContractCall } = require('./config.js');
const { Address } = require('viem');

async function testPoapContract() {
  // Test Gnosis chain connection
  try {
    const blockNumber = await gnosisClient.getBlockNumber();
    console.log('Successfully connected to Gnosis chain. Current block number:', blockNumber);
  } catch (error) {
    console.error('Failed to connect to Gnosis chain:', error);
    return;
  }

  // Test wallet address
  const testAddress = '0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82';

  // Test POAP balance
  try {
    const balance = await safePoapContractCall('balanceOf', [testAddress]);
    console.log('POAP balance for', testAddress, ':', balance?.toString() || 'Failed to fetch balance');
  } catch (error) {
    console.error('Error fetching POAP balance:', error);
  }

  // Test specific POAP ownership
  const specificPoapId = 7169394n;
  try {
    const owner = await safePoapContractCall('ownerOf', [specificPoapId]);
    console.log('Owner of POAP ID', specificPoapId, ':', owner || 'Failed to fetch owner');
  } catch (error) {
    console.error('Error fetching POAP owner:', error);
  }
}

testPoapContract().catch(console.error);
