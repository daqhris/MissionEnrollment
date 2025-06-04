import { POAP_API_URL } from './constants';
import { APPROVED_EVENT_NAMES } from './eventConstants';
import { extractRoleFromPOAP } from './roleExtraction';

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
      const role = extractRoleFromPOAP(
        ethGlobalEvent.event.name,
        ethGlobalEvent.event.description,
        'ETH_GLOBAL_BRUSSELS'
      );
      
      return { 
        role, 
        eventType: 'ETH_GLOBAL_BRUSSELS' 
      };
    }

    const ethDenverEvent = data.find((poap: POAPEvent) =>
      APPROVED_EVENT_NAMES.ETHDENVER_COINBASE_CDP_2025.some(eventName => 
        poap.event.name.toLowerCase().includes(eventName.toLowerCase())
      )
    );

    if (ethDenverEvent) {
      const role = extractRoleFromPOAP(
        ethDenverEvent.event.name,
        ethDenverEvent.event.description,
        'ETHDENVER_COINBASE_CDP_2025'
      );
      
      return { 
        role, 
        eventType: 'ETHDENVER_COINBASE_CDP_2025' 
      };
    }

    return { role: 'Participant', eventType: 'ETH_GLOBAL_BRUSSELS' };
  } catch (error) {
    console.error('Error fetching POAP role:', error);
    return { role: 'Participant', eventType: 'ETH_GLOBAL_BRUSSELS' };
  }
}
