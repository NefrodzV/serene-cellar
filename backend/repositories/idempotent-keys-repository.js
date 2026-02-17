import { pool } from '../db/pool.js'
import { camelize } from '../utils/camelize.js'

export async function claim(key, userId, client = pool) {
    const { rowCount } = await client.query(
        `
        INSERT INTO 
        idempotency_keys(key, user_id)
        VALUES($1, $2)
        ON CONFLICT(key, user_id) 
        DO NOTHING
        RETURNING key`,
        [key, userId]
    )

    return rowCount === 1
}

export async function find(key, userId, client = pool) {
    const { rows } = await client.query(
        `
        SELECT response, status
        FROM idempotency_keys
        WHERE user_id = $1 AND key = $2`,
        [userId, key]
    )
    return camelize(rows[0])
}

export async function storeResult(
    key,
    statusCode,
    userId,
    response,
    client = pool
) {
    await client.query(
        `
        UPDATE idempotency_keys SET status_code=$1, response=$2::json WHERE user_id=$3 AND key=$4`,
        [statusCode, response, userId, key]
    )
}
