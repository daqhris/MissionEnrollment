import { POAP_API_URL } from './constants';

interface POAPEvent {
  event: {
    name: string;
    description: string;
  }
}

export async function getPOAPRole(address: string): Promise<string> {
  try {
    const response = await fetch(POAP_API_URL + '/actions/scan/' + address, {
      headers: {
        'x-api-key': process.env.NEXT_PUBLIC_POAP_API_KEY || ''
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch POAP data:', await response.text());
      return 'Participant';
    }

    const data = await response.json();
    const ethGlobalEvent = data.find((poap: POAPEvent) =>
      poap.event.name.toLowerCase().includes('ethglobal brussels')
    );

    if (!ethGlobalEvent) {
      return 'Participant';
    }

    const roleMapping: Record<string, string> = {
      'hacker': 'Hacker',
      'mentor': 'Mentor',
      'judge': 'Judge',
      'sponsor': 'Sponsor',
      'organizer': 'Organizer',
      'volunteer': 'Volunteer'
    };

    const role = Object.entries(roleMapping).find(([key]) =>
      ethGlobalEvent.event.description.toLowerCase().includes(key)
    );

    return role ? role[1] : 'Participant';
  } catch (error) {
    console.error('Error fetching POAP role:', error);
    return 'Participant';
  }
}
