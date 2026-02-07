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
import { configDotenv } from 'dotenv'
configDotenv()
const frontendDomain = process.env.FRONTEND_DOMAIN
if (!frontendDomain) throw new Error('FRONTEND_DOMAIN IS UNDEFINED')

const normalizeOrigin = (o) => (o ? o.replace(/\/$/, '').trim() : o)

const allowedOrigins = [
  normalizeOrigin(process.env.FRONTEND_DOMAIN),
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:4173',
  'http://127.0.0.1:4173',
].filter(Boolean)
console.log('Frotend domain', frontendDomain)
console.log('Allowed origins', allowedOrigins)
const port = process.env.PORT || 3000

const corsOptions = {
  origin: (origin, cb) => {
    if (!origin) {
      return cb(null, true)
    }
    const o = normalizeOrigin(origin)
    if (allowedOrigins.includes(o)) return cb(null, true)
    return cb(new Error(`CORS blocked for origin: ${origin}`))
  },
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
  optionsSuccessStatus: 200,
  credentials: true,
}
const app = express()
app.post('/webhook', checkoutController.hook)
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))
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
  console.log('App server started at http://localhost:' + port)
})
