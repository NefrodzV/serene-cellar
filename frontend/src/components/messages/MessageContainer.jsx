import React from 'react'
import { useMessages } from '../../hooks'
import { Message } from './Message'

export function MessageContainer() {
  const { messages } = useMessages()

  return (
    <ul className="message-container">
      <Message
        type="notify"
        message={{
          text: 'Item added to cart',
        }}
      />

      <Message
        type="error"
        message={{
          text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio, enim corrupti? A, illo explicabo! Impedit similique perferendis quod nulla beatae nobis sit rerum? Perferendis, ipsam assumenda. Recusandae tempora voluptates perspiciatis?',
        }}
      />

      <Message
        type="success"
        message={{
          text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio, enim corrupti? A, illo explicabo! Impedit similique perferendis quod nulla beatae nobis sit rerum? Perferendis, ipsam assumenda. Recusandae tempora voluptates perspiciatis?',
        }}
      />

      {messages?.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </ul>
  )
}
