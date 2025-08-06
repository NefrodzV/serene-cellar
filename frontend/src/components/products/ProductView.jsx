import React from 'react'
import { useCart, useProduct, useProductSelection } from '../../hooks'
import { useParams, useSearchParams } from 'react-router-dom'

export function ProductView() {
  const { slug } = useParams()
  const [params] = useSearchParams()
  const initialQuantity = params.get('quantity')
  const initialPack = params.get('pack')
  const isEditing = params.get('edit') === 'true'
  const itemId = params.get('itemId')

  const [product, isLoading] = useProduct(slug, isEditing)

  const { packSize, quantity, packSizeHandler, quantityHandler, total } =
    useProductSelection(product?.price, initialPack, initialQuantity)
  const { addItem, updateItem } = useCart()
  if (!product) return <p>Loading product</p>
  const { name, price, category, abv, ml, description, images } = product
  return (
    <div className="product-view">
      <div>
        <h1>{name}</h1>
        <p>{description}</p>
        <p>Category: {category}</p>
        <p>ABV(Alcohol by Volumen): {abv}%</p>
        <p>Bottle size: {parseFloat(ml).toFixed(0)} ml</p>
        <label htmlFor="packSize">Pack Size</label>
        <select
          id="packSize"
          onChange={packSizeHandler}
          value={packSize ?? ''}
          disabled={isEditing}
        >
          {Object.entries(price).map(([key, { unit, value }]) => (
            <option value={key} key={key}>
              {unit} - ${value}
            </option>
          ))}
        </select>
        <label htmlFor="quantity">Quantity</label>
        <select id="quantity" onChange={quantityHandler} value={quantity ?? 1}>
          {[...Array(10)].map((_, i) => (
            <option key={i + 1}>{i + 1}</option>
          ))}
        </select>
        <p>{`Total: $${total}`}</p>
        <button
          className="button add-cart"
          onClick={() =>
            isEditing
              ? updateItem({
                  id: itemId,
                  quantity: quantity,
                })
              : addItem({
                  productId: product.id,
                  slug: product.slug,
                  name: product.name,
                  quantity,
                  packSize,
                  unitType: product.price[packSize].unit,
                  price: product.price[packSize].value,
                  images: product.images,
                })
          }
        >
          <i class="fa-solid fa-cart-plus"></i>
          {isEditing ? 'Submit change' : 'Add to cart'}
        </button>
      </div>
      <img
        width={'25%'}
        srcSet={`${images.phone} 360w, ${images.tablet} 720w, ${images.desktop} 1080w`}
        sizes={`(max-width: 600px) 360px, (max-width: 1024px) 720px, 1080px`}
      />
    </div>
  )
}
