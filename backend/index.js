import express from 'express'
import cors from 'cors'
import {
  productsRouter,
  userRouter,
  authRouter,
  cartRouter,
  checkoutRouter,
} from './routers/index.js'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middlewares/errorHandler.js'
import { checkoutController } from './controllers/index.js'
2
const app = express()
const port = 3000
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  optionsSuccessStatus: 200,
  credentials: true,
}
app.post('/webhook', checkoutController.hook)
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/products', productsRouter)
app.use('/auth', authRouter)
app.use('/checkout', checkoutRouter)
app.use(userRouter)
app.use(cartRouter)
app.use('/images', express.static('images'))
app.get('/', (req, res) => {
  res.send('Hello! Serene Cellar!')
})
app.use(errorHandler)
app.listen(port, () => {
  console.log('App server started at http://localhost:3000')
})
