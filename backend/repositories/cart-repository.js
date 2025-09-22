import db from '../db/index.js'
import { validate } from '../middlewares/validationHandler.js'
import { camelize } from '../utils/camelize.js'

export async function getCartByUserId(userId) {
  const { rows } = await db.query(
    `
    SELECT 
    COALESCE(bool_and(item.purchasable), false) as can_checkout,
    COALESCE(SUM(line_total), 0) as subtotal,
    COALESCE(SUM(final_line_total), 0) as total,
    COALESCE(json_agg(item), '[]') as items,
    COALESCE(SUM(item.quantity), 0) as total_items,
    CASE 
      WHEN COALESCE(SUM(item.quantity), 0) > 0 THEN false
      ELSE true
    END as is_empty
    FROM
    (
        SELECT 
        p.name,
        ci.id, 
        ci.quantity, 
        pr.value as price, 
        pr.unit,
        p.discount_percent,
        pr.stock_quantity as stock,
        (p.discount_percent <> 0 AND p.discount_percent IS NOT NULL) as has_discount,
        CASE WHEN p.discount_percent <> 0
          THEN ROUND(ci.quantity * (pr.value - (pr.value * p.discount_percent/100)), 2)
          ELSE ci.quantity * pr.value
        END as final_line_total,
        (pr.value * ci.quantity) as line_total,
        CASE
          WHEN p.discount_percent IS NOT NULL 
          THEN ROUND(pr.value - (pr.value * p.discount_percent / 100), 2)
          ELSE pr.value
        END as final_unit_price,
        ARRAY_REMOVE(ARRAY[
          CASE WHEN 
          pr.stock_quantity < ci.quantity THEN 'INSUFFICIENT_STOCK' END,
          CASE WHEN pr.stock_quantity = 0 THEN 'OUT_OF_STOCK' END,
          CASE WHEN p.status <> 'active' THEN 'PRODUCT_UNAVAILABLE' END], null)
        AS errors,
        CASE
          WHEN p.status <> 'active' THEN false
          WHEN pr.stock_quantity = 0 THEN false
          WHEN ci.quantity > COALESCE(pr.stock_quantity ,0) THEN false
          ELSE true
        END AS purchasable,
        (
          SELECT json_build_object(
            'thumbnail', json_object_agg(
              (regexp_match(pi.image_url, '([0-9]+)(?=\\.[A-Za-z0-9]+$)'))[1],
              pi.image_url
            ) FILTER (WHERE pi.image_url ILIKE '%thumb%'),
             'gallery', json_object_agg(
              (regexp_match(pi.image_url, '([0-9]+)(?=\\.[A-Za-z0-9]+$)'))[1],
              pi.image_url
            ) FILTER (WHERE pi.image_url NOT ILIKE '%thumb%')

          )
          FROM product_images pi
          WHERE pi.product_id = p.id
        ) AS images
        FROM cart_items ci
        INNER JOIN prices pr ON pr.id = ci.price_id
        INNER JOIN products p ON p.id = pr.product_id
        WHERE cart_id=(SELECT id FROM cart where user_id = $1)
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
        cart_id=(SELECT id from cart WHERE user_id=$2)`,
    [priceId, userId]
  )
  return rows[0] || null
}

export async function createCartItem(userId, quantity, priceId) {
  await db.query(
    `INSERT INTO cart_items 
        (cart_id, quantity, price_id)
        VALUES ((SELECT id from cart WHERE user_id=$1), $2, $3)`,
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
        INSERT INTO cart
        (user_id) VALUES ($1)`,
    [userId]
  )
}

export async function validateLocalCartItems(items) {
  console.log(items)
  const values = items
    .map(
      (_, i) =>
        `(CAST($${i * 3 + 1} AS text),CAST($${i * 3 + 2} AS int), CAST($${i * 3 + 3} AS int))`
    )
    .join(',')
  const params = items
    .map((item) => [
      String(item.id),
      Number(item.quantity),
      Number(item.priceId),
    ])
    .flat()
  const { rows } = await db.query(
    `
      SELECT 
      COALESCE(bool_and(item.purchasable), false) as can_checkout,
      COALESCE(SUM(line_total), 0) as subtotal,
      COALESCE(SUM(final_line_total), 0) as total,
      COALESCE(json_agg(item), '[]') as items,
      COALESCE(SUM(item.quantity), 0) as total_items
      FROM 
      (
        SELECT 
        p.name,
        lc.id,
        lc.price_id,
        lc.quantity, 
        pr.unit,
        pr.value as price,
        pr.stock_quantity as stock,
        (pr.value * lc.quantity) as line_total,
        (p.discount_percent <> 0 AND p.discount_percent IS NOT NULL) as has_discount,
        ARRAY_REMOVE(ARRAY[
            CASE WHEN 
            pr.stock_quantity < lc.quantity THEN 'INSUFFICIENT_STOCK' END,
            CASE WHEN pr.stock_quantity = 0 THEN 'OUT_OF_STOCK' END,
            CASE WHEN p.status <> 'active' THEN 'PRODUCT_UNAVAILABLE' END], null)
        AS errors,
        CASE WHEN p.discount_percent <> 0
            THEN ROUND(lc.quantity * (pr.value - (pr.value * p.discount_percent/100)), 2)
            ELSE lc.quantity * pr.value
        END as final_line_total,
        (
            SELECT json_build_object(
              'thumbnail', json_object_agg(
                (regexp_match(pi.image_url, '([0-9]+)(?=\\.[A-Za-z0-9]+$)'))[1],
                pi.image_url
              ) FILTER (WHERE pi.image_url ILIKE '%thumb%'),
              'gallery', json_object_agg(
                (regexp_match(pi.image_url, '([0-9]+)(?=\\.[A-Za-z0-9]+$)'))[1],
                pi.image_url
              ) FILTER (WHERE pi.image_url NOT ILIKE '%thumb%')

            )
            FROM product_images pi
            WHERE pi.product_id = p.id
        ) AS images,
        CASE
            WHEN p.status <> 'active' THEN false
            WHEN pr.stock_quantity  = 0 THEN false
            WHEN lc.quantity > COALESCE(pr.stock_quantity ,0) THEN false
            ELSE true
        END AS purchasable,
        CASE
          WHEN p.discount_percent IS NOT NULL 
          THEN ROUND(pr.value - (pr.value * p.discount_percent / 100), 2)
          ELSE pr.value
        END as final_unit_price
        FROM 
        (VALUES ${values}) as lc(id, quantity, price_id)
        JOIN prices pr ON pr.id = lc.price_id
        JOIN products p ON p.id = pr.product_id
      ) item
    `,
    params
  )

  console.dir(rows, { depth: null })
  return camelize(rows[0]) || null
}
