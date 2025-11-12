import { useUser } from '../hooks'

export function Profile() {
  const { user } = useUser()
  return (
    <div className="profile-page">
      <section className="user-section">
        <img
          className="user-image"
          src={user?.image || <i class="fa-solid fa-user"></i>}
          alt="User profile picture"
        />
        <span>{user.name}</span>
      </section>
      <section className="orders">
        <ul className="order-list"></ul>
      </section>
    </div>
  )
}
