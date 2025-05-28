
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import React from 'react'
import { createRoot } from 'react-dom/client'
import Login from './pages/Login.jsx'

createRoot(document.getElementById('root')).render(<React.StrictMode>
  <Login />
</React.StrictMode>)