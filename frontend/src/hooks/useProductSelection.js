import { useEffect, useState } from 'react'

export function useProductSelection(pricing) {
  const [packSize, setPackSize] = useState(null)

  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (!packSize && pricing && Object.keys(pricing)?.length > 0) {
      for (const [key, value] of Object.entries(pricing)) {
        if (value.purchasable) {
          setPackSize(key)
          break
        }
      }
    }
  }, [pricing])

  function packSizeHandler(value) {
    setPackSize(value)
  }
  function quantityHandler(value) {
    setQuantity(Number(value))
  }

  const unitPrice = pricing?.[packSize]?.value
  const total = (unitPrice * quantity).toFixed(2)

  return {
    packSize,
    quantity,
    packSizeHandler,
    quantityHandler,
    total,
  }
}
