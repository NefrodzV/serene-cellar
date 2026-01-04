import React from 'react'
import { API_URL } from '../../config'
export function Thumbnail({ data }) {
  return (
    <img
      className="thumbnail"
      src={`${API_URL}/${data[150]}`}
      srcSet={`${API_URL}/${data[150]} 1x, ${API_URL}/${data[300]} 2x, ${API_URL}/${data[450]} 3x`}
    />
  )
}
