/**
 * Environment Variable Validator
 * 
 * This script validates that all required environment variables are present
 * before the application starts. It can be imported at the entry point of the app.
 */

const requiredVariables = [
  'NEXT_PUBLIC_ONCHAINKIT_API_KEY',
  'NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID',
  'NEXT_PUBLIC_POAP_API_KEY',
];

const optionalVariables = [
  'NEXT_PUBLIC_DEFAULT_CHAIN',
  'NEXT_PUBLIC_BASE_MAINNET_RPC_URL',
  'NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL',
];

function validateEnvironment() {
  const missing = [];
  
  for (const variable of requiredVariables) {
    if (!process.env[variable]) {
      missing.push(variable);
    }
  }
  
  if (missing.length > 0) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Missing required environment variables:');
    missing.forEach(variable => {
      console.error(`   - ${variable}`);
    });
    console.error('\nPlease add these variables to your .env.local file or environment.');
    console.error('See .env.example for reference.\n');
    
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  } else {
    console.log('\x1b[32m%s\x1b[0m', '✅ All required environment variables are set.');
  }
  
  const missingOptional = [];
  for (const variable of optionalVariables) {
    if (!process.env[variable]) {
      missingOptional.push(variable);
    }
  }
  
  if (missingOptional.length > 0) {
    console.warn('\x1b[33m%s\x1b[0m', '⚠️ Missing optional environment variables:');
    missingOptional.forEach(variable => {
      console.warn(`   - ${variable}`);
    });
    console.warn('\nThese variables are not required but recommended for full functionality.');
  }
}

module.exports = { validateEnvironment };
