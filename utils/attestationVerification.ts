export function generateVerificationSignature(userAddress: string, eventInfo: any): string {
  return `0x${Buffer.from(JSON.stringify({
    userAddress,
    eventInfo,
    timestamp: Date.now()
  })).toString('hex')}`;
}

export function generateVerificationHash(userAddress: string, eventInfo: any): string {
  const data = JSON.stringify({
    userAddress,
    eventName: eventInfo.eventName,
    role: eventInfo.role,
    timestamp: Date.now()
  });
  return `0x${Buffer.from(data).toString('hex')}`;
}
