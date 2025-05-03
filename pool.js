import pg from 'pg'
import { configDotenv } from 'dotenv'
configDotenv()
const { Pool } = pg
export default new Pool({
    connectionString: process.env.DB_URL,
})
