import { useState } from 'react'

// Aktiv bruger, opret bruger og log ind.
// Formularernes tekst ligger her. Selve kaldene til backend ligger i App.jsx.
function UserPanel({ users, currentUserId, currentUser, onSelectUser, onBecomeDriver, onCreateUser, onLogin }) {
  const [userForm, setUserForm] = useState({ navn: '', email: '', password: '' })
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })

  async function submitCreateUser(event) {
    event.preventDefault()
    const created = await onCreateUser(userForm)
    if (created) setUserForm({ navn: '', email: '', password: '' })
  }

  async function submitLogin(event) {
    event.preventDefault()
    const loggedIn = await onLogin(loginForm.email, loginForm.password)
    if (loggedIn) setLoginForm({ email: '', password: '' })
  }

  return (
    <section className="panel">
      <h2>Aktiv bruger</h2>
      <select value={currentUserId} onChange={(event) => onSelectUser(event.target.value)}>
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
          {!currentUser.erChauffoer && <button onClick={onBecomeDriver}>Bliv chauffør</button>}
        </div>
      )}

      <h2>Opret bruger</h2>
      <form onSubmit={submitCreateUser}>
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
  )
}

export default UserPanel