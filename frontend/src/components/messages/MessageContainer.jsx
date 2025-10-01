import React, { useEffect } from 'react'
import { useMessages } from '../../hooks'
import { Message } from './Message'
import { Card } from '../elements/Card'
import { Button } from '../elements/Button'

export function MessageContainer() {
  const { messages, removeMessage, updateAnimation } = useMessages()
  return (
    <ul className="message-container">
      {messages?.map((message, i) => (
        <Card
          onTransitionEnd={(e) => {
            if (message.animate) return
            if (e.target.classList.contains('slide-in')) return
            removeMessage(message.id)
          }}
          key={message.id}
          as="li"
          className={`rounded shadow3 from-right ${message?.animate ? 'slide-in' : ''}`}
        >
          <div>
            <Button variant="card" onClick={() => removeMessage(message.id)}>
              x
            </Button>
          </div>
          <Message
            message={{ message }}
            removeMessage={removeMessage}
            updateAnimation={updateAnimation}
          />
        </Card>
      ))}
    </ul>
  )
}
