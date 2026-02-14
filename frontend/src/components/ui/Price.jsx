import React from 'react'
import { createClassName } from '../../utils'
export function Price({ price, variant, classes }) {
    return (
        <div className={createClassName('price', variant, classes)}>
            $ {price}
        </div>
    )
}
