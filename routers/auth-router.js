import express from 'express'
import { authController } from '../controllers/index.js'
const router = express.Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/google', (req, res) => res.send('Google login working'))

export default router
