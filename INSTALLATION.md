# MissionEnrollment Installation Guide

This guide provides detailed instructions for installing and running the MissionEnrollment application in various environments.

## Prerequisites

- **Node.js**: Version 18 or later
- **Yarn**: Package manager (preferred over npm)
- **Git**: For cloning the repository
- **API Keys**:
  - OnchainKit API Key
  - WalletConnect Project ID
  - Alchemy API Key
  - POAP API Key

## Standard Installation

### 1. Clone the Repository

```bash
git clone https://github.com/daqhris/MissionEnrollment.git
cd MissionEnrollment
```

### 2. Automated Setup

Run the setup script which will check requirements, create environment files, and install dependencies:

```bash
chmod +x setup.sh
./setup.sh
```

### 3. Configure Environment Variables

Edit the `.env.local` file created by the setup script:

```bash
# Required API Keys
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id_here
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key_here
NEXT_PUBLIC_POAP_API_KEY=your_poap_api_key_here

# Blockchain Configuration
NEXT_PUBLIC_DEFAULT_CHAIN=8453  # Base Mainnet
NEXT_PUBLIC_BASE_MAINNET_RPC_URL=https://mainnet.base.org
NEXT_PUBLIC_BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
```

### 4. Start the Development Server

```bash
yarn dev
```

Visit `http://localhost:3000` in your browser.

## Docker Installation

### 1. Clone the Repository

```bash
git clone https://github.com/daqhris/MissionEnrollment.git
cd MissionEnrollment
```

### 2. Configure Environment Variables

Create a `.env.local` file with your API keys (see above).

### 3. Build and Run with Docker Compose

```bash
docker-compose up
```

Visit `http://localhost:3000` in your browser.

## Production Deployment Options

### 1. GitHub Pages (Static Export)

The repository is already configured for GitHub Pages deployment through GitHub Actions. Push to the main branch to trigger deployment.

### 2. Docker Container on VPS

```bash
# Build the Docker image
docker build -t mission-enrollment .

# Run the container
docker run -p 3000:3000 --env-file .env.production mission-enrollment
```

### 3. Vercel Deployment

Connect your GitHub repository to Vercel and configure the environment variables in the Vercel dashboard.

## Troubleshooting

### Dependency Conflicts

If you encounter dependency conflicts during installation, try:

```bash
# Clear yarn cache
yarn cache clean

# Install with --check-files
yarn install --check-files
```

### Environment Variable Issues

If the application fails to start due to missing environment variables, check:

1. That `.env.local` exists and contains all required variables
2. That the variable names match exactly as specified in `.env.example`

### Build Errors

If you encounter build errors related to TypeScript:

```bash
# Build with type checking disabled
NEXT_PUBLIC_IGNORE_BUILD_ERROR=true yarn build
```

## Known Issues

1. **Middleware Conflict**: The application uses middleware which conflicts with static export. This is currently handled by disabling the middleware with an empty matcher.

2. **MUI Version Mismatch**: There's a version conflict between `@mui/icons-material@6.2.0` and `@mui/material@5.16.11`. To resolve:
   ```bash
   yarn add @mui/material@^6.2.0
   ```

3. **React Types Conflict**: There's a conflict between `@types/react-dom@18.3.5` and `@types/react@19.0.1`. To resolve:
   ```bash
   yarn add @types/react@^18.0.0 -D
   ```

## Support

For additional help, please open an issue on the [GitHub repository](https://github.com/daqhris/MissionEnrollment/issues).
