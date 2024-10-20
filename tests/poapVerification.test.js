const { verifyETHGlobalBrusselsPOAPOwnership, clearCache } = require('../src/utils/poapVerification');
const { JsonRpcProvider, Contract } = require('ethers');

jest.mock('ethers');

describe('POAP Verification', () => {
  const testAddress = '0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82';

  beforeEach(() => {
    jest.clearAllMocks();
    clearCache();
  });

  test('verifyETHGlobalBrusselsPOAPOwnership returns true when POAP is owned', async () => {
    const mockBalanceOf = jest.fn().mockResolvedValue(1);
    const mockTokenOfOwnerByIndex = jest.fn().mockResolvedValue('176334');

    Contract.mockImplementation(() => ({
      balanceOf: mockBalanceOf,
      tokenOfOwnerByIndex: mockTokenOfOwnerByIndex,
    }));

    const result = await verifyETHGlobalBrusselsPOAPOwnership(testAddress);
    expect(result).toEqual({
      owned: true,
      imageUrl: 'https://assets.poap.xyz/c5cb8bb2-e0ae-428e-bc77-c55d0dc8b02e.png'
    });
    expect(mockBalanceOf).toHaveBeenCalledWith(testAddress);
    expect(mockTokenOfOwnerByIndex).toHaveBeenCalledWith(testAddress, 0);
  });

  test('verifyETHGlobalBrusselsPOAPOwnership returns false when no POAPs are owned', async () => {
    const mockBalanceOf = jest.fn().mockResolvedValue(0);

    Contract.mockImplementation(() => ({
      balanceOf: mockBalanceOf,
    }));

    const result = await verifyETHGlobalBrusselsPOAPOwnership(testAddress);
    expect(result).toEqual({ owned: false, imageUrl: null });
    expect(mockBalanceOf).toHaveBeenCalledWith(testAddress);
  });

  test('verifyETHGlobalBrusselsPOAPOwnership returns false when owned POAP is not from ETHGlobal Brussels', async () => {
    const mockBalanceOf = jest.fn().mockResolvedValue(1);
    const mockTokenOfOwnerByIndex = jest.fn().mockResolvedValue('123456');

    Contract.mockImplementation(() => ({
      balanceOf: mockBalanceOf,
      tokenOfOwnerByIndex: mockTokenOfOwnerByIndex,
    }));

    const result = await verifyETHGlobalBrusselsPOAPOwnership(testAddress);
    expect(result).toEqual({ owned: false, imageUrl: null });
    expect(mockBalanceOf).toHaveBeenCalledWith(testAddress);
    expect(mockTokenOfOwnerByIndex).toHaveBeenCalledWith(testAddress, 0);
  });

  test('verifyETHGlobalBrusselsPOAPOwnership handles API errors', async () => {
    const mockBalanceOf = jest.fn().mockRejectedValue(new Error('API Error'));

    Contract.mockImplementation(() => ({
      balanceOf: mockBalanceOf,
    }));

    await expect(verifyETHGlobalBrusselsPOAPOwnership(testAddress)).rejects.toThrow('API Error');
    expect(mockBalanceOf).toHaveBeenCalledWith(testAddress);
  });
});
