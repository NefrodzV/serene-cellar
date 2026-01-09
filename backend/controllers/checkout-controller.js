import Stripe from 'stripe'
import passport from '../config/passport-config.js'
import express from 'express'
import { userRepository } from '../repositories/user-repository.js'
import { configDotenv } from 'dotenv'
import { getItemsForStripe } from '../repositories/cart-repository.js'
import {
  createOrder,
  createOrderItem,
} from '../repositories/order-repository.js'
import { withTransaction } from '../db/pool.js'
configDotenv()

const webhookSecret = process.env.WEBHOOK_SECRET
const frontendDomain = process.env.FRONTEND_DOMAIN
const stripeSecret = process.env.STRIPE_SECRET

if (!stripeSecret) throw new Error('STRIPE_SECRET is undefined')
const stripe = new Stripe(stripeSecret)

export const createSession = [
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    const cartItems = await getItemsForStripe(req.user.id)

    const session = await stripe.checkout.sessions.create({
      line_items: cartItems.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(item.amount * 100), // calculate price from numeric to cents
          product_data: {
            name: `${item.name} (${item.displayName})`,
            metadata: {
              variant_id: item.variantId,
            },
          },
        },
      })),
      mode: 'payment',
      success_url: `${frontendDomain}/checkout/success?sessionId={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendDomain}/checkout/cancel`,
      metadata: {
        user_id: req.user.id,
      },
    })

    return res.json({ url: session.url })
  },
]
export const hook = [
  express.raw({ type: 'application/json' }),
  async (req, res, next) => {
    const sig = req.headers['stripe-signature']
    let event
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object
        const lineItems = await stripe.checkout.sessions.listLineItems(
          session.id,
          {
            expand: ['data.price.product'],
          }
        )
        const items = lineItems.data.map((item) => ({
          variantId: parseInt(item.price.product.metadata.variant_id, 10),
          quantity: item.quantity,
          price: (item.price.unit_amount / 100).toFixed(2), // Calculate numeric price from cents
        }))
        const userId = parseInt(session.metadata.user_id, 10)
        await withTransaction(async (client) => {
          const order = await createOrder(client, userId, session.id)
          for (const item of items) {
            await createOrderItem(client, order.id, item)
          }
        })
      }
    } catch (err) {
      next(err)
    }
    // console.log('Event type:', event.type)
    return res.sendStatus(200)
  },
]
