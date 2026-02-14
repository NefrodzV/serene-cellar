import React from 'react'
import { createClassName } from '../../utils'
export function Button({
    variant = 'primary',
    children,
    onClick,
    className = '',
    ...props
}) {
    return (
        <button
            className={createClassName('button', variant, className)}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    )
}
