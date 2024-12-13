import { SchemaData } from '../types/attestation';

export function formatAttestationValue(field: { name: string; value: any }) {
  switch (field.name.toLowerCase()) {
    case 'timestamp':
      return new Date(Number(field.value) * 1000).toLocaleString();
    case 'useraddress':
    case 'attester':
      return typeof field.value === 'object' ? field.value.hex : field.value;
    default:
      return typeof field.value === 'object' ? field.value.hex : String(field.value);
  }
}

export function getFieldLabel(name: string): string {
  const labels: Record<string, string> = {
    userAddress: 'Address',
    verifiedName: 'Name',
    proofMethod: 'Proof',
    eventName: 'Event',
    eventType: 'Type',
    assignedRole: 'Role',
    missionName: 'Mission',
    attester: 'Attester',
    proofProtocol: 'Proof',
    poapProof: 'Proof'
  };
  return labels[name] || name;
}

export function formatAttestationData(decodedData: any[]): Partial<SchemaData> {
  const formattedData: Partial<SchemaData> = {};

  decodedData.forEach(field => {
    const rawKey = field.value.name.toLowerCase();
    const keyMap: Record<string, keyof SchemaData> = {
      'useraddress': 'userAddress',
      'verifiedname': 'verifiedName',
      'proofmethod': 'proofMethod',
      'eventname': 'eventName',
      'eventtype': 'eventType',
      'assignedrole': 'assignedRole',
      'missionname': 'missionName',
      'timestamp': 'timestamp',
      'attester': 'attester',
      'proofprotocol': 'proofProtocol',
      'poapproof': 'poapProof'
    };

    const key = keyMap[rawKey];
    if (!key) return;

    const value = field.value.value;

    try {
      if (typeof value === 'object' && 'hex' in value) {
        if (key === 'userAddress' || key === 'attester') {
          formattedData[key] = value.hex.toLowerCase();
        } else {
          formattedData[key] = value.hex;
        }
      } else if (key === 'timestamp') {
        const timestamp = Number(value);
        if (!isNaN(timestamp)) {
          formattedData[key] = timestamp;
        }
      } else {
        formattedData[key] = String(value).trim();
      }
    } catch (error) {
      console.error(`Error formatting field ${key}:`, error);
    }
  });

  return formattedData;
}
