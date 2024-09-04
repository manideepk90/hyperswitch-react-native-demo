async function fetchPaymentParams() {
  const response = await fetch('http://10.10.71.104:4242/create-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const key = await response.json();
  return key;
}
export default fetchPaymentParams;