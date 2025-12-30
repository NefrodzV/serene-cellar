import { API_URL } from '../config'
import { useUser } from '../hooks'
import { Button } from '../components/ui/Button'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
export function ProfilePage() {
  const { user, logout } = useUser()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])

  const status = {
    PLACED: 'ORDER PLACED',
    SHIPPED: 'ORDER SHIPPED',
    DELIVERED: 'DELIVERED',
  }

  useEffect(() => {
    async function getOrders() {
      try {
        const res = await fetch(`${API_URL}/me/orders`, {
          credentials: 'include',
        })
        const data = await res.json()
        console.log()
        if (!res.ok) {
          throw new Error('GET orders response: ', res.status, res.statusText)
        }
        setOrders(data.orders)
      } catch (error) {
        console.error(error)
      }
    }
    getOrders()
    if (!user) {
      navigate('/shop', { replace: true })
    }
  }, [])

  async function handleLogout() {
    const hasLoggedOut = await logout()
    if (hasLoggedOut) {
      navigate('/login', { replace: true })
    }
  }
  return (
    <div className="profile-page">
      <h1 className="heading">Profile</h1>
      <section className="profile-user">
        <span className="user-image-wrapper">
          <i className="fa-solid fa-user"></i>
        </span>
        <div className="profile-user-details">
          <div className="profile-username">
            {`${user?.first_name} ${user?.last_name}`}
          </div>
          <div className="profile-email">{`${user?.email}`}</div>
          <Button
            onClick={handleLogout}
            variant="primary"
            className="wrap-content"
          >
            Log out
          </Button>
        </div>
      </section>
      <section className="orders">
        <h2>Order History</h2>
        <ul className="order-list">
          {orders?.map((order) => (
            <li key={order.id} className="order-item">
              <div className="order-item-header">
                <span className="order-item-date">Date: {order.date}</span>
                <span className="order-item-total">{status[order.status]}</span>
              </div>
              <details>
                <summary>Items {`(${order.totalItems})`}</summary>

                <div>
                  <b>Order total: $ {order.orderTotal}</b>
                </div>
                <ul className="bought-items-list">
                  {order.items.map((item) => (
                    <li className="bought-item">
                      <div className="bought-item-image-container">
                        {item?.image?.url ? (
                          <img src={item?.image?.url} alt="Bought item image" />
                        ) : (
                          <i className="bought-item-image-placeholder fa-regular fa-image"></i>
                        )}
                      </div>
                      <div className="bought-item-details">
                        <span>{`${item.productName} (${item.package})`}</span>
                        <span>Bought: {item.quantity}</span>
                        <span>Price: $ {item.unitPrice} ea</span>
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
