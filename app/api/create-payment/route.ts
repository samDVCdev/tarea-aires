import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ticketId, amount, description } = body

    if (!ticketId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        ticketId,
      },
    })

    // Save payment to database
    const supabase = await createClient()
    const { error: dbError } = await supabase
      .from('payments')
      .insert([
        {
          ticket_id: ticketId,
          amount,
          stripe_payment_intent_id: paymentIntent.id,
          description: description || '',
          status: 'pendiente',
        },
      ])

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save payment' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}
