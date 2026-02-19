import React, { useEffect } from 'react'
import { Skeleton } from './Skeleton'
import { generateSkeletons } from '../../utils'
export function SkeletonList({ parent }) {
    const skeletons = generateSkeletons()
    return (
        <ul className={parent}>
            {skeletons.map((s) => (
                <Skeleton key={s.id} />
            ))}
        </ul>
    )
}
