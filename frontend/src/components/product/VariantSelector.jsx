import { Card } from '../ui'
import React from 'react'

export function VariantSelector({
  variants,
  selectedVariant,
  onVariantSelected,
}) {
  return (
    <div className="variant-group" role="radiogroup">
      {variants?.map((variant) => (
        <VariantCard
          isSelected={variant.id === selectedVariant?.id}
          variant={variant}
          key={variant?.id}
          onChange={onVariantSelected}
        />
      ))}
    </div>
  )
}

function VariantCard({ variant, isSelected, onChange }) {
  return (
    <Card
      role="radio"
      as="button"
      className="variant-card"
      onClick={() => onChange(variant?.id)}
      data-selected={isSelected}
      aria-checked={isSelected}
    >
      <div className="variant-title">{variant?.package}</div>
      <div className="variant-meta">
        {variant?.containerKind} · {variant?.containerVolumeMl} ml
      </div>
      <div className="variant-price">${variant?.price}</div>
    </Card>
  )
}
