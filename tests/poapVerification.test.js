const { verifyETHGlobalBrusselsPOAPOwnership, clearCache } = require('../src/utils/poapVerification');
const { Alchemy } = require("alchemy-sdk");

jest.mock('alchemy-sdk');

describe('POAP Verification', () => {
  const testAddress = '0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82';

  beforeEach(() => {
    jest.clearAllMocks();
    clearCache();
  });

  test('verifyETHGlobalBrusselsPOAPOwnership returns true when POAP is owned', async () => {
    Alchemy.prototype.nft = {
      getNftsForOwner: jest.fn().mockResolvedValue({
        ownedNfts: [
          {
            tokenId: '176334',
            contract: { address: '0x22C1f6050E56d2876009903609a2cC3fEf83B415' },
          },
        ],
      }),
    };

    const result = await verifyETHGlobalBrusselsPOAPOwnership(testAddress);
    expect(result).toEqual({
      owned: true,
      imageUrl: 'https://assets.poap.xyz/c5cb8bb2-e0ae-428e-bc77-c55d0dc8b02e.png'
    });
  });

  test('verifyETHGlobalBrusselsPOAPOwnership returns false when no POAPs are owned', async () => {
    Alchemy.prototype.nft = {
      getNftsForOwner: jest.fn().mockResolvedValue({
        ownedNfts: [],
      }),
    };

    const result = await verifyETHGlobalBrusselsPOAPOwnership(testAddress);
    expect(result).toEqual({ owned: false, imageUrl: null });
  });

  test('verifyETHGlobalBrusselsPOAPOwnership returns false when owned POAP is not from ETHGlobal Brussels', async () => {
    Alchemy.prototype.nft = {
      getNftsForOwner: jest.fn().mockResolvedValue({
        ownedNfts: [
          {
            tokenId: '123456',
            contract: { address: '0x22C1f6050E56d2876009903609a2cC3fEf83B415' },
          },
        ],
      }),
    };

    const result = await verifyETHGlobalBrusselsPOAPOwnership(testAddress);
    expect(result).toEqual({ owned: false, imageUrl: null });
  });

  test('verifyETHGlobalBrusselsPOAPOwnership handles API errors', async () => {
    Alchemy.prototype.nft = {
      getNftsForOwner: jest.fn().mockRejectedValue(new Error('API Error')),
    };

    await expect(verifyETHGlobalBrusselsPOAPOwnership(testAddress)).rejects.toThrow('API Error');
  });
});
