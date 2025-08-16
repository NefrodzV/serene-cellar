import React from 'react'
import { useCart, useProduct, useProductSelection } from '../../hooks'
import { useParams, useSearchParams } from 'react-router-dom'
import { Select } from '../Select'

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
  console.log(packSize)
  return (
    <div className="product-view">
      <div>
        <h1>{name}</h1>
        <p>{description}</p>
        <p>
          <b className="block">Category:</b> {category}
        </p>
        <p>
          <b className="block">ABV(Alcohol by Volumen):</b> {abv}%
        </p>
        <p>
          <b className="block">Bottle size:</b> {parseFloat(ml).toFixed(0)} ml
        </p>
        <label className="block" htmlFor="packSize">
          <b>Pack Size</b>
        </label>

        <Select
          options={Object.entries(price).map(([key, { unit, value }]) => ({
            key,
            value: key,
            text: `${unit} - $${value}`,
          }))}
          value={packSize}
          text={
            packSize
              ? `${price[packSize].unit} - $${price[packSize].value}`
              : null
          }
          onChange={packSizeHandler}
        />
        {/* <select
          className="input primary"
          id="packSize"
          onChange={packSizeHandler}
          disabled={isEditing}
        >
          {Object.entries(price).map(([key, { unit, value }]) => (
            <option value={key} key={key}>
              {unit} - ${value}
            </option>
          ))}
        </select> */}
        <label className="block" htmlFor="quantity">
          <b>Quantity</b>
        </label>
        <Select
          options={[...Array(10)].map((_, i) => ({ key: i + 1, value: i + 1 }))}
          onChange={quantityHandler}
          value={quantity}
        />
        {/* <select
          className="input primary"
          id="quantity"
          onChange={quantityHandler}
          value={quantity ?? 1}
        >
          {[...Array(10)].map((_, i) => (
            <option key={i + 1}>{i + 1}</option>
          ))}
        </select> */}
        <p>
          <b className="block">Total:</b>
          {`$${total}`}
        </p>
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
