export const APPROVED_EVENT_NAMES = {
  ETH_GLOBAL_BRUSSELS: [
    'ETHGlobal Brussels 2024 Hacker',
    'ETHGlobal Brussels 2024 Sponsor',
    'ETHGlobal Brussels 2024 Speaker',
    'ETHGlobal Brussels 2024 Mentor',
    'ETHGlobal Brussels 2024 Staff',
    'ETHGlobal Brussels 2024 Volunteer'
  ] as const,
  ETHDENVER_COINBASE_CDP_2025: [
    'Coinbase Developer Platform at ETHDenver 2025',
    'Coinbase Developer Platform at #BUIDLWeek - EthDenver 2025',
    'Coinbase Developer Platform - EthDenver Happy Hour 2025'
  ] as const
};

export const EVENT_VENUES = {
  ETH_GLOBAL_BRUSSELS: 'The EGG Brussels, Rue Bara 175, 1070 Brussels, Belgium',
  ETHDENVER_COINBASE_CDP_2025: 'National Western Complex, Denver, Colorado, USA'
};

export const ETH_GLOBAL_BRUSSELS_EVENT_NAMES = APPROVED_EVENT_NAMES.ETH_GLOBAL_BRUSSELS;
export const EVENT_VENUE = EVENT_VENUES.ETH_GLOBAL_BRUSSELS;
