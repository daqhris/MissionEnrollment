import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { fetchPoaps } from '../utils/fetchPoapsUtil';

jest.mock('next/config', () => () => ({
  publicRuntimeConfig: {
    NEXT_PUBLIC_RPC_URL: 'https://rpc.ankr.com/eth',
  },
}));

describe('POAP Data Retrieval', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
    process.env.NEXT_PUBLIC_POAP_API_KEY = 'dummy_poap_api_key';
  });

  afterEach(() => {
    mock.reset();
    jest.resetAllMocks();
  });

  it('should fetch POAPs from POAP API', async () => {
    const userAddress = '0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82';
    const mockPoapMetadata = {
      id: '123456',
      fancy_id: 'ethglobal-brussels-2024',
      name: 'ETHGlobal Brussels 2024',
      event: {
        id: '123456',
        fancy_id: 'ethglobal-brussels-2024',
        name: 'ETHGlobal Brussels 2024',
        event_url: 'https://ethglobal.com/events/brussels',
        image_url: 'https://example.com/poap.png',
        country: 'Belgium',
        city: 'Brussels',
        description: 'ETHGlobal Brussels 2024 event',
        year: 2024,
        start_date: '2024-03-15',
        end_date: '2024-03-17',
        expiry_date: '2024-04-15',
        supply: 1000,
      },
      token_id: '123456',
    };

    mock.onGet(`https://api.poap.xyz/actions/scan/${userAddress}`).reply(200, [mockPoapMetadata]);

    const result = await fetchPoaps(userAddress);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      event: {
        id: '123456',
        name: 'ETHGlobal Brussels 2024',
        image_url: 'https://example.com/poap.png',
        start_date: '2024-03-15',
      },
      token_id: '123456',
      metadata: {
        image: 'https://example.com/poap.png',
      },
    });
  });

  it('should handle API errors from POAP API', async () => {
    const userAddress = '0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82';
    mock.onGet(`https://api.poap.xyz/actions/scan/${userAddress}`).networkError();

    await expect(fetchPoaps(userAddress)).rejects.toThrow('An error occurred while fetching POAP data: Network Error');
  });

  it('should handle empty response from POAP API', async () => {
    const userAddress = '0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82';
    mock.onGet(`https://api.poap.xyz/actions/scan/${userAddress}`).reply(200, []);

    const result = await fetchPoaps(userAddress);
    expect(result).toEqual([]);
  });

  it('should handle invalid response format from POAP API', async () => {
    const userAddress = '0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82';
    mock.onGet(`https://api.poap.xyz/actions/scan/${userAddress}`).reply(200, { invalid: 'response' });

    await expect(fetchPoaps(userAddress)).rejects.toThrow('POAP API error: Invalid response format');
  });

  it('should handle null response from POAP API', async () => {
    const userAddress = '0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82';
    mock.onGet(`https://api.poap.xyz/actions/scan/${userAddress}`).reply(200, null);

    const result = await fetchPoaps(userAddress);
    expect(result).toEqual([]);
  });

  it('should handle IPFS metadata fetching', async () => {
    const userAddress = '0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82';
    const mockPoapResponse = [
      {
        event: {
          id: '123456',
          name: 'ETHGlobal Brussels 2024',
          image_url: 'ipfs://QmExample',
          start_date: '2024-03-15',
        },
        token_id: '123456',
      },
    ];

    mock.onGet(`https://api.poap.xyz/actions/scan/${userAddress}`).reply(200, mockPoapResponse);
    mock.onGet('https://ipfs.io/ipfs/QmExample').reply(200, { image: 'https://ipfs.io/ipfs/QmExample' });

    const result = await fetchPoaps(userAddress);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      event: {
        id: '123456',
        name: 'ETHGlobal Brussels 2024',
        image_url: 'ipfs://QmExample',
        start_date: '2024-03-15',
      },
      token_id: '123456',
      metadata: {
        image: 'https://ipfs.io/ipfs/QmExample',
      },
    });
  });

  it('should handle IPFS metadata fetching errors', async () => {
    const userAddress = '0xb5ee030c71e76C3E03B2A8d425dBb9B395037C82';
    const mockPoapResponse = [
      {
        event: {
          id: '123456',
          name: 'ETHGlobal Brussels 2024',
          image_url: 'ipfs://QmExample',
          start_date: '2024-03-15',
        },
        token_id: '123456',
      },
    ];

    mock.onGet(`https://api.poap.xyz/actions/scan/${userAddress}`).reply(200, mockPoapResponse);
    mock.onGet('https://ipfs.io/ipfs/QmExample').timeout();

    const result = await fetchPoaps(userAddress);

    expect(result).toHaveLength(1);
    expect(result[0]).toBeDefined();

    const poap = result[0];
    expect(poap).toHaveProperty('event');
    expect(poap).toHaveProperty('token_id');
    expect(poap).toHaveProperty('metadata');

    if (poap && poap.metadata) {
      expect(poap.metadata).toEqual({
        image: 'ipfs://QmExample',
      });
    } else {
      fail('POAP or metadata is undefined');
    }
  });
});
