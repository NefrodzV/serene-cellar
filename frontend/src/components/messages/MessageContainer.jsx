import React, { useEffect, useState } from 'react'
import { useMessages } from '../../hooks'
import { MessageItem } from './MessageItem'

export function MessageContainer() {
  const { messages, removeMessage } = useMessages()
  const [dummyMessages, setMessages] = useState([{ text: '' }])
  useEffect(() => {
    setTimeout(() => {
      setMessages((m) => [...m, { text: 'new one' }])
    }, 1000)
  }, [])
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
