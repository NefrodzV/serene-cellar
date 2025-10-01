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
      animate: false,
    }
    setMessages((prev) => [...prev, message])

    /** This may need an improvement because this still runs when the user
     * has removed the message
     */
    // setTimeout(() => {
    //   removeMessage(message.id)
    // }, 2000)
  }

  function updateAnimation(id, animationVal) {
    setMessages((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const updatedMessage = { ...m, animate: animationVal }
          return updatedMessage
        }

        return m
      })
    )
  }
  function removeMessage(id) {
    setMessages((prev) => prev.filter((message) => !(message.id === id)))
  }

  const value = { messages, sendMessage, removeMessage, updateAnimation }

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  )
}
