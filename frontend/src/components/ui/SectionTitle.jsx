import React from 'react'
export function SectionTitle({ as: Heading = 'h2', children }) {
  return <Heading className="section-title">{children}</Heading>
}
