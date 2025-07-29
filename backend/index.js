import express from 'express'
import cors from 'cors'
import {
  productsRouter,
  userRouter,
  authRouter,
  cartRouter,
} from './routers/index.js'
import cookieParser from 'cookie-parser'
import { errorHandler } from './middlewares/errorHandler.js'
const app = express()
const port = 3000
const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'DELETE', 'PUT'],
  optionsSuccessStatus: 200,
  credentials: true,
}
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/products', productsRouter)
app.use('/auth', authRouter)
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
