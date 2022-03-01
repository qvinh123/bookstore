const stripe = require('stripe')(process.env.STRIPE_SERCET_KEY)
const catchAsyncError = require('../middlewares/catchAsyncError')

// route :  POST api/payment/process
// desc  :  Process stripe payments
// access:  private - User
exports.processPayment = catchAsyncError(async (req, res, next) => {

    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: 'vnd',

        metadata: { integration_check: 'accept_a_payment' }
    });

    res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret
    })
})

// route :  POST /api/stripeapi
// desc  : Send stripe API Key
// access:  private - User
exports.getStripApi = catchAsyncError(async (req, res, next) => {

    res.status(200).json({
        stripeApiKey: process.env.STRIPE_API_KEY
    })

})