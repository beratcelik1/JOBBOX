const router = require('express').Router();
const Job = require('../models/Job');
const stripe = require('stripe')(
  'sk_test_51NHa2fFZCkcI5HR1qtMGu2KmigIyLuiQ7U6sVoSVBTzRgmQduTl7FcMdjl1duLiYGkbrM28s2Nsf98lHDCTU4IY200db0TATsK'
);

router.post('/payment-sheet', async (req, res) => {
  // const { jobId } = req.body || {};
  // const jobObj = Job.find((job) => job._id === jobId);

  // if (!jobObj) {
  //   return res.status(404).json({ message: 'Job not found' });
  // }

  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();  // create a new customer
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2022-11-15'}
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 1099,
    currency: 'eur',
    customer: customer.id,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: 'pk_test_51NHa2fFZCkcI5HR1kpOXexOzI61wxVVvBszimUy0LnWPh1oEtJNSewDt1YJJ5XhTPNh1KP1WtNZqcRG2o1uHdy5A00338Mm9pJ'
  });
});

module.exports = router;
