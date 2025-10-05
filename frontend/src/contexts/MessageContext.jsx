import { createContext, useState, useEffect } from 'react'
import React from 'react'
import { v4 as uuidv4 } from 'uuid'
export const MessageContext = createContext()

export function MessageProvider({ children }) {
  const [messages, setMessages] = useState([])

  function sendMessage(text, type = 'notify') {
    const message = {
      id: uuidv4(),
      text,
      type,
    }
    setMessages((prev) => [...prev, message])
  }

  function removeMessage(id) {
    setMessages((prev) => prev.filter((message) => !(message.id === id)))
  }

  const value = { messages, sendMessage, removeMessage, updateAnimation }

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  )
}
