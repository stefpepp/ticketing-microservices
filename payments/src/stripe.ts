import { Stripe } from './fake_libs/stripe-type';

const stripe = new Stripe(process.env.STRIPE_KEY!, {
    api_version: '2020-02-03'
});

export { stripe as fakeStripe };