import express from 'express'

const router = express.Router()

router.get('/', (req, res) => res.json({ message: 'User cart items' }))
// TODO: Make endpoint for update, delete and add
export default router
