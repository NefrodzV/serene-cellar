import React from 'react'
import { useCart, useProduct } from '../../hooks'
import { useParams } from 'react-router-dom'
import { Select } from '../ui/Select'
import { Error } from '../ErrorMessage'
import { ErrorsMessages } from '../../constants/ErrorMessages'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'
import { PriceTag, Spinner } from '../ui'
import { useState } from 'react'
export function ProductDetail() {
  const { id } = useParams()
  const [product, isLoading] = useProduct(id)
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
    <div className="product-detail-page">
      {isLoading ? (
        <Spinner />
      ) : (
        <Card className="product-detail-card rounded flex">
          <div className="product-detail">
            <div className="product-detail-content">
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
                    <div>
                      <Select
                        aria-label="Product selection"
                        id={'variant'}
                        value={variant?.priceId || ''}
                        text={
                          variant
                            ? `$${variant.price} ${variant.package} ${variant.containerKind} ${variant.containerVolumeMl} mL`
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
                            <span>${variant.price}</span>
                            <span className="pack">{variant.package}</span>
                            <span className="container">
                              {variant.containerKind}
                            </span>
                            <span className="volume">
                              {variant.containerVolumeMl} mL
                            </span>
                          </Select.Option>
                        ))}
                      </Select>
                    </div>

                    <div>
                      <Select
                        aria-label="Quantity selection"
                        id={'quantity'}
                        value={quantity}
                        text={variant ? quantity : 'Select a product first'}
                        onChange={onSelection}
                        disabled={variant === null || !variant.purchasable}
                      >
                        {[...Array(variant?.stock).keys()].map((val, i) => (
                          <Select.Option key={i} value={i + 1} label={i + 1}>
                            <span>{val + 1}</span>
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  </div>
                  <div className="product-detail-footer">
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
            <img
              className="image"
              srcSet={`${product.images.gallery[360]} 360w, ${product.images.gallery[720]} 720w, ${product.images.gallery[1080]} 1024w`}
              sizes={`(max-width: 600px) 360px, (max-width: 1024px) 720px, 1024px`}
            />
            <h1 className="title">{product.name}</h1>
          </div>
        </Card>
      )}
    </div>
  )
}
