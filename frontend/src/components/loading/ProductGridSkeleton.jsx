import React from 'react'
import { Skeleton } from './Skeleton'
import { generateSkeletons } from '../../utils'
export function ProductGridSkeleton() {
    const skeletons = generateSkeletons(20)
    return (
        <ul className="product-grid-skeleton">
            {skeletons.map((s) => (
                <Skeleton key={s.id} />
            ))}
        </ul>
    )
}
