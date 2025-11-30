import { passport } from '../config/index.js'
import { getOrdersByUserId } from '../repositories/order-repository.js'

export const getOrders = [
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    console.log('running')
    try {
      const userId = req.user.id
      const orders = await getOrdersByUserId(userId)
      console.log(orders)
      return res.json({ orders })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ error: 'Internal server error' })
    }
  },
]
