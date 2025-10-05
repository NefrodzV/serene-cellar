import React, { useEffect } from 'react'
import { useMessages } from '../../hooks'
import { MessageItem } from './MessageItem'

export function MessageContainer() {
  const { messages, removeMessage } = useMessages()
  return (
    <ul className="message-container">
      {messages?.map((message, i) => (
        <MessageItem
          key={message.id}
          message={message}
          index={i}
          removeMessage={removeMessage}
        />
      ))}
    </ul>
  )
}
