import pg from 'pg'
import { config, configDotenv } from 'dotenv'
import { sleep } from '../utils/index.js'
configDotenv()
const { Pool } = pg

const nodeEnv = process.env.NODE_ENV

console.log('NODE ENV', nodeEnv)
const postgresUrl = process.env.POSTGRES_URL
if (nodeEnv === 'production' && !postgresUrl)
    throw new Error('Postgres database url is undefined')
const pgConfig =
    nodeEnv === 'production'
        ? { connectionString: postgresUrl }
        : {
              host: process.env.DB_HOST,
              user: process.env.ROLE_NAME,
              database: process.env.DATABASE,
              password: process.env.ROLE_PASSWORD,
              port: 5432,
          }

export const pool = new Pool(pgConfig)

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

export async function queryWithRetries(queryCallback, { retries = 4 } = {}) {
    const delays = [0, 800, 1600, 3200, 5000]
    const MAX_RETRIES = delays.length
    if (retries > MAX_RETRIES) {
        throw new Error('Only a max of 4 retries allowed')
    }
    for (let attempt = 0; attempt < retries; attempt++) {
        if (delays[attempt]) {
            await sleep(delays[attempt])
        }

        try {
            return await queryCallback()
        } catch (e) {
            const netRetry = new Set([
                'ECONNREFUSED',
                'ETIMEDOUT',
                'ECONNRESET',
            ])
            if (!netRetry.has(e.code)) throw e
            if (attempt + 1 >= retries) {
                throw e
            }
        }
    }
}
