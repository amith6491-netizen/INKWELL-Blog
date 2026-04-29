import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { isAuth, isAdmin, user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Signed out')
    navigate('/')
    setDropOpen(false)
  }

  const navLinkClass = ({ isActive }) =>
    `text-sm font-body font-medium tracking-wide transition-colors ${
      isActive ? 'text-ink-900 border-b border-ink-800' : 'text-ink-500 hover:text-ink-900'
    }`

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur border-b border-ink-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl font-display font-bold text-ink-900 tracking-tight">
            Inkwell
          </span>
          <span className="hidden sm:block text-ink-300 text-lg">·</span>
          <span className="hidden sm:block text-xs font-mono text-ink-400 uppercase tracking-widest">
            Blog
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/"      end className={navLinkClass}>Home</NavLink>
          <NavLink to="/blogs"     className={navLinkClass}>Explore</NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
          )}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuth ? (
            <>
              <Link to="/blogs/new" className="btn-primary text-xs px-4 py-2">
                + Write
              </Link>
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 text-sm text-ink-700 hover:text-ink-900 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-ink-200 flex items-center justify-center text-xs font-medium text-ink-700">
                    {user?.username?.[0]?.toUpperCase()}
                  </div>
                  <span className="font-body">{user?.username}</span>
                  <svg className={`w-3 h-3 transition-transform ${dropOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropOpen && (
                  <div
                    className="absolute right-0 top-10 w-44 bg-white border border-ink-100 shadow-lg z-50 py-1"
                    onMouseLeave={() => setDropOpen(false)}
                  >
                    {[
                      { to: '/profile',   label: 'Profile' },
                      { to: '/my-blogs',  label: 'My Blogs' },
                    ].map(({ to, label }) => (
                      <Link
                        key={to}
                        to={to}
                        className="block px-4 py-2 text-sm text-ink-700 hover:bg-parchment transition-colors"
                        onClick={() => setDropOpen(false)}
                      >
                        {label}
                      </Link>
                    ))}
                    <hr className="border-ink-100 my-1" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login"    className="btn-ghost  text-xs px-4 py-2">Sign In</Link>
              <Link to="/register" className="btn-primary text-xs px-4 py-2">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-1.5 text-ink-600"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className={`w-5 h-0.5 bg-current transition-all mb-1 ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
          <div className={`w-5 h-0.5 bg-current transition-all mb-1 ${menuOpen ? 'opacity-0' : ''}`} />
          <div className={`w-5 h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-ink-100 bg-white">
          <div className="px-4 py-3 flex flex-col gap-2">
            {[
              { to: '/',      label: 'Home' },
              { to: '/blogs', label: 'Explore' },
              ...(isAdmin ? [{ to: '/admin', label: 'Admin' }] : []),
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `py-2 text-sm font-body ${isActive ? 'text-ink-900 font-medium' : 'text-ink-500'}`
                }
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            ))}
            <hr className="border-ink-100" />
            {isAuth ? (
              <>
                <Link to="/blogs/new" className="py-2 text-sm text-ink-700" onClick={() => setMenuOpen(false)}>✏️ Write</Link>
                <Link to="/profile"   className="py-2 text-sm text-ink-700" onClick={() => setMenuOpen(false)}>Profile</Link>
                <Link to="/my-blogs"  className="py-2 text-sm text-ink-700" onClick={() => setMenuOpen(false)}>My Blogs</Link>
                <button onClick={handleLogout} className="py-2 text-left text-sm text-red-600">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login"    className="py-2 text-sm text-ink-700" onClick={() => setMenuOpen(false)}>Sign In</Link>
                <Link to="/register" className="py-2 text-sm font-medium text-ink-900" onClick={() => setMenuOpen(false)}>Get Started →</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
