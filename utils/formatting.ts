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
    userAddress: 'User Address',
    verifiedName: 'Verified Name',
    proofMethod: 'Proof Method',
    eventName: 'Event Name',
    eventType: 'Event Type',
    assignedRole: 'Role',
    missionName: 'Mission',
    timestamp: 'Time',
    attester: 'Attester',
    proofProtocol: 'Protocol'
  };
  return labels[name] || name;
}

export function formatAttestationData(decodedData: any[]): Partial<SchemaData> {
  const formattedData: Partial<SchemaData> = {};

  decodedData.forEach(field => {
    const key = field.value.name.toLowerCase() as keyof SchemaData;
    const value = field.value.value;
    if (typeof value === 'object' && 'hex' in value) {
      (formattedData as any)[key] = value.hex;
    } else {
      (formattedData as any)[key] = value;
    }
  });

  return formattedData;
}