import React from 'react'
import { useMessages } from '../../hooks'
import { MessageView } from './Message'

export function MessageContainer() {
  const { messages } = useMessages()
  console.log(messages)
  return (
    <ul style={{ background: 'lightgray' }}>
      {messages?.map((message) => (
        <MessageView key={message.id} message={message} />
      ))}
    </ul>
  )
}
