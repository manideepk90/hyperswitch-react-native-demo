require('dotenv').config();
const express = require('express');
const app = express();
const hyper = require('@juspay-tech/hyperswitch-node')(getSecretKey());
// Define a port to listen on
const PORT = process.env.PORT || 4242;

function getSecretKey() {
  return process.env.HYPERSWITCH_SECRET_KEY;
}

function getPublishableKey() {
  return process.env.HYPERSWITCH_PUBLISHABLE_KEY;
}

app.get('/', async (req, res) => {
  res.send('The server is running fine');
});
// console.log('Secret key -------->' + getSecretKey());
// console.log('Publishable key ---> ' + getPublishableKey());

app.post('/get-config', async (req, res) => {
  try {
    res.send({
      publishableKey: getPublishableKey(),
    });
  } catch (err) {
    return res.status(400).send({
      error: {
        message: err.message,
      },
    });
  }
});
app.post('/create-payment', async (req, res) => {
  try {
    const paymentIntent = await hyper.paymentIntents.create({
      amount: 2999,
      currency: 'USD',
      customer_id: 'shivam',
      profile_id: 'pro_neyxCYTLoxgPBD2pQZYB',
    });

    // console.log('-- paymentIntent', paymentIntent);
    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
      customerId: paymentIntent.ephemeral_key.customer_id,
      ephemeralKey: paymentIntent.ephemeral_key.secret,
    });
  } catch (err) {
    return res.status(400).send({
      error: {
        message: err.message,
      },
    });
  }
});

app.listen(PORT, () => {
  console.log(`Hyperswitch Server is running on http://localhost:${PORT}`);
});
