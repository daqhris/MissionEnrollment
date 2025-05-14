import { SchemaData } from '../types/attestation';

/**
 * Formats a timestamp to a human-readable format
 * @param timestamp ISO timestamp string or number
 * @returns Formatted date string without T and Z characters
 */
export function formatTimestamp(timestamp: string | number): string {
  if (!timestamp) return '';
  
  try {
    let date: Date;
    
    if (typeof timestamp === 'number') {
      date = new Date(timestamp);
    } else if (timestamp.includes('T') && timestamp.includes('Z')) {
      date = new Date(timestamp);
    } else {
      date = new Date(timestamp);
    }
    
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting timestamp:', error);
    return String(timestamp);
  }
}

export function formatAttestationValue(field: { name: string; value: any }) {
  switch (field.name.toLowerCase()) {
    case 'timestamp':
    case 'verificationtimestamp':
      return formatTimestamp(field.value);
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
    verifiedName: 'Onchain Name',  // Changed from 'Enrolled User' to 'Onchain Name'
    proofMethod: 'Proof Method',
    eventName: 'Event',
    eventType: 'Type',
    assignedRole: 'Role',
    missionName: 'Mission',
    attester: 'Public Attester',  // Changed from 'Official Attester' to 'Public Attester'
    proofProtocol: 'Proof Protocol',
    verificationSource: 'Schema Deployer',
    verificationTimestamp: 'Verification Time',
    verificationSignature: 'Signature',
    verificationHash: 'Hash'
  };
  return labels[name] || name;
}

/**
 * Ensures Base names are displayed with a single .base.eth suffix
 * @param name Name to format
 * @returns Properly formatted name
 */
export function formatBaseName(name: string): string {
  if (!name) return name;
  const baseSuffix = '.base.eth';
  if (name.endsWith(`${baseSuffix}${baseSuffix}`)) {
    return name.slice(0, name.length - baseSuffix.length);
  }
  return name;
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
      'verificationsource': 'verificationSource',
      'verificationtimestamp': 'verificationTimestamp',
      'verificationsignature': 'verificationSignature',
      'verificationhash': 'verificationHash'
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
      } else if (key === 'verifiedName') {
        formattedData[key] = formatBaseName(String(value).trim());
      } else {
        formattedData[key] = String(value).trim();
      }
    } catch (error) {
      console.error(`Error formatting field ${key}:`, error);
    }
  });

  return formattedData;
}
