import React from 'react'
import { Card } from './Card'
export function Tag({ id, value, onChange, children, isActive }) {
    if (onChange) {
        return (
            <Card as="label" variant="secondary" htmlFor={id}>
                <input
                    id={id}
                    type="checkbox"
                    value={value}
                    checked={isActive}
                    onChange={onChange}
                />
                <span className="checkmark"></span>
                <span className="filter-text">{children}</span>
            </Card>
        )
    }
    return <span>{children}</span>
}
