import React from 'react'
import { Skeleton } from './Skeleton'
import { generateSkeletons } from '../../utils'
export function FilterSkeleton() {
    const skeletons = generateSkeletons(3)
    return (
        <ul className="filter-skeleton">
            {skeletons.map((s) => (
                <Skeleton variant={'tag'} key={s.id} />
            ))}
        </ul>
    )
}
