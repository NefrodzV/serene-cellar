import pg from "pg";
import { configDotenv } from "dotenv";
configDotenv();
const { Pool } = pg;
export default new Pool({
  host: process.env.DB_HOST,
  user: process.env.ROLE_NAME,
  database: process.env.DATABASE,
  password: process.env.ROLE_PASSWORD,
  port: 5432,
});
