export const getStructuredData = ({
  name = 'Mission Enrollment',
  description = 'A decentralized application for managing mission enrollments and verifying attestations on Base',
  url = 'https://mission-enrollment.daqhris.com',
  logoUrl = 'https://mission-enrollment.daqhris.com/logo.png',
}: {
  name?: string;
  description?: string;
  url?: string;
  logoUrl?: string;
} = {}): Record<string, any> => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name,
    description,
    url,
    applicationCategory: 'Blockchain',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    author: {
      '@type': 'Organization',
      name: 'Mission Enrollment Team',
      url: 'https://github.com/daqhris/MissionEnrollment'
    },
    image: logoUrl,
    screenshot: logoUrl
  };
};
