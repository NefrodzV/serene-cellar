import Stripe from 'stripe'
import passport from '../config/passport-config.js'
import express from 'express'
import {userRepository} from '../repositories/user-repository.js'
import { configDotenv } from 'dotenv'
configDotenv()

const endpointSecret = process.env.WEBHOOK_SECRET
const frontendDomain = process.env.FRONTEND_DOMAIN
const stripeSecret = process.env.STRIPE_SECRET

const stripe = new Stripe(stripeSecret)

export const createSession = [
    passport.authenticate('jwt', {session:false}),
    async (req, res) => {
        const user = await userRepository.getUserById(req.user.id)
        let customerId = user?.customerId
        let customer 
        if(!customerId) {
            customer = await stripe.customers.create({
                name: `${user.name} ${user.lastName}`,
                email: user.email
            })

            await userRepository.updateUserCustomerId(user.id, customer.id)
            customerId = customer.id
        }

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            // line_items: {
            //     price: 'price_1Q'
            // }
            mode: 'payment',
            success_url: `${frontendDomain}/checkout/success?sessionId={CHECKOUT_SESSION_ID}`,
            cancel_url: `${frontendDomain}/checkout/cancel`
        })

        return res.json({ url: session.url })
    }
]
export const hook = [
    express.raw({type: 'application/json'}),
    (req, res) => {
        const sig = req.headers['stripe-signature']
        let event
        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
        } catch(err) {
            console.log('Stripe hook error:', hook)
            return res.sendStatus(400)
        }
        console.log('Event type:', event.type)
        return  res.sendStatus(200)
    }
]