import { useEffect, useState } from 'react'
import './App.css'
import { apiRequest } from './api.js'
import UserPanel from './components/UserPanel.jsx'
import TripForm from './components/TripForm.jsx'
import TripList from './components/TripList.jsx'
import BookingList from './components/BookingList.jsx'

// App holder data og kalder backend. Selve visningen ligger i components/.
function App() {
  const [users, setUsers] = useState([])
  const [trips, setTrips] = useState([])
  const [bookings, setBookings] = useState([])
  const [currentUserId, setCurrentUserId] = useState('')
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

  function refresh() {
    loadData().catch((requestError) => setError(requestError.message))
  }

  async function login(email, password) {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    localStorage.setItem('rideshareToken', response.token)
    setCurrentUserId(String(response.user.id))
    await loadData()
  }

  // De fire funktioner herunder returnerer true, hvis det lykkedes.
  async function createUser(form) {
    setError('')
    try {
      const user = await apiRequest('/brugere', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      await login(form.email, form.password)
      setMessage(`Bruger ${user.navn} er oprettet.`)
      await loadData()
      return true
    } catch (requestError) {
      setError(requestError.message)
      return false
    }
  }

  async function submitLogin(email, password) {
    setError('')
    try {
      await login(email, password)
      setMessage('Du er logget ind.')
      return true
    } catch (requestError) {
      setError(requestError.message)
      return false
    }
  }

  async function createTrip(tripData) {
    setError('')
    try {
      await apiRequest('/ture', {
        method: 'POST',
        body: JSON.stringify(tripData),
      })
      setMessage('Turen er oprettet.')
      await loadData()
      return true
    } catch (requestError) {
      setError(requestError.message)
      return false
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
        <p>En enkel demo af bruger-, tur- og booking-flowet med data fra backendens PostgreSQL-database.</p>
      </header>

      {message && <div className="notice success">{message}</div>}
      {error && <div className="notice error">{error}</div>}

      <main className="layout">
        <UserPanel
          users={users}
          currentUserId={currentUserId}
          currentUser={currentUser}
          onSelectUser={setCurrentUserId}
          onBecomeDriver={becomeDriver}
          onCreateUser={createUser}
          onLogin={submitLogin}
        />
        <TripForm currentUser={currentUser} onCreateTrip={createTrip} />
        <TripList trips={trips} currentUser={currentUser} onBook={bookTrip} onRefresh={refresh} />
        <BookingList bookings={bookings} trips={trips} users={users} currentUser={currentUser} onUpdate={updateBooking} />
      </main>
    </div>
  )
}

export default App