import React from 'react'
import { API_URL } from '../../config'
export function Thumbnail({ images, alt }) {
  return (
    <img
      className="thumbnail"
      src={images[300]}
      srcSet={`${images[150]} 150w, ${images[300]} 300w, ${images[450]} 450w`}
      alt={alt}
    />
  )
}
