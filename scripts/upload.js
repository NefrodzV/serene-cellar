import { configDotenv } from 'dotenv'
import fs from 'node:fs'
import { Pool } from 'pg'
configDotenv()
const mode = process.argv[2]
const filePathToRead = process.argv[3]
if (!mode) {
    console.error('No mode defined. You must define a mode: dev or prod')
    process.exit(1)
}

if (!filePathToRead) {
    console.error('No file path to read defined')
    process.exit(1)
}

// Default configuration to upload to localhost
let poolConfig = {
    host: process.env.DB_HOST,
    user: process.env.ROLE_NAME,
    database: process.env.DATABASE,
    password: process.env.ROLE_PASSWORD,
    port: 5432,
    secure: true,
}
if (mode === 'prod') {
    poolConfig = { connectionString: process.env.DB_URL }
}

const db = new Pool(poolConfig)

fs.readFile(filePathToRead, 'utf8', async (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    const products = JSON.parse(data)

    for (const product of products) {
        await uploadProduct(product)
    }
})

const uploadProduct = async (product) => {
    const { name, description, abv, ml, category, pricing, images } = product
    try {
        const result = await db.query(
            `INSERT INTO products (name, description, category, abv, ml) 
            VALUES ($1, $2, $3, $4, $5) RETURNING id
            `,
            [name, description, category, abv, ml]
        )
        const productId = result.rows[0].id
        const pricingInserts = Object.entries(pricing).map(([key, value]) => {
            return db.query(
                `INSERT INTO prices (product_id, unit, value)
                VALUES ($1, $2, $3)`,
                [productId, key, value]
            )
        })

        const imageInserts = Object.entries(images).map(([key, value]) => {
            return db.query(
                `INSERT INTO product_images 
                (product_id, device_type, image_url) VALUES ($1, $2, $3)`,
                [productId, key, value]
            )
        })

        await Promise.all([...pricingInserts, ...imageInserts])
        console.log('Data submitted to database successful')
    } catch (err) {
        console.error('Database query error:', err)
    }
}
