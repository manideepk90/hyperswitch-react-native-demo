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

// // Create a Payment with the order amount and currency
// app.post('/create-payment', async (req, res) => {
//   try {
//     const paymentIntent = await hyper.paymentIntents.create({
//       currency: 'USD',
//       amount: 500,
//     });
//     // Send publishable key and PaymentIntent details to client
//     res.send({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (err) {
//     return res.status(400).send({
//       error: {
//         message: err.message,
//       },
//     });
//   }
// });
app.post('/create-payment', async (req, res) => {
  try {
    const paymentIntent = await hyper.paymentIntents.create({
      amount: 2999,
      currency: 'USD'
    });

    console.log('-- paymentIntent', paymentIntent);
    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret
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
