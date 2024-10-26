import { ethers } from 'ethers';
import { getBaseName, verifyBaseName } from './basename';

async function testBasenameVerification() {
  // Test address (replace with a known Base name holder)
  const testAddress = '0x1234567890123456789012345678901234567890';
  
  console.log('Testing Base name verification...');
  
  try {
    // Test getBaseName
    const baseName = await getBaseName(testAddress);
    console.log('Retrieved Base name:', baseName);
    
    // Test verification with correct format
    const result1 = await verifyBaseName(testAddress, 'test.base.eth');
    console.log('Verification result with .base.eth:', result1);
    
    // Test verification with incorrect format
    const result2 = await verifyBaseName(testAddress, 'test.eth');
    console.log('Verification result without .base.eth:', result2);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testBasenameVerification().catch(console.error);
