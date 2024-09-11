async function fetchPaymentParams() {
  const response = await fetch('http://10.0.2.2:4242/create-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const key = await response.json();
  console.log(key);
  return key;
}
export default fetchPaymentParams;
