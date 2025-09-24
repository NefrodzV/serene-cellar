import React from 'react'
import { useMessages } from '../../hooks'
import { MessageView } from './Message'

export function MessageContainer() {
  const { messages } = useMessages()

  return (
    <ul className="message-container">
      <MessageView
        type="notify"
        message={{
          text: 'Item added to cart',
        }}
      />

      <MessageView
        type="error"
        message={{
          text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio, enim corrupti? A, illo explicabo! Impedit similique perferendis quod nulla beatae nobis sit rerum? Perferendis, ipsam assumenda. Recusandae tempora voluptates perspiciatis?',
        }}
      />

      <MessageView
        type="success"
        message={{
          text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio, enim corrupti? A, illo explicabo! Impedit similique perferendis quod nulla beatae nobis sit rerum? Perferendis, ipsam assumenda. Recusandae tempora voluptates perspiciatis?',
        }}
      />

      {messages?.map((message) => (
        <MessageView key={message.id} message={message} />
      ))}
    </ul>
  )
}
