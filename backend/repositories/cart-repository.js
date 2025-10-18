import db from '../db/index.js'
import { validate } from '../middlewares/validationHandler.js'
import { camelize } from '../utils/camelize.js'

export async function getCartByUserId(userId) {
  const { rows } = await db.query(
    `
      SELECT 
      COALESCE(bool_and(item.purchasable), false) as can_checkout,
      COALESCE(SUM(item.quantity), 0) = 0 AS is_empty,
      COALESCE(SUM(item.line_total),0) AS total,
      COALESCE(SUM(item.quantity), 0) AS total_items,
      COALESCE(json_agg(item), '[]'::json) AS items
      FROM (
        SELECT 
        ci.id,
        ci.quantity,
        pv.stock,
        p.amount AS price,
        COALESCE(pv.stock, 0) > 0 AND pv.stock >= ci.quantity AS purchasable,
        ROUND(ci.quantity * p.amount, 2) as line_total,
        CASE
          WHEN pv.stock = 0 THEN 'OUT_OF_STOCK'
          WHEN ci.quantity > pv.stock THEN 'INSUFFICIENT_STOCK'
          ELSE NULL
        END AS error,
        (
          SELECT jsonb_object_agg(role, role_images) 
          FROM (
            SELECT
            pi.role,
            jsonb_object_agg(a.width, a.url) AS role_images
            FROM product_images pi
            INNER JOIN assets a ON a.id= pi.asset_id
            WHERE pi.product_id = pv.product_id 
            GROUP BY pi.role
          ) grouped
        ) AS images
        FROM cart_items ci
        INNER JOIN prices p ON p.id = ci.price_id
        INNER JOIN product_variants pv ON pv.id = p.variant_id
        WHERE cart_id = (SELECT id FROM carts WHERE user_id=$1)
      ) item 
    `,
    [userId]
  )
  return camelize(rows[0]) || null
}

export async function setCartItemQuantity(itemId, quantity) {
  await db.query(
    `
      UPDATE cart_items
      SET quantity=$1
      WHERE id=$2`,
    [quantity, itemId]
  )
}
export async function incrementCartItemQuantity(itemId, quantity) {
  await db.query(
    `
        UPDATE cart_items
        SET quantity = GREATEST(quantity + $1, 0)
        WHERE id=$2
        `,
    [quantity, itemId]
  )
}

export async function getCartItemByPriceId(userId, priceId) {
  const { rows } = await db.query(
    `
        SELECT id FROM cart_items
        WHERE price_id=$1 AND
        cart_id=(SELECT id from carts WHERE user_id=$2)`,
    [priceId, userId]
  )
  return rows[0] || null
}

export async function createCartItem(userId, quantity, priceId) {
  await db.query(
    `INSERT INTO cart_items 
        (cart_id, quantity, price_id)
        VALUES ((SELECT id from carts WHERE user_id=$1), $2, $3) ON CONFLICT(price_id) DO UPDATE SET quantity = EXCLUDED.quantity + cart_items.quantity`,
    [userId, quantity, priceId]
  )
}

export async function deleteCartItem(itemId) {
  await db.query(
    `DELETE FROM cart_items 
        WHERE id=$1`,
    [itemId]
  )
}

export async function getItemsByUserId(userId) {
  const { rows } = await db.query(
    `
        SELECT 
        product_id,
        price_id 
        FROM cart_items 
        WHERE cart_id=(SELECT id from cart WHERE user_id=$1)`,
    [userId]
  )

  return rows
}

export async function createUserCart(userId) {
  await db.query(
    `
        INSERT INTO carts
        (user_id) VALUES ($1)`,
    [userId]
  )
}

export async function validateLocalCartItems(items) {
  console.log(items)
  const values = items
    .map((_, i) => `(CAST($${i * 2 + 1} AS int),CAST($${i * 2 + 2} AS int))`)
    .join(',')
  const params = items
    .map((item) => [Number(item.priceId), Number(item.quantity)])
    .flat()
  const { rows } = await db.query(
    `
      SELECT 
      COALESCE(bool_and(item.purchasable), false) AS can_checkout,
      COALESCE(ROUND(SUM(line_total), 2), 0) AS total,
      COALESCE(SUM(item.quantity), 0) AS total_items
      COALESCE(json_agg(item), '[]') AS items,
      COALESCE(SUM(item.quantity), 0) = 0 AS is_empty,
      FROM 
      (
       SELECT 
        lc.price_id,
        pr.name,
        lc.quantity,
        ROUND(lc.quantity * p.amount, 2) AS line_total,
        COALESCE(pv.stock, 0) > 0 AND pv.stock >= lc.quantity AS purchasable,
        p.amount AS price,
        CASE
          WHEN pv.stock = 0 THEN 'OUT_OF_STOCK'
          WHEN lc.quantity > pv.stock THEN 'INSUFFICIENT_STOCK'
          ELSE NULL
        END AS error,
        (
          SELECT jsonb_object_agg(role, role_images) 
          FROM (
            SELECT
            pi.role,
            jsonb_object_agg(a.width, a.url) AS role_images
            FROM product_images pi
            INNER JOIN assets a ON a.id= pi.asset_id
            WHERE pi.product_id = pv.product_id 
            GROUP BY pi.role
          ) grouped
        ) AS images
        FROM 
        (VALUES ${values}) AS lc(price_id, quantity)
        INNER JOIN prices p ON p.id = lc.price_id
        INNER JOIN product_variants pv ON pv.id = p.variant_id
        INNER JOIN products pr ON pr.id = pv.product_id
      ) item
    `,
    params
  )

  console.dir(rows, { depth: null })
  return camelize(rows[0]) || null
}
