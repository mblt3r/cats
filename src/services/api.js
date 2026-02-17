const API_BASE = '/api'

export const checkAuth = async () => {
  try {
    const response = await fetch(`${API_BASE}/cats/top-funny`)
    return response.status !== 401
  } catch (error) {
    return false
  }
}

export const login = async (username, password) => {
  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Ошибка входа')
  }

  return response.json()
}

export const register = async (username, password) => {
  const response = await fetch('/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Ошибка регистрации')
  }

  return response.json()
}

export const logout = async () => {
  await fetch('/logout', { method: 'POST' })
}

export const getTopCats = async () => {
  const response = await fetch(`${API_BASE}/cats/top-funny`)
  if (!response.ok) throw new Error('Ошибка загрузки топа')
  return response.json()
}

export const incrementVote = async (imagePath) => {
  const response = await fetch(`${API_BASE}/cats/top-funny/increment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imagePath }),
  })
  if (!response.ok) throw new Error('Ошибка обновления рейтинга')
  return response.json()
}

export const decrementVote = async (imagePath) => {
  const response = await fetch(`${API_BASE}/cats/top-funny/decrement`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imagePath }),
  })
  if (!response.ok) throw new Error('Ошибка обновления рейтинга')
  return response.json()
}

export const addFunnyVote = async (imagePath) => {
  const response = await fetch(`${API_BASE}/cats/top-funny`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imagePath }),
  })
  if (!response.ok) throw new Error('Ошибка добавления в топ')
  return response.json()
}
