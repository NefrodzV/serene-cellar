import { passport } from '../config/index.js'
import { getOrdersByUserId } from '../repositories/order-repository.js'

export const getOrders = [
    passport.authenticate('jwt', { session: false }),
    async (req, res, next) => {
        try {
            const userId = req.user.id
            const orders = await getOrdersByUserId(userId)
            return res.json({ orders })
        } catch (error) {
            next(error)
        }
    },
]
