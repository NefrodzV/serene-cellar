import React from 'react'
import { Button, Heading } from '../ui'
import { Link } from 'react-router-dom'
export function StatusPage({
    title = '',
    description = '',
    actions = [],
    status = '',
}) {
    if (!status) throw new Error('Status must be defined')
    const icons = {
        success: 'fa-solid fa-check',
        error: 'fa-solid fa-xmark',
    }
    return (
        <div className="status-page">
            <i
                className={`${icons[status]} status-page__icon status-page__icon--${status}`}
            ></i>

            <Heading>{title}</Heading>
            <p className="status-page__subtitle">{description}</p>

            {actions.map((action, i) => (
                <Button
                    key={i}
                    as={Link}
                    to={action.to}
                    className="status-page__action"
                    replace
                >
                    {action.label}
                </Button>
            ))}
        </div>
    )
}
