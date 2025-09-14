import { useEffect, useMemo, useState } from 'react'

export function useProductSelection(pricing = {}) {
  const [packSize, setPackSize] = useState(() => {
    if (pricing && Object.keys(pricing).length > 0) {
    }
    return null
  })

  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (!packSize && pricing && Object.keys(pricing)?.length > 0) {
      setPackSize(Object.keys(pricing)[0])
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
