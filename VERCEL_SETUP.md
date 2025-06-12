# Vercel Deployment Configuration

This document provides instructions for configuring Vercel environment variables to ensure successful deployment of the Mission Enrollment application.

## Required Environment Variables

Configure the following environment variables in your Vercel dashboard:

### API Keys (Required)
- `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`: Your WalletConnect project ID
- `NEXT_PUBLIC_ALCHEMY_API_KEY`: Your Alchemy API key for blockchain interactions
- `NEXT_PUBLIC_ONCHAINKIT_API_KEY`: Your OnchainKit API key for Coinbase services
- `NEXT_PUBLIC_POAP_API_KEY`: Your POAP API key for proof of attendance protocols

### Build Configuration (Required)
- `NEXT_PUBLIC_IGNORE_BUILD_ERROR`: Set to `"true"` to allow builds with TypeScript/ESLint warnings

### Platform Configuration (Automatically set by vercel.json)
- `NODE_VERSION`: Set to `"18"` (configured in vercel.json)
- `GITHUB_PAGES`: Set to `"false"` (configured in vercel.json)
- `CUSTOM_DOMAIN`: Set to `"true"` (configured in vercel.json)

## Vercel Dashboard Configuration Steps

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add each required environment variable with its corresponding value
4. Ensure all variables are set for Production, Preview, and Development environments
5. Redeploy your application after adding the environment variables

## Build Configuration

The `vercel.json` file has been configured with:
- Node.js 18 runtime for API functions
- Static export output directory (`out`)
- Proper build command (`yarn build`)
- Framework detection for Next.js

## Troubleshooting

If deployment fails:
1. Verify all required environment variables are set
2. Check that API keys are valid and have proper permissions
3. Ensure the build completes locally with `yarn build`
4. Review Vercel build logs for specific error messages

## Deployment URLs

- Primary: mission-enrollment.daqhris.com
- Secondary: mission-enrollment.vercel.app
