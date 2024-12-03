import { fetchPoaps } from '../utils/fetchPoapsUtil';
import { ETH_GLOBAL_BRUSSELS_EVENT_NAMES, EVENT_VENUE } from '../utils/eventConstants';
import { mockPoapsResponse, mockValidWalletAddresses } from './mocks/poapData';

// Mock fetchPoaps function
jest.mock('../utils/fetchPoapsUtil');
const mockedFetchPoaps = fetchPoaps as jest.MockedFunction<typeof fetchPoaps>;

describe('POAP Verification', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedFetchPoaps.mockResolvedValue(mockPoapsResponse);
  });

  describe('ETHGlobal Brussels POAP Verification', () => {
    it('should verify wallet has ETHGlobal Brussels POAPs', async () => {
      const address = mockValidWalletAddresses[0];
      if (!address) throw new Error('Test wallet address is undefined');

      const poaps = await fetchPoaps(address);
      const ethGlobalBrusselsPoaps = poaps.filter(poap =>
        ETH_GLOBAL_BRUSSELS_EVENT_NAMES.includes(poap.event.name as typeof ETH_GLOBAL_BRUSSELS_EVENT_NAMES[number])
      );

      expect(ethGlobalBrusselsPoaps.length).toBeGreaterThan(0);
    });

    it('should extract role from POAP name', async () => {
      const address = mockValidWalletAddresses[0];
      if (!address) throw new Error('Test wallet address is undefined');

      const poaps = await fetchPoaps(address);
      const ethGlobalBrusselsPoap = poaps.find(poap =>
        ETH_GLOBAL_BRUSSELS_EVENT_NAMES.includes(poap.event.name as typeof ETH_GLOBAL_BRUSSELS_EVENT_NAMES[number])
      );

      if (!ethGlobalBrusselsPoap) throw new Error('No ETHGlobal Brussels POAP found');

      const role = ethGlobalBrusselsPoap.event.name.replace('ETHGlobal Brussels ', '');
      expect(role).toBe('Hacker');
    });

    it('should combine POAP info with venue and verified name', async () => {
      const address = mockValidWalletAddresses[0];
      if (!address) throw new Error('Test wallet address is undefined');
      const verifiedName = 'test.base.eth';

      const poaps = await fetchPoaps(address);
      const ethGlobalBrusselsPoap = poaps.find(poap =>
        ETH_GLOBAL_BRUSSELS_EVENT_NAMES.includes(poap.event.name as typeof ETH_GLOBAL_BRUSSELS_EVENT_NAMES[number])
      );

      if (!ethGlobalBrusselsPoap) throw new Error('No ETHGlobal Brussels POAP found');

      const eventInfo = {
        role: ethGlobalBrusselsPoap.event.name.replace('ETHGlobal Brussels ', ''),
        date: ethGlobalBrusselsPoap.event.start_date,
        venue: EVENT_VENUE,
        verifiedName,
        tokenId: ethGlobalBrusselsPoap.tokenId
      };

      expect(eventInfo).toMatchObject({
        role: expect.any(String),
        date: expect.any(String),
        venue: EVENT_VENUE,
        verifiedName: expect.any(String),
        tokenId: expect.any(String)
      });
    });
  });
});
