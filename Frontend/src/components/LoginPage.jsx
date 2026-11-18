import { useState } from 'react'

// Side til at logge ind eller oprette en bruger.
// notice er en besked, fx "Din session er udløbet".
function LoginPage({ notice, onLogin, onCreateUser }) {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [userForm, setUserForm] = useState({ navn: '', email: '', password: '' })

  function submitLogin(event) {
    event.preventDefault()
    onLogin(loginForm.email, loginForm.password)
  }

  function submitCreateUser(event) {
    event.preventDefault()
    onCreateUser(userForm)
  }

  return (
    <>
      {notice && <div className="notice error wide">{notice}</div>}

      <section className="panel">
        <h2>Log ind</h2>
        <form onSubmit={submitLogin}>
          <input required type="email" placeholder="AU-email" value={loginForm.email} onChange={(event) => setLoginForm({ ...loginForm, email: event.target.value })} />
          <input required type="password" placeholder="Password" value={loginForm.password} onChange={(event) => setLoginForm({ ...loginForm, password: event.target.value })} />
          <button type="submit">Log ind</button>
        </form>
      </section>

      <section className="panel">
        <h2>Opret bruger</h2>
        <form onSubmit={submitCreateUser}>
          <input required placeholder="Navn" value={userForm.navn} onChange={(event) => setUserForm({ ...userForm, navn: event.target.value })} />
          <input required type="email" placeholder="AU-email" value={userForm.email} onChange={(event) => setUserForm({ ...userForm, email: event.target.value })} />
          <input required minLength="6" type="password" placeholder="Password" value={userForm.password} onChange={(event) => setUserForm({ ...userForm, password: event.target.value })} />
          <button type="submit">Opret bruger</button>
        </form>
      </section>
    </>
  )
}

export default LoginPage