import React from 'react'
export function Thumbnail({ data }) {
  return (
    <img
      className="thumbnail"
      src={data[150]}
      srcSet={`${data[150]} 1x, ${data[300]} 2x, ${data[450]} 3x`}
    />
  )
}
