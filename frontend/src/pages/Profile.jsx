import { API_URL } from '../config'
import { useUser } from '../hooks'
import React, { useEffect, useState } from 'react'
API_URL
export function ProfilePage() {
  const { user } = useUser()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    async function getOrders() {
      try {
        const res = await fetch(`${API_URL}/me/orders`, {
          credentials: 'include',
        })
        const data = await res.json()
        if (!res.ok) {
          throw new Error('GET orders status: ', res.status, res.statusText)
        }
        console.log('orders', data)
        setOrders(data.orders)
      } catch (error) {
        console.error(error)
      }
    }
    getOrders()
  }, [])

  return (
    <div className="profile-page">
      <section className="user-section">
        <img
          className="user-image"
          src={user?.image || <i class="fa-solid fa-user"></i>}
          alt="User profile picture"
        />
        <span>{user?.name}||user name placeholder</span>
      </section>
      <section className="orders">
        <ul className="order-list"></ul>
      </section>
    </div>
  )
}
