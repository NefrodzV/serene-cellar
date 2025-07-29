const sereneApiUrl = import.meta.env.VITE_SERENE_CELLAR_API_URL
const requestOptions = {
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
}

export async function login(email, password) {
  const res = await fetch(`${sereneApiUrl}/auth/login`, {
    ...requestOptions,
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  const data = await res.json()

  if (!res.ok) {
    const error = new Error(data.message || 'Login failed')
    error.status = res.status
    error.fieldErrors = data.errors || null
    throw error
  }

  return data.user
}

export async function getCurrentUser() {
  const res = await fetch(sereneApiUrl + '/me', {
    credentials: 'include',
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error('Loading current authenticated user failed')
  }

  return data.user
}

export async function register(
  firstName,
  lastName,
  username,
  email,
  password,
  confirmPassword
) {
  const res = await fetch(`${sereneApiUrl}/auth/register`, {
    ...requestOptions,
    method: 'POST',
    body: JSON.stringify({
      firstName,
      lastName,
      username,
      email,
      password,
      confirmPassword,
    }),
  })
  const data = await res.json()
  console.log(data)
  if (!res.ok) {
    const error = new Error(data.message || 'Register failed')
    error.status = res.status
    error.fieldErrors = data.errors || null
    throw error
  }
  return data.user
}
