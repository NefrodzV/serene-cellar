import pg from 'pg'
import { configDotenv } from 'dotenv'
configDotenv()
const { Pool } = pg
const poolConfig = {
  host: process.env.DB_HOST,
  user: process.env.ROLE_NAME,
  database: process.env.DATABASE,
  password: process.env.ROLE_PASSWORD,
  port: 5432,
}

export const pool = new Pool(poolConfig)

export async function withTransaction(func) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await func(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Error with transaction', error)
  } finally {
    client.release()
  }
}
