import { passport } from '../config/index.js'
import pool from '../pool.js'
const getCart = [
    passport.authenticate('jwt', { session: false }),
    async (req, res) => {
        const user = req.user
        try {
            const { rows } = await pool.query(
                `SELECT 
                ci.id, 
                ci.quantity, 
                ci.unit_price, 
                ci.unit_type,
                ci.product_id,
                json_object_agg(DISTINCT pi.device_type, pi.image_url) as images
                FROM cart c
                INNER JOIN cart_items ci ON c.id = ci.cart_id
                INNER JOIN product_images pi ON ci.product_id = pi.product_id
                WHERE c.user_id = $1
                GROUP BY   
                ci.id, 
                ci.quantity, 
                ci.unit_price, 
                ci.unit_type,
                ci.product_id`,
                [user.id]
            )
            return res.json({
                cart: rows,
            })
        } catch (error) {
            console.error('[DB QUERY ERROR] ', error)
            return res.status(500).json({ error: 'Something went wrong' })
        }
    },
]

export default {
    getCart,
}
