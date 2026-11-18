import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router'
import './App.css'
import { apiRequest } from './api.js'
import NavBar from './components/NavBar.jsx'
import LoginPage from './components/LoginPage.jsx'
import TripForm from './components/TripForm.jsx'
import TripList from './components/TripList.jsx'
import BookingList from './components/BookingList.jsx'

// Husker hvem der er logget ind, også efter at siden er genindlæst.
function readStoredUserId() {
  const stored = localStorage.getItem('rideshareUserId')
  return stored ? Number(stored) : null
}

// App holder data og kalder backend. Hver side ligger i components/.
function App() {
  const location = useLocation()
  const [users, setUsers] = useState([])
  const [trips, setTrips] = useState([])
  const [bookings, setBookings] = useState([])
  const [loggedInUserId, setLoggedInUserId] = useState(readStoredUserId)
  const [loginNotice, setLoginNotice] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loggedIn = loggedInUserId !== null
  const currentUser = users.find((user) => user.id === loggedInUserId)

  // Sider man kun må se, når man er logget ind. Ellers sendes man til login.
  const needLogin = (page) => (loggedIn ? page : <Navigate to="/login" replace />)

  async function loadData() {
    const [loadedUsers, loadedTrips, loadedBookings] = await Promise.all([
      apiRequest('/brugere'),
      apiRequest('/ture'),
      apiRequest('/bookings'),
    ])
    setUsers(loadedUsers)
    setTrips(loadedTrips)
    setBookings(loadedBookings)
  }

  useEffect(() => {
    loadData().catch((requestError) => setError(requestError.message))
  }, [])

  // Fjern beskeder, når man skifter side.
  useEffect(() => {
    setMessage('')
    setError('')
  }, [location.pathname])

  function refresh() {
    loadData().catch((requestError) => setError(requestError.message))
  }

  function logout(notice = '') {
    localStorage.removeItem('rideshareToken')
    localStorage.removeItem('rideshareUserId')
    setLoggedInUserId(null)
    setLoginNotice(notice)
  }

  // Fejl fra kald, der kræver login. 401 betyder, at tokenet er udløbet eller mangler.
  function handleError(requestError) {
    if (requestError.status === 401) {
      logout('Din session er udløbet. Log ind igen.')
    } else {
      setError(requestError.message)
    }
  }

  async function login(email, password) {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    localStorage.setItem('rideshareToken', response.token)
    localStorage.setItem('rideshareUserId', String(response.user.id))
    setLoggedInUserId(response.user.id)
    setLoginNotice('')
    await loadData()
  }

  async function submitLogin(email, password) {
    setError('')
    try {
      await login(email, password)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  async function createUser(form) {
    setError('')
    try {
      await apiRequest('/brugere', {
        method: 'POST',
        body: JSON.stringify(form),
      })
      await login(form.email, form.password)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  // createTrip returnerer true, hvis det lykkedes, så formularen kan nulstilles.
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
      handleError(requestError)
      return false
    }
  }

  async function becomeDriver() {
    if (!currentUser) return
    setError('')
    try {
      await apiRequest(`/brugere/${currentUser.id}/bliv-chauffoer`, { method: 'PATCH' })
      setMessage('Du er nu chauffør.')
      await loadData()
    } catch (requestError) {
      handleError(requestError)
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
      handleError(requestError)
    }
  }

  async function updateBooking(bookingId, action) {
    setError('')
    try {
      await apiRequest(`/bookings/${bookingId}/${action}`, { method: 'PATCH' })
      setMessage(`Booking er ${action === 'accepter' ? 'accepteret' : 'afvist'}.`)
      await loadData()
    } catch (requestError) {
      handleError(requestError)
    }
  }

  return (
    <div className="app-shell">
      {location.pathname === '/login' && (
        <header className="hero">
          <p className="eyebrow">AU RideShare · MVP</p>
          <h1>Find et lift. Giv et lift.</h1>
          <p>En enkel demo af bruger-, tur- og booking-flowet med data fra backendens PostgreSQL-database.</p>
        </header>
      )}

      {loggedIn && <NavBar currentUser={currentUser} onLogout={() => logout()} />}

      {message && <div className="notice success">{message}</div>}
      {error && <div className="notice error">{error}</div>}

      <main className="layout">
        <Routes>
          <Route path="/login" element={loggedIn ? <Navigate to="/ture" replace /> : <LoginPage notice={loginNotice} onLogin={submitLogin} onCreateUser={createUser} />} />
          <Route path="/ture" element={needLogin(<TripList trips={trips} currentUser={currentUser} onBook={bookTrip} onRefresh={refresh} />)} />
          <Route path="/opret-tur" element={needLogin(<TripForm currentUser={currentUser} onCreateTrip={createTrip} onBecomeDriver={becomeDriver} />)} />
          <Route path="/bookinger" element={needLogin(<BookingList bookings={bookings} trips={trips} users={users} currentUser={currentUser} onUpdate={updateBooking} />)} />
          <Route path="*" element={<Navigate to="/ture" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App