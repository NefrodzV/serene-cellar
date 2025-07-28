import pg from 'pg'
import { configDotenv } from 'dotenv'
configDotenv()
const { Pool } = pg
const poolConfig =
    process.env.NODE_ENV === 'development'
        ? {
              host: process.env.DB_HOST,
              user: process.env.ROLE_NAME,
              database: process.env.DATABASE,
              password: process.env.ROLE_PASSWORD,
              port: 5432,
              secure: true,
          }
        : {
              connectionString: process.env.DB_URL,
          }
export default new Pool(poolConfig)
