import { createContext, useState, useEffect, useRef } from 'react'
import React from 'react'
import { v4 as uuidv4 } from 'uuid'
export const MessageContext = createContext()

export function MessageProvider({ children }) {
  const [messages, setMessages] = useState([])
  const timeouts = useRef(new Map())

  function sendMessage(title, text, type = 'notify') {
    const message = {
      id: uuidv4(),
      title,
      text,
      type,
      status: 'enter',
    }
    setMessages((prev) => [...prev, message])

    requestAnimationFrame(() => {
      setMessages((messages) =>
        messages.map((msg) =>
          msg.id === message.id ? { ...msg, status: 'idle' } : msg
        )
      )
    })

    const t = setTimeout(() => {
      setMessages((msgs) =>
        msgs.map((msg) =>
          msg.id === message.id ? { ...msg, status: 'exit' } : msg
        )
      )
    }, 5000)
    timeouts.current.set(message.id, t)
  }

  // On Delete start exist transition
  function onDelete(id) {
    setMessages((messages) =>
      messages.map((msg) => (msg.id === id ? { ...msg, status: 'exit' } : msg))
    )
  }

  // When exited delete the data
  function onExit(id) {
    // clearTimeout(timeouts.current.get(id))
    setMessages((prev) => prev.filter((message) => !(message.id === id)))
  }

  const value = {
    messages,
    sendMessage,
    onDelete,
    onExit,
  }

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  )
}
