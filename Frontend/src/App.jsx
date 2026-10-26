import { useEffect, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api'

function bookingStatusLabel(status) {
  if (status === 0 || status === 'Afventer') return 'Afventer'
  if (status === 1 || status === 'Accepteret') return 'Accepteret'
  if (status === 2 || status === 'Afvist') return 'Afvist'
  return String(status)
}

async function apiRequest(path, options = {}) {
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

function App() {
  const [users, setUsers] = useState([])
  const [trips, setTrips] = useState([])
  const [bookings, setBookings] = useState([])
  const [currentUserId, setCurrentUserId] = useState('')
  const [userForm, setUserForm] = useState({ navn: '', email: '' })
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [tripForm, setTripForm] = useState({
    startLokation: '',
    slutLokation: '',
    afgangsTidspunkt: '',
    antalLedigeSaeder: 3,
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const currentUser = users.find((user) => user.id === Number(currentUserId))

  async function loadData() {
    const [loadedUsers, loadedTrips, loadedBookings] = await Promise.all([
      apiRequest('/brugere'),
      apiRequest('/ture'),
      apiRequest('/bookings'),
    ])
    setUsers(loadedUsers)
    setTrips(loadedTrips)
    setBookings(loadedBookings)
    if (!currentUserId && loadedUsers.length > 0) {
      setCurrentUserId(String(loadedUsers[0].id))
    }
  }

  useEffect(() => {
    loadData().catch((requestError) => setError(requestError.message))
  }, [])

  async function createUser(event) {
    event.preventDefault()
    setError('')
    try {
      const user = await apiRequest('/brugere', {
        method: 'POST',
        body: JSON.stringify(userForm),
      })
      await login(userForm.email, userForm.password)
      setUserForm({ navn: '', email: '' })
      setMessage(`Bruger ${user.navn} er oprettet.`)
      await loadData()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function login(email, password) {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    localStorage.setItem('rideshareToken', response.token)
    setCurrentUserId(String(response.user.id))
    setLoginForm({ email: '', password: '' })
    await loadData()
  }

  async function submitLogin(event) {
    event.preventDefault()
    setError('')
    try {
      await login(loginForm.email, loginForm.password)
      setMessage('Du er logget ind.')
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function becomeDriver() {
    if (!currentUser) return
    setError('')
    try {
      await apiRequest(`/brugere/${currentUser.id}/bliv-chauffoer`, { method: 'PATCH' })
      setMessage('Brugeren er nu chauffør.')
      await loadData()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function createTrip(event) {
    event.preventDefault()
    if (!currentUser) return
    setError('')
    try {
      await apiRequest('/ture', {
        method: 'POST',
        body: JSON.stringify({
  chauffoerId: currentUser.id,
  ...tripForm,
  afgangsTidspunkt: new Date(tripForm.afgangsTidspunkt).toISOString(),
  antalLedigeSaeder: Number(tripForm.antalLedigeSaeder),
}),
      })
      setTripForm({ startLokation: '', slutLokation: '', afgangsTidspunkt: '', antalLedigeSaeder: 3 })
      setMessage('Turen er oprettet.')
      await loadData()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function bookTrip(tripId) {
    if (!currentUser) return
    setError('')
    try {
      await apiRequest('/bookings', {
        method: 'POST',
        body: JSON.stringify({ turId: tripId, passagerId: currentUser.id }),
      })
      setMessage('Booking oprettet og afventer chaufførens svar.')
      await loadData()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function updateBooking(bookingId, action) {
    setError('')
    try {
      await apiRequest(`/bookings/${bookingId}/${action}`, { method: 'PATCH' })
      setMessage(`Booking er ${action === 'accepter' ? 'accepteret' : 'afvist'}.`)
      await loadData()
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <p className="eyebrow">AU RideShare · MVP</p>
        <h1>Find et lift. Giv et lift.</h1>
        <p>En enkel demo af bruger-, tur- og booking-flowet med data fra backendens SQLite-database.</p>
      </header>

      {message && <div className="notice success">{message}</div>}
      {error && <div className="notice error">{error}</div>}

      <main className="layout">
        <section className="panel">
          <h2>Aktiv bruger</h2>
          <select value={currentUserId} onChange={(event) => setCurrentUserId(event.target.value)}>
            <option value="">Vælg bruger</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.navn} · {user.erChauffoer ? 'chauffør' : 'passager'}
              </option>
            ))}
          </select>
          {currentUser && (
            <div className="user-summary">
              <strong>{currentUser.navn}</strong>
              <span>{currentUser.email}</span>
              {!currentUser.erChauffoer && <button onClick={becomeDriver}>Bliv chauffør</button>}
            </div>
          )}

          <h2>Opret bruger</h2>
          <form onSubmit={createUser}>
            <input required placeholder="Navn" value={userForm.navn} onChange={(event) => setUserForm({ ...userForm, navn: event.target.value })} />
            <input required type="email" placeholder="AU-email" value={userForm.email} onChange={(event) => setUserForm({ ...userForm, email: event.target.value })} />
            <input required minLength="6" type="password" placeholder="Password" value={userForm.password} onChange={(event) => setUserForm({ ...userForm, password: event.target.value })} />
            <button type="submit">Opret bruger</button>
          </form>

          <h2>Log ind</h2>
          <form onSubmit={submitLogin}>
            <input required type="email" placeholder="AU-email" value={loginForm.email} onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })} />
            <input required type="password" placeholder="Password" value={loginForm.password} onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })} />
            <button type="submit">Log ind</button>
          </form>
        </section>

        <section className="panel">
          <h2>Opret en tur</h2>
          <form onSubmit={createTrip}>
            <input required placeholder="Fra" value={tripForm.startLokation} onChange={(event) => setTripForm({ ...tripForm, startLokation: event.target.value })} />
            <input required placeholder="Til" value={tripForm.slutLokation} onChange={(event) => setTripForm({ ...tripForm, slutLokation: event.target.value })} />
            <input required type="datetime-local" value={tripForm.afgangsTidspunkt} onChange={(event) => setTripForm({ ...tripForm, afgangsTidspunkt: event.target.value })} />
            <input required min="1" type="number" placeholder="Ledige sæder" value={tripForm.antalLedigeSaeder} onChange={(event) => setTripForm({ ...tripForm, antalLedigeSaeder: event.target.value })} />
            <button type="submit" disabled={!currentUser?.erChauffoer}>Opret tur</button>
          </form>
          {!currentUser?.erChauffoer && <p className="hint">Vælg en bruger og gør brugeren til chauffør først.</p>}
        </section>

        <section className="panel wide">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Live fra API'et</p>
              <h2>Ledige ture</h2>
            </div>
            <button className="secondary" onClick={() => loadData().catch((requestError) => setError(requestError.message))}>Opdater</button>
          </div>
          {trips.length === 0 ? <p className="empty">Der er ingen ture endnu.</p> : (
            <div className="trip-list">
              {trips.map((trip) => (
                <article className="trip" key={trip.id}>
                  <div><strong>{trip.startLokation} → {trip.slutLokation}</strong><span>{new Date(trip.afgangsTidspunkt).toLocaleString('da-DK')}</span></div>
                  <div><span>{trip.antalLedigeSaeder} ledige sæder</span><button onClick={() => bookTrip(trip.id)} disabled={!currentUser}>Book tur</button></div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="panel wide">
          <h2>Bookinger</h2>
          {bookings.length === 0 ? <p className="empty">Ingen bookinger endnu.</p> : bookings.map((booking) => (
            <article className="booking" key={booking.id}>
              <span>Tur #{booking.turId} · Passager #{booking.passagerId}</span>
              <strong>{bookingStatusLabel(booking.status)}</strong>
              {(booking.status === 0 || booking.status === 'Afventer') && <div><button onClick={() => updateBooking(booking.id, 'accepter')}>Accepter</button><button className="danger" onClick={() => updateBooking(booking.id, 'afvis')}>Afvis</button></div>}
            </article>
          ))}
        </section>
      </main>
    </div>
  )
}

export default App