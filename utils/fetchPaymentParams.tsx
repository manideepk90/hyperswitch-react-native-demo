async function fetchWithTimeout(url: string, options = {}, timeout = 5000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), timeout),
    ),
  ]);
}

async function fetchPaymentParams() {
  try {
    const response: any = await fetchWithTimeout(
      'http://10.10.71.104:4242/create-payment',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      10000, // 10-second timeout
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const key = await response.json();
    return key;
  } catch (error) {
    console.error('Fetch Payment Params Error:', error);
    throw error; // Re-throw the error after logging it
  }
}

export default fetchPaymentParams;
