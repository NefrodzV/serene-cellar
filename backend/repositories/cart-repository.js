import db from '../db/index.js'

export async function getCartByUserId(userId) {
  const { rows } = await db.query(
    `
        SELECT id 
        FROM cart 
        WHERE user_id=$1`,
    [userId]
  )

  return rows[0] || null
}

export async function getCartItemsWithProductData(cartId) {
  const { rows } = await db.query(
    `SELECT 
        ci.id, 
        ci.quantity, 
        ci.unit_price AS price, 
        ci.unit_type AS "unitType",
        ARRAY_REMOVE(ARRAY[
          CASE WHEN p.stock < ci.quantity THEN 'INSUFFICIENT_STOCK' END,
          CASE WHEN p.stock <= 0 THEN 'OUT_OF_STOCK' END,
          CASE WHEN p.active = false THEN 'PRODUCT_UNAVAILABLE' END], null)
        AS errors,
        CASE
          WHEN p.active = false THEN false
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
        WHERE cart_id=$1`,
    [cartId]
  )

  return rows
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
  cartId,
  productId,
  unitType
) {
  const { rows } = await db.query(
    `
        SELECT id FROM cart_items
        WHERE product_id=$1 AND unit_type=$2 AND cart_id=$3`,
    [productId, unitType, cartId]
  )
  return rows[0] || null
}

export async function createCartItem(
  cartId,
  productId,
  quantity,
  unitPrice,
  unitType
) {
  await db.query(
    `INSERT INTO cart_items 
        (product_id, cart_id, quantity, unit_price, unit_type)
        VALUES ($1, $2, $3, $4, $5)`,
    [productId, cartId, quantity, unitPrice, unitType]
  )
}

export async function deleteCartItem(itemId) {
  await db.query(
    `DELETE FROM cart_items 
        WHERE id=$1`,
    [itemId]
  )
}

export async function getItemsByCartId(cartId) {
  const { rows } = await db.query(
    `
        SELECT 
        product_id,
        unit_type 
        FROM cart_items 
        WHERE cart_id=$1`,
    [cartId]
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
