import { NavLink } from 'react-router'

// Menu øverst. Vises kun, når man er logget ind.
function NavBar({ currentUser, onLogout }) {
  return (
    <nav className="navbar">
      <div className="nav-links">
        <NavLink to="/ture">Ture</NavLink>
        <NavLink to="/opret-tur">Opret tur</NavLink>
        <NavLink to="/bookinger">Bookinger</NavLink>
      </div>
      <div className="nav-user">
        {currentUser && <span>{currentUser.navn}</span>}
        <button className="secondary" onClick={onLogout}>Log ud</button>
      </div>
    </nav>
  )
}

export default NavBar