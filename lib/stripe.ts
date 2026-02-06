import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
})

export async function createPaymentIntent(amount: number, metadata?: Record<string, string>) {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'usd',
    metadata,
  })

  return paymentIntent
}

export async function getPaymentIntent(id: string) {
  return await stripe.paymentIntents.retrieve(id)
}

export async function confirmPaymentIntent(id: string) {
  return await stripe.paymentIntents.retrieve(id)
}
