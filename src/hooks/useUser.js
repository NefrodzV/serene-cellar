import { useContext } from 'react'
import { UserContext } from '../contexts/UserContext'

export function useUser() {
    const context = useContext(UserContext)
    const errorMsg = 'User context must be used inside a User Provider'
    if (!context) {
        throw new Error(errorMsg)
    }

    return context
}
