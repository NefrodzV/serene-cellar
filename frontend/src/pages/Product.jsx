import { useCart, useProduct } from '../hooks'
import { useParams } from 'react-router-dom'
import React, { useState } from 'react'
import { API_URL } from '../config'
import { Select, Button, Card, Spinner } from '../components/ui'
export function ProductPage() {
  const { id } = useParams()
  const { product, isLoading, message } = useProduct(id)
  const [variant, setVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()
  const onSelection = (value, name) => {
    switch (name) {
      case 'variant':
        const selectedVariant = product.variants.find(
          (variant) => variant.priceId === value
        )
        return setVariant(selectedVariant)
      case 'quantity':
        return setQuantity(value)
      default:
        throw new Error('onSelection case not defined')
    }
  }

  return (
    <section className="product-page">
      {isLoading ? (
        <Spinner
          style={{
            position: 'absolute',
            inset: 0,
          }}
          message={message}
        />
      ) : (
        <div className="product-grid">
          <div className="product-grid-content">
            <p>{product.description}</p>
            <p>
              <b>Spirit:</b> {product.typeOfAlcohol}
            </p>
            <p>
              <b>Abv:</b> {product.abv}%
            </p>
            {product.purchasable ? (
              <>
                <div className="selection flex-1rem">
                  <div className="product-select-container">
                    <Select
                      aria-label="Product selection"
                      id={'variant'}
                      value={variant?.priceId || ''}
                      text={
                        variant
                          ? `${variant.package} ${variant.containerKind} ${variant.containerVolumeMl} mL`
                          : 'Select product'
                      }
                      onChange={onSelection}
                    >
                      {product.variants.map((variant) => (
                        <Select.Option
                          key={variant.priceId}
                          value={variant.priceId}
                          label={`${variant.price} ${variant.package} ${variant.containerKind} ${variant.containerVolumeMl} mL`}
                          disabled={!variant.purchasable}
                        >
                          <div className="select-item-header">
                            <span className="pack">{variant.package}</span>
                            <span className="container">
                              {variant.containerKind}
                            </span>
                            <span className="volume">
                              {variant.containerVolumeMl} mL
                            </span>
                          </div>
                          <div className="price">$ {variant.price}</div>
                        </Select.Option>
                      ))}
                    </Select>
                  </div>
                  {variant ? (
                    <div>
                      <Select
                        aria-label="Quantity selection"
                        id={'quantity'}
                        value={quantity}
                        text={variant ? quantity : 'Quantity'}
                        onChange={onSelection}
                        disabled={variant === null || !variant.purchasable}
                      >
                        {[...Array(variant?.stock).keys()].map((val, i) => (
                          <Select.Option key={i} value={i + 1} label={i + 1}>
                            <span className="quantity-selection">
                              {val + 1}
                            </span>
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  ) : null}
                </div>
                <div className="product-grid-footer">
                  {variant && (
                    <p className="total">
                      <b className="block">Total:</b>
                      {`$${(variant.price * quantity).toFixed(2)}`}
                    </p>
                  )}
                  <Button
                    disabled={!variant}
                    variant="accent"
                    className="fullwidth add-to-cart"
                    onClick={() => addItem(variant, quantity)}
                  >
                    <i className="fa-solid fa-cart-plus"></i>
                    Add to cart
                  </Button>
                </div>
              </>
            ) : (
              <Error text={product.error} />
            )}
          </div>
          <div className="image-container">
            <img
              className="product-grid-image"
              srcSet={`${API_URL}/${product.images.gallery[360]} 360w, ${API_URL}/${product.images.gallery[720]} 720w, ${API_URL}/${product.images.gallery[1080]} 1024w`}
              sizes={`(max-width: 600px) 360px, (max-width: 1024px) 720px, 1024px`}
            />
          </div>

          <h1 className="heading">{product.name}</h1>
        </div>
      )}
    </section>
  )
}
