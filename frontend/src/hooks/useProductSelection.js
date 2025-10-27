import { useEffect, useState } from 'react'

export function useProductSelection(pricing) {
  const [variant, setVariant] = useState(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {}, [pricing])

  function variantHandler(value) {
    console.log('variant', value)
    setVariant(value)
  }
  function quantityHandler(value) {
    setQuantity(Number(value))
  }

  const unitPrice = pricing?.[variant]?.value
  const total = (unitPrice * quantity).toFixed(2)

  return {
    packSize: variant,
    quantity,
    variantHandler,
    quantityHandler,
    total,
  }
}
