import { useMessages } from '../../hooks'
import React, { useEffect, useState } from 'react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
export function MessageItem({ message, removeMessage, index }) {
  const VISIBLE_MS = 2000
  const DELETE_MS = 500
  const SHRINKING_MS = 500

  const [hasMounted, setHasMounted] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isShrinking, setIsShrinking] = useState(false)
  const messageType = {
    notify: '\u2139', // i
    error: '\u2716', // ✖
    success: '\u2714', // ✔
  }
  const isError = message.type === 'error'

  let timeoutId = null
  useEffect(() => {
    setHasMounted(true)
    timeoutId = setTimeout(() => {
      setIsDeleting(true)
    }, VISIBLE_MS)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [])
  return (
    <Card
      key={message.id}
      as="li"
      className={`rounded shadow3 from-right ${hasMounted ? 'slide-in' : ''} ${isDeleting ? 'message-item-slide-out' : ''} ${isShrinking ? 'shrink' : ''}`}
      onTransitionEnd={() => {
        if (isDeleting) {
          setTimeout(() => {
            setIsShrinking(true)
            // removeMessage(message.id)
          }, DELETE_MS)
        }
        if (isShrinking) {
          setTimeout(() => {
            // setIsShrinking(true)
            removeMessage(message.id)
          }, SHRINKING_MS)
        }
      }}
    >
      <div>
        <Button variant="card" onClick={() => removeMessage(message.id)}>
          x
        </Button>
      </div>
      <div
        className="message"
        aria-live={isError ? 'assertive' : 'polite'}
        aria-atomic="true"
        role={isError ? 'alert' : 'status'}
        onKeyDown={(e) => {
          if (e.key === 'Escape') removeMessage(message.id)
        }}
      >
        <div className="content">
          <div className="icon-container">
            <div className={`icon message-${message?.type}`} aria-hidden>
              {messageType[message?.type]}
            </div>
          </div>

          <p className="text">{message.text}</p>
        </div>
      </div>
    </Card>
  )
}
