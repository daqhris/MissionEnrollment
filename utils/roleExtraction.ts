import { APPROVED_EVENT_NAMES } from './eventConstants';

export interface EventRoleConfig {
  eventKey: string;
  namePatterns: Record<string, string>;
  descriptionPatterns: Record<string, string>;
  defaultRole: string;
}

export const EVENT_ROLE_CONFIG: Record<string, EventRoleConfig> = {
  ETH_GLOBAL_BRUSSELS: {
    eventKey: 'ETH_GLOBAL_BRUSSELS',
    namePatterns: {
      'hacker': 'Hacker',
      'mentor': 'Mentor',
      'judge': 'Judge',
      'sponsor': 'Sponsor',
      'speaker': 'Speaker',
      'volunteer': 'Volunteer',
      'staff': 'Staff',
    },
    descriptionPatterns: {
      'hacker': 'Hacker',
      'mentor': 'Mentor',
      'judge': 'Judge',
      'sponsor': 'Sponsor',
      'speaker': 'Speaker',
      'volunteer': 'Volunteer',
      'staff': 'Staff',
    },
    defaultRole: 'Participant',
  },
  ETHDENVER_COINBASE_CDP_2025: {
    eventKey: 'ETHDENVER_COINBASE_CDP_2025',
    namePatterns: {
      'speaker': 'Speaker',
      'sponsor': 'Sponsor',
      'mentor': 'Mentor',
      'judge': 'Judge',
      'developer': 'Developer',
      'hacker': 'Hacker',
      'happy hour': 'Social Participant',
      'buidl week': 'BUIDLer',
    },
    descriptionPatterns: {
      'speaker': 'Speaker',
      'sponsor': 'Sponsor',
      'mentor': 'Mentor',
      'judge': 'Judge',
      'developer': 'Developer',
      'hacker': 'Hacker',
    },
    defaultRole: 'Attendee',
  },
};

/**
 * Extract role from POAP event information using pattern matching
 * @param eventName - Full name of the POAP event
 * @param eventDescription - Description of the POAP event
 * @param eventType - Type of event (ETH_GLOBAL_BRUSSELS or ETHDENVER_COINBASE_CDP_2025)
 * @returns Extracted role string
 */
export function extractRoleFromPOAP(
  eventName: string,
  eventDescription: string = '',
  eventType: string
): string {
  const config = EVENT_ROLE_CONFIG[eventType];
  if (!config) {
    console.warn(`No role configuration found for event type: ${eventType}`);
    return 'Participant';
  }

  const nameLower = eventName.toLowerCase();
  const descriptionLower = eventDescription?.toLowerCase() || '';

  for (const [pattern, role] of Object.entries(config.namePatterns)) {
    if (nameLower.includes(pattern.toLowerCase())) {
      return role;
    }
  }

  for (const [pattern, role] of Object.entries(config.descriptionPatterns)) {
    if (descriptionLower.includes(pattern.toLowerCase())) {
      return role;
    }
  }

  if (eventType === 'ETH_GLOBAL_BRUSSELS' && nameLower.includes('ethglobal brussels 2024')) {
    const suffix = eventName.replace('ETHGlobal Brussels 2024', '').trim();
    if (suffix) {
      return suffix;
    }
  }

  return config.defaultRole;
}

/**
 * Determine event type from POAP event name
 * @param eventName - Name of the POAP event
 * @returns Event type key or empty string if not found
 */
export function determineEventType(eventName: string): string {
  const nameLower = eventName.toLowerCase();
  
  if (APPROVED_EVENT_NAMES.ETH_GLOBAL_BRUSSELS.some(name => 
    nameLower.includes(name.toLowerCase()))) {
    return 'ETH_GLOBAL_BRUSSELS';
  }
  
  if (APPROVED_EVENT_NAMES.ETHDENVER_COINBASE_CDP_2025.some(name => 
    nameLower.includes(name.toLowerCase()))) {
    return 'ETHDENVER_COINBASE_CDP_2025';
  }
  
  return '';
}
