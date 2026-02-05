import React from 'react'
import { SectionTitle } from '../ui'
import { ProductRail } from '../products/ProductRail'
export function RelatedProducts({ products }) {
  return (
    <section className="related-products">
      <SectionTitle>Related products</SectionTitle>
      <ProductRail products={products} />
    </section>
  )
}
