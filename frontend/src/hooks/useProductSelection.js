import { useEffect, useMemo, useState } from 'react'

export function useProductSelection(
  pricing = {},
  defaultPack,
  defaultQuantity = 1
) {
  const [packSize, setPackSize] = useState(() => {
    if (defaultPack) return defaultPack
    if (pricing && Object.keys(pricing).length > 0) {
      return Object.keys(pricing)[0]
    }
    return null
  })

  const [quantity, setQuantity] = useState(defaultQuantity || 1)

  useEffect(() => {
    if (!packSize && pricing && Object.keys(pricing)?.length > 0) {
      setPackSize(defaultPack ?? Object.keys(pricing)[0])
    }
  }, [pricing, defaultPack, defaultQuantity])

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
