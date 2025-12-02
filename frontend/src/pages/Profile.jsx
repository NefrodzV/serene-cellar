import { API_URL } from '../config'
import { useUser } from '../hooks'
import React, { useEffect, useState } from 'react'
API_URL
export function ProfilePage() {
  const { user } = useUser()
  const [orders, setOrders] = useState([
    {
      id: 1,
      date: '2025/25/12',
      items: [
        {
          name: 'item name 1',
          quantity: 2,
          price: 8.12,
        },
        {
          name: 'item name 1',
          quantity: 2,
          price: 8.12,
        },
        {
          name: 'item name 1',
          quantity: 2,
          price: 8.12,
        },
      ],
      boughtItems: 3,
      total: 20.75,
    },
    {
      id: 2,
      date: '2025/25/12',
      items: [
        {
          name: 'item name 1',
          quantity: 2,
          price: 8.12,
        },
        {
          name: 'item name 1',
          quantity: 2,
          price: 8.12,
        },
        {
          name: 'item name 1',
          quantity: 2,
          price: 8.12,
        },
      ],
      boughtItems: 3,
      total: 20.75,
    },
    {
      id: 3,
      date: '2025/25/12',
      items: [
        {
          name: 'item name 1',
          quantity: 2,
          price: 8.12,
        },
        {
          name: 'item name 1',
          quantity: 2,
          price: 8.12,
        },
        {
          name: 'item name 1',
          quantity: 2,
          price: 8.12,
        },
      ],
      boughtItems: 3,
      total: 20.75,
    },
  ])

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
      <h1>Profile</h1>
      <section className="profile-user">
        <span className="user-image-wrapper">
          <i className="fa-solid fa-user"></i>
        </span>
        <div className="profile-user-details">
          <div className="profile-username">
            {user?.name}||user name placeholder
          </div>
          <div>user email</div>
        </div>
      </section>
      <section className="orders">
        <h2>Order History</h2>
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order.id} className="order-item">
              <div className="order-item-header">
                <span className="order-item-date">Date: {order.date}</span>
                <span className="order-item-total-items">
                  Items bought: {order.boughtItems}
                </span>
                <span className="order-item-total">
                  Total spent: $ {order.total}
                </span>
              </div>
              <details>
                <summary>Items bought</summary>
                <ul className="bought-items-list">
                  {order.items.map((item) => (
                    <li className="bought-item">
                      <div className="bought-item-image-container">
                        {item.imageUrl ? (
                          <img src={item?.imageUrl} alt="Bought item image" />
                        ) : (
                          <i className="bought-item-image-placeholder fa-regular fa-image"></i>
                        )}
                      </div>
                      <div className="bought-item-details">
                        <span>{item.name}</span>
                        <span>Bought: {item.quantity}</span>
                        <span>Price: $ {item.price} ea</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </details>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
