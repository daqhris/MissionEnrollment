#!/bin/bash
export NEXT_PUBLIC_CDP_API_KEY="KVAZVH1PfCJtSB2Qrof7BeGlBgaUXYLh"
export NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID="51efeb3496788290b171479938636c35"
export ALCHEMY_API_KEY="bw4VW7-_Ucc6_8OakB_Zq9tWRpG2Lkd-"
export POAP_API_KEY="81BDT3A1kc2mfQE2edNqymulkmMUvXCBnlF1X5yxcuYXByNVbbU78IZ9ls2nUc15S9HMV4kdrTT1GxlGVgHMg1o5UF0b7zETZyuPJeQannunkcqYtTUUfUDcCEiiihy2"
export NODE_ENV=development
export DEBUG=*

echo "Starting Next.js development server..."
pnpm next dev --port 3000 --hostname 0.0.0.0
