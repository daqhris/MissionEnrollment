export const mockPoapsResponse = [
  {
    event: {
      id: "123456",
      name: "ETHGlobal Brussels Hacker",
      image_url: "https://assets.poap.xyz/ethglobal-brussels-2024-hacker-2024-logo.png",
      start_date: "2024-02-17"
    },
    token_id: "7890123"
  },
  {
    event: {
      id: "123457",
      name: "ETHGlobal Brussels Speaker",
      image_url: "https://assets.poap.xyz/ethglobal-brussels-2024-speaker-2024-logo.png",
      start_date: "2024-02-17"
    },
    token_id: "7890124"
  },
  {
    event: {
      id: "123458",
      name: "Some Other Event",
      image_url: "https://assets.poap.xyz/other-event-2024-logo.png",
      start_date: "2024-02-17"
    },
    token_id: "7890125"
  }
];

export const mockValidWalletAddresses = [
  "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
  "0x123456789abcdef123456789abcdef123456789a"
];

export const mockEventInfo = {
  role: "Hacker",
  date: "2024-02-17",
  venue: "The EGG Brussels, Rue Bara 175, 1070 Brussels, Belgium",
  verifiedName: "test.base.eth",
  tokenId: "7890123"
};

export const mockErrorResponse = {
  status: 404,
  message: "No POAPs found for this address"
};