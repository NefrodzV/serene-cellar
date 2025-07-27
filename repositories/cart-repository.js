import db from '../db/index.js'

export async function getCardByUserId(userId) {
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
        ci.unit_type,
        p.name,
        p.slug,
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

export async function updateCartItemQuantity(itemId, quantity) {
    await pool.query(
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
    const { rows } = await pool.query(
        `
        SELECT id FROM cart_items
        WHERE product_id=$1 AND unit_type=$2 AND cart_id=$3
        )`,
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
    await pool.query(
        `INSERT INTO cart_items 
        (product_id, cart_id, quantity, unit_price, unit_type)
        VALUES ($1, $2, $3, $4, $5)`,
        [productId, cartId, quantity, unitPrice, unitType]
    )
}

export async function deleteCartItem(itemId) {
    await pool.query(
        `DELETE FROM cart_items 
        WHERE id=$1`,
        [itemId]
    )
}
