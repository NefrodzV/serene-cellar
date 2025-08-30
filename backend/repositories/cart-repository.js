import db from '../db/index.js'
import { camelize } from '../utils/camelize.js'

export async function getCartByUserId(userId) {
  const { rows } = await db.query(
    `
    SELECT 
    bool_and(item.purchasable) as can_checkout,
    SUM(item.quantity * item.unit_price) as subtotal,
    json_agg(item) as items
    FROM
    (SELECT 
        ci.id, 
        ci.quantity, 
        ci.unit_price, 
        ci.unit_type,
        ARRAY_REMOVE(ARRAY[
          CASE WHEN p.stock < ci.quantity THEN 'INSUFFICIENT_STOCK' END,
          CASE WHEN p.stock <= 0 THEN 'OUT_OF_STOCK' END,
          CASE WHEN p.status <> 'active' THEN 'PRODUCT_UNAVAILABLE' END], null)
        AS errors,
        CASE
          WHEN p.status <> 'active' THEN false
          WHEN p.stock <= 0 THEN false
          WHEN ci.quantity > p.stock THEN false
          ELSE true
        END AS purchasable,
        p.name,
        p.slug,
        p.stock,
        (   
            SELECT
            jsonb_object_agg(pi.device_type, pi.image_url)
            FROM product_images pi
            WHERE pi.product_id = p.id
        ) as images
        FROM cart_items ci
        INNER JOIN products p ON ci.product_id = p.id
        WHERE cart_id=(SELECT id FROM cart where user_id = $1)) item
        `,
    [userId]
  )

  return camelize(rows) || null
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

export async function getCartItemByCartProductAndUnit(
  userId,
  productId,
  unitType
) {
  const { rows } = await db.query(
    `
        SELECT id FROM cart_items
        WHERE product_id=$1 AND unit_type=$2 AND
        cart_id=(SELECT id from cart WHERE user_id=$3)`,
    [productId, unitType, userId]
  )
  return rows[0] || null
}

export async function createCartItem(
  userId,
  productId,
  quantity,
  unitPrice,
  unitType
) {
  await db.query(
    `INSERT INTO cart_items 
        (product_id, cart_id, quantity, unit_price, unit_type)
        VALUES ($1, (SELECT id from cart WHERE user_id=$2), $3, $4, $5)`,
    [productId, userId, quantity, unitPrice, unitType]
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
        unit_type 
        FROM cart_items 
        WHERE cart_id=(SELECT id from cart WHERE=$1)`,
    [userId]
  )

  return rows
}

export async function createUserCart(userId) {
  await db.query(
    `
        INSERT INTO cart
        (user_id) VALUES ($1)`,
    [userId]
  )
}
