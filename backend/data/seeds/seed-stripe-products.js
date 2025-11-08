import Stripe from 'stripe'
import pg from 'pg'
const stripe = new Stripe(process.env.STRIPE_TEST_SECRET)

const { Pool } = pg
const args = process.argv

const pool = new Pool({ connectionString: args[2] })

const client = await pool.connect()
const products = await getProducts()
try {
  await client.query('BEGIN')
  for (const product of products) {
    if (!product.stripe_product_id) {
      const stripeProduct = await stripe.products.create({
        name: product.name,
        images: [product.url],
      })
      await updateStripeProductId(product.product_id, stripeProduct.id)
    }
  }
  console.log('Update stripe product ids')
  await client.query('COMMIT')
} catch (error) {
  console.error(error)
} finally {
  client.release()
  process.exit()
}
async function getProducts() {
  const { rows } = await client.query(
    'SELECT p.id as product_id, stripe_product_id, name, url FROM products p INNER JOIN product_variants pv ON p.id=pv.product_id INNER JOIN product_images pi ON pi.variant_id = pv.id INNER JOIN assets a ON a.id = pi.asset_id WHERE a.width=150 AND a.height=150 GROUP BY url, p.id'
  )
  return rows
}

async function updateStripeProductId(productId, stripeProductId) {
  await client.query('UPDATE products SET stripe_product_id=$1 WHERE id=$2', [
    stripeProductId,
    productId,
  ])
}
