import { pool } from '../db/pool.js'
import { camelize } from '../utils/camelize.js'

export async function createOrder(client = pool, userId, checkoutSessionId) {
  const { rows } = await client.query(
    `INSERT INTO orders (user_id, checkout_session_id) VALUES ($1, $2) RETURNING id`,
    [userId, checkoutSessionId]
  )
  return camelize(rows[0])
}

export async function createOrderItem(client = pool, orderId, item) {
  const { rows } = await client.query(
    `INSERT INTO order_items (order_id, variant_id, price, quantity)
     VALUES ($1, $2, $3, $4)`,
    [orderId, item.variantId, item.price, item.quantity]
  )
}

export async function getOrdersByUserId(userId) {
  const { rows } = await pool.query(
    `
    SELECT 
      o.id,
      o.date::text,
      SUM(oi.price * oi.quantity) FILTER (WHERE oi.id IS NOT NULL) AS order_total,
      o.status,
      SUM(oi.quantity) FILTER (WHERE oi.id IS NOT NULL) AS total_items,
      json_agg(
          json_build_object(
              'order_item_id', oi.id,
              'quantity', oi.quantity,
              'unit_price', oi.price,
              'variant_id', pv.id,
              'package', pkg.display_name,
              'product_name', p.name,
              'image', img.image_json
          )
      ) FILTER (WHERE oi.id IS NOT NULL) AS items
    FROM orders o
    LEFT JOIN order_items oi
        ON oi.order_id  = o.id
    LEFT JOIN product_variants pv
        ON oi.variant_id = pv.id
    LEFT JOIN products p
        ON p.id = pv.product_id
    LEFT JOIN packages pkg
        ON pkg.id = pv.package_id
    LEFT JOIN LATERAL (
      SELECT json_build_object(
      'image_id', i.id,
      'asset_id', a.id,
      'url', a.url
      ) AS image_json
      FROM product_images i 
      JOIN assets a
        ON a.id = i.asset_id
      WHERE i.product_id = p.id AND a.width = 150
      LIMIT 1
    ) img ON TRUE
    WHERE o.user_id = $1
    GROUP BY o.id,  o.date, o.status
    ORDER BY o.date DESC;
    `,
    [userId]
  )

  console.log(rows[0].items)
  return camelize(rows)
}
