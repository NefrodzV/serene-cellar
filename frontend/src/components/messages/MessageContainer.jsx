import React from 'react'
import { useMessages } from '../../hooks'
import { Message } from './Message'
import { Card } from '../elements/Card'
import { Button } from '../elements/Button'

export function MessageContainer() {
  const { messages } = useMessages()

  return (
    <ul className="message-container">
      <Card>
        <div>
          <Button variant="card">x</Button>
        </div>
        <Message
          message={{
            text: 'Item added to cart',
            type: 'notify',
          }}
        />
      </Card>
      <Card>
        <div>
          <Button variant="card">x</Button>
        </div>
        <Message
          message={{
            text: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odio, enim corrupti? A, illo explicabo! Impedit similique perferendis quod nulla beatae nobis sit rerum? Perferendis, ipsam assumenda. Recusandae tempora voluptates perspiciatis?',
            type: 'error',
          }}
        />
      </Card>
      <Card>
        <div>
          <Button variant="card">x</Button>
        </div>
        <Message
          message={{
            text: 'Item added to cart',
            type: 'success',
          }}
        />
      </Card>

      {messages?.map((message) => (
        <li>
          <Card>
            <div>
              <Button variant="card">x</Button>
            </div>
            <Message message={message} />
          </Card>
        </li>
      ))}
    </ul>
  )
}
