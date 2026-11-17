const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'

// Alle kald til backend går herigennem. Sender login-tokenet med, hvis det findes.
export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem('rideshareToken')
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request fejlede (${response.status})`)
  }

  return response.status === 204 ? null : response.json()
}