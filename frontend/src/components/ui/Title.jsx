import React from 'react'
export function Title({ element: Element = 'h1', variant, children }) {
    const className = ['title', `title--${variant}`].filter(Boolean).join(' ')
    return <Element className={className}>{children}</Element>
}
