import { db } from '../db/index.js'
import { camelize } from '../utils/camelize.js'

export async function createOrder(client = db.pool, userId, checkoutSessionId) {
  const { rows } = await client.query(
    `INSERT INTO orders (user_id, checkout_session_id) VALUES ($1, $2) RETURNING id`,
    [userId, checkoutSessionId]
  )
  return camelize(rows[0])
}

export async function createOrderItem(client = db.pool, orderId, item) {
  const { rows } = await client.query(
    `INSERT INTO order_items (order_id, variant_id, price, quantity)
     VALUES ($1, $2, $3, $4)`,
    [orderId, item.variantId, item.price, item.quantity]
  )
}
