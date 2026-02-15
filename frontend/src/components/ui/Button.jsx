import React from 'react'
import { createClassName } from '../../utils'
export function Button({
    as: Element = 'button',
    variant = 'primary',
    children,
    onClick,
    className = '',
    ...props
}) {
    return (
        <Element
            className={createClassName('button', variant, className)}
            onClick={onClick}
            {...props}
        >
            {children}
        </Element>
    )
}
