import React from 'react'
import { createClassName } from '../../utils'

export function Skeleton({ as: Element = 'div', variant, className }) {
    const css = createClassName('skeleton', variant, className)
    return <Element className={css} />
}
