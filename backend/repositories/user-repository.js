import { pool } from '../db/pool.js'
import { camelize } from '../utils/camelize.js'
export const userRepository = {
  async findByEmail(email) {
    const { rows } = await pool.query(`SELECT *  FROM users WHERE email=$1`, [
      email,
    ])
    return rows[0]
  },

  async createUserWithEmail({ firstName, lastName, password, email }) {
    const client = await pool.connect()
    try {
      await client.query(`BEGIN`)
      const { rows } = await pool.query(
        `INSERT INTO users (email, password, first_name, last_name)
            VALUES ($1,$2,$3,$4) RETURNING id, first_name, last_name`,
        [email, password, firstName, lastName]
      )

      // Creating cart
      await pool.query(`INSERT INTO carts (user_id) VALUES($1)`, [rows[0].id])
      await client.query('COMMIT')
      return camelize(rows[0])
    } catch (e) {
      await client.query('ROLLBACK')
      throw e
    } finally {
      client.release()
    }
  },

  async getUserById(id) {
    const { rows } = await pool.query('SELECT * FROM users WHERE id=$1', [id])
    return camelize(rows[0])
  },
}
