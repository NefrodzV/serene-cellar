import db from '../db/index.js'
import { camelize } from '../utils/camelize.js'

export async function getCartByUserId(userId) {
  const { rows } = await db.query(
    `
    SELECT 
    COALESCE(bool_and(item.purchasable), false) as can_checkout,
    COALESCE(SUM(line_total), 0) as subtotal,
    COALESCE(json_agg(item), '[]') as items,
    COALESCE(SUM(item.quantity), 0) as total_items,
    CASE 
      WHEN COALESCE(SUM(item.quantity), 0) > 0 THEN false
      ELSE true
    END as is_empty
    FROM
    (SELECT 
        p.name,
        ci.id, 
        ci.quantity, 
        ci.unit_price, 
        ci.unit_type,
        p.discount_percent,
        (p.discount_percent <> 0 AND p.discount_percent IS NOT NULL) as has_discount,
        CASE WHEN p.discount_percent <> 0
          THEN ROUND(ci.quantity * (ci.unit_price - (ci.unit_price * p.discount_percent/100)), 2)
          ELSE ci.quantity * ci.unit_price 
        END as final_line_total,
        (ci. unit_price * ci.quantity) as line_total,
        (
          SELECT pr.stock_quantity FROM prices pr 
          WHERE ci.product_id = pr.product_id AND pr.unit = ci.unit_type
        ) as stock,
        CASE
          WHEN p.discount_percent IS NOT NULL 
          THEN ROUND(ci.unit_price - (ci.unit_price * p.discount_percent / 100), 2)
          ELSE unit_price
        END as final_unit_price,
        ARRAY_REMOVE(ARRAY[
          CASE WHEN 
          (
            SELECT pr.stock_quantity FROM prices pr 
            WHERE ci.product_id = pr.product_id AND ci.unit_type = pr.unit
          ) < ci.quantity THEN 'INSUFFICIENT_STOCK' END,
          CASE WHEN (
            SELECT pr.stock_quantity FROM prices pr 
            WHERE ci.product_id = pr.product_id AND ci.unit_type = pr.unit
          ) = 0 THEN 'OUT_OF_STOCK' END,
          CASE WHEN p.status <> 'active' THEN 'PRODUCT_UNAVAILABLE' END], null)
        AS errors,
        CASE
          WHEN p.status <> 'active' THEN false
          WHEN (
            SELECT pr.stock_quantity FROM prices pr 
            WHERE ci.product_id = pr.product_id AND ci.unit_type = pr.unit
          ) = 0 THEN false
          WHEN ci.quantity > COALESCE((
            SELECT pr.stock_quantity FROM prices pr 
            WHERE ci.product_id = pr.product_id AND ci.unit_type = pr.unit
          ),0) THEN false
          ELSE true
        END AS purchasable,
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
