#!/bin/bash

echo "Setting up MissionEnrollment..."

NODE_VERSION=$(node --version 2>/dev/null)
if [ $? -ne 0 ]; then
  echo "Error: Node.js is not installed"
  echo "Please install Node.js v18 or later: https://nodejs.org/"
  exit 1
fi

NODE_VERSION=${NODE_VERSION#v}
NODE_MAJOR=${NODE_VERSION%%.*}

if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "Error: Node.js v18 or later is required (found v$NODE_VERSION)"
  echo "Please upgrade Node.js: https://nodejs.org/"
  exit 1
fi

if ! command -v yarn &> /dev/null; then
  echo "Yarn not found. Installing Yarn..."
  npm install -g yarn
  if [ $? -ne 0 ]; then
    echo "Failed to install Yarn. Please install it manually: https://yarnpkg.com/getting-started/install"
    exit 1
  fi
fi

if [ ! -f .env.local ]; then
  echo "Creating .env.local from .env.example..."
  cp .env.example .env.local
  echo "Please edit .env.local to add your API keys"
fi

echo "Installing dependencies..."
yarn install
if [ $? -ne 0 ]; then
  echo "Failed to install dependencies. Please check the error messages above."
  exit 1
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure your API keys in .env.local"
echo "2. Start the development server: yarn dev"
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "For Docker users:"
echo "1. Configure your API keys in .env.local"
echo "2. Run: docker-compose up"
echo "3. Open http://localhost:3000 in your browser"
