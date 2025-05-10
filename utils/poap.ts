import { POAP_API_URL } from './constants';
import { APPROVED_EVENT_NAMES } from './eventConstants';

interface POAPEvent {
  event: {
    name: string;
    description: string;
  }
}

interface POAPRoleResult {
  role: string;
  eventType: string;
}

export async function getPOAPRole(address: string): Promise<POAPRoleResult> {
  try {
    const response = await fetch(POAP_API_URL + '/actions/scan/' + address, {
      headers: {
        'x-api-key': process.env.NEXT_PUBLIC_POAP_API_KEY || ''
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch POAP data:', await response.text());
      return { role: 'Participant', eventType: 'ETH_GLOBAL_BRUSSELS' };
    }

    const data = await response.json();
    
    const ethGlobalEvent = data.find((poap: POAPEvent) =>
      APPROVED_EVENT_NAMES.ETH_GLOBAL_BRUSSELS.some(eventName => 
        poap.event.name.toLowerCase().includes(eventName.toLowerCase())
      )
    );

    if (ethGlobalEvent) {
      const roleMapping: Record<string, string> = {
        'hacker': 'Hacker',
        'mentor': 'Mentor',
        'judge': 'Judge',
        'sponsor': 'Sponsor',
        'organizer': 'Organizer',
        'volunteer': 'Volunteer'
      };

      const role = Object.entries(roleMapping).find(([key]) =>
        ethGlobalEvent.event.description.toLowerCase().includes(key) || 
        ethGlobalEvent.event.name.toLowerCase().includes(key)
      );

      return { 
        role: role ? role[1] : 'Participant', 
        eventType: 'ETH_GLOBAL_BRUSSELS' 
      };
    }

    const ethDenverEvent = data.find((poap: POAPEvent) =>
      APPROVED_EVENT_NAMES.ETHDENVER_COINBASE_2025.some(eventName => 
        poap.event.name.toLowerCase().includes(eventName.toLowerCase())
      )
    );

    if (ethDenverEvent) {
      return { 
        role: 'Attendee', 
        eventType: 'ETHDENVER_COINBASE_2025' 
      };
    }

    return { role: 'Participant', eventType: 'ETH_GLOBAL_BRUSSELS' };
  } catch (error) {
    console.error('Error fetching POAP role:', error);
    return { role: 'Participant', eventType: 'ETH_GLOBAL_BRUSSELS' };
  }
}
