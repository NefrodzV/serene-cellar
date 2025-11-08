import Stripe from 'stripe'
import pg from 'pg'
const stripe = new Stripe(process.env.STRIPE_TEST_SECRET)

const { Pool } = pg
const args = process.argv

const pool = new Pool({ connectionString: args[2] })

const client = await pool.connect()
const variants = await getProductVariantsFromDatabase()

try {
  await client.query('BEGIN')
  for (const variant of variants) {
    const stripePrice = await stripe.prices.create({
      currency: 'usd',
      unit_amount: calculateCents(variant.amount),
      nickname: variant.display_name,
      product: variant.stripe_product_id,
    })
    await updateStripePriceId(variant.variant_id, stripePrice.id)
  }

  console.log('Stripe prices have been created and updated')
  await client.query('COMMIT')
} catch (error) {
  console.log(error)
  await client.query('ROLLBACK')
} finally {
  client.release()
  process.exit()
}

async function getProductVariantsFromDatabase() {
  const { rows } = await client.query(`
    SELECT
      DISTINCT pv.id as variant_id,
      p.id as price_id, 
      amount, 
      display_name,
      prod.stripe_product_id
      FROM prices p
    INNER JOIN product_variants pv ON  pv.id=p.variant_id
    INNER JOIN packages pkg ON pkg.id=pv.package_id 
    INNER JOIN products prod ON prod.id = pv.product_id
   `)
  return rows
}

async function updateStripePriceId(variantId, stripePriceId) {
  await client.query(
    'UPDATE product_variants SET stripe_price_id=$1 WHERE id=$2',
    [stripePriceId, variantId]
  )
}

function calculateCents(price) {
  return Math.round(price * 100)
}
