import { useContext } from 'react'
import { MessageContext } from '../contexts/MessageContext'

export function useMessages() {
  const messageContext = useContext(MessageContext)
  if (!messageContext) {
    throw new Error('use Messages must be used in a Message Provider')
  }
  return messageContext
}
