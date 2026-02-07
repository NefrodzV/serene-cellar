import React, { useEffect, useState } from 'react'
import { useMessages } from '../../hooks'
import { MessageItem } from './MessageItem'

export function MessageContainer() {
  const { messages, onExit, onDelete } = useMessages()

  return (
    <ul className="message-container">
      {messages.map((message, i) => (
        <MessageItem
          key={message.id}
          message={message}
          onExit={onExit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}
