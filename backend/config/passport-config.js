import passport from 'passport'
import passportJwt from 'passport-jwt'
import { configDotenv } from 'dotenv'
import { pool } from '../db/pool.js'
configDotenv()

const secret = process.env.JWT_SECRET

if (!secret) throw new Error('JWT secret is undefined')

const JwtStrategy = passportJwt.Strategy

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: (req) => {
        let token = null
        if (req && req.cookies) {
          token = req.cookies['serene']
        }
        return token
      },
      secretOrKey: secret,
    },
    async (jwt_payload, done) => {
      try {
        const { userId } = jwt_payload
        const { rows } = await pool.query('SELECT * FROM users WHERE id=$1', [
          userId,
        ])
        if (rows.length === 0) return done(null, false)
        const user = rows[0]
        return done(null, user)
      } catch (error) {
        console.error('Database query error', error)
        return done(error, false)
      }
    }
  )
)

export default passport
