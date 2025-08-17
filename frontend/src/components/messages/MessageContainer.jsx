import React from 'react'
import { useMessages } from '../../hooks'
import { MessageView } from './Message'

export function MessageContainer() {
  const { messages } = useMessages()

  return (
    <ul className="message-container">
      <MessageView
        message={{
          text: 'My message text ',
        }}
      />
      {messages?.map((message) => (
        <MessageView key={message.id} message={message} />
      ))}
    </ul>
  )
}
