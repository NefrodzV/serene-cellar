import db from '../db/index.js'
import { camelize } from '../utils/camelize.js'
export const userRepository = {
  async findByEmail(email) {
    const { rows } = await db.query(`SELECT *  FROM users WHERE email=$1`, [
      email,
    ])
    return rows[0]
  },

  async createUserWithEmail({ firstName, lastName, password, email }) {
    const client = await db.connect()
    try {
      await client.query(`BEGIN`)
      const { rows } = await db.query(
        `INSERT INTO users (email, password, first_name, last_name)
            VALUES ($1,$2,$3,$4) RETURNING id, first_name, last_name`,
        [email, password, firstName, lastName]
      )

      // Creating cart
      await db.query(`INSERT INTO carts (user_id) VALUES($1)`, [rows[0].id])
      await client.query('COMMIT')
      return camelize(rows[0])
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
  },

  async createUserWithTwitter({ twitterId, username }) {
    const { rows } = await db.query(
      `INSERT INTO users (twitter_id, username)
            VALUES ($1,$2) RETURNING id`,
      [twitterId, username]
    )

    return rows[0]
  },

  async createUserWithGoogle({ googleId, email, username }) {
    const { rows } = await db.query(
      `INSERT INTO users (google_id, username, email)
            VALUES ($1,$2,$3) RETURNING id`,
      [googleId, username, email]
    )

    return rows[0]
  },

  async findByGoogleId(id) {
    const { rows } = await db.query(
      `SELECT * FROM users 
            WHERE google_id=$1`,
      [id]
    )
    return rows[0]
  },

  async findByTwitterId(id) {
    const { rows } = await db.query(
      `SELECT *  FROM users 
            WHERE twitter_id=$1`,
      [id]
    )
    return rows[0]
  },
}
