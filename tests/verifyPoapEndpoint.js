const testAddress = '0xb5ee030c71e76c3e03b2a8d425dbb9b395037c82'; // Address from the POAP data
const poapApiKey = process.env.NEXT_PUBLIC_POAP_API_KEY;

async function verifyPoapEndpoint() {
  try {
    const url = new URL(`https://api.poap.tech/actions/scan/${testAddress}`);
    url.searchParams.append('chain', 'gnosis');
    url.searchParams.append('limit', '100');

    const response = await fetch(url, {
      headers: {
        'X-API-Key': poapApiKey,
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API Response Status:', response.status);
    console.log('Found POAPs:', data.length);

    // Look for the specific POAP
    const brusselsPoap = data.find(poap =>
      poap.event && poap.event.id === 176328
    );

    if (brusselsPoap) {
      console.log('Found Brussels POAP:', JSON.stringify(brusselsPoap, null, 2));
    } else {
      console.log('Brussels POAP not found in response');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

verifyPoapEndpoint();
