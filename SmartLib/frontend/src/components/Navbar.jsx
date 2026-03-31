import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import { GraduationCap, Key, Menu, X } from 'lucide-react'

export default function Navbar() {
  const { user } = useAuth()
  const { pathname } = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Hide top navbar ONLY on dashboard — it has its own sidebar layout
  if (user && pathname.startsWith('/dashboard')) return null

  const isActive = (to) => pathname === to

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 md:px-8 flex items-center justify-between h-16 sticky top-0 z-50 shadow-sm">

      {/* Brand */}
      <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity flex-shrink-0">
        <img src="/jntugv-logo.jpg" alt="JNTUGV"
          className="w-10 h-10 object-contain rounded-full flex-shrink-0"
          onError={e => e.target.style.display = 'none'} />
        <div className="flex flex-col leading-tight ">
          <span className="text-[20px] font-extrabold text-indigo-600 tracking-tight">JNTUGV</span>
          <span className="text-[12px] text-slate-400 max-w-[350px] truncate hidden sm:block">
            Jawaharlal Nehru Technological University Gurajada Vizianagaram
          </span>
        </div>
      </Link>

      {/* Desktop Nav links */}
      <div className="hidden md:flex items-center gap-7">
        <Link to={'/'} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${isActive('/') ? ' bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>Home</Link>
        {/* Login buttons */}

        {user ? (
          <Link to="/dashboard"
            className="flex items-center gap-2 text-sm font-bold bg-indigo-600 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition-all hover:-translate-y-0.5 shadow-lg shadow-indigo-100">
            Go to Dashboard →
          </Link>
        ) : (
          <>
            <Link to="/login/student"
              className={`flex items-center gap-1.5 text-sm font-semibold text-slate-500 border px-4 py-2 rounded-lg transition-all
              ${isActive('/login/student') ? ' bg-emerald-500 border-2  text-white' : 'hover:bg-emerald-50 hover:border-emerald-400'}`}>
              <GraduationCap className="w-4 h-4" /> Student
            </Link>
            <Link to="/login/admin"
              className={`flex border items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:-translate-y-0.5 hover:border-indigo-400
               ${isActive('/login/admin') ? 'border-gray-700 bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'text-slate-500 hover:bg-indigo-100 '}`}>
              <Key className="w-4 h-4" /> Admin
            </Link>
          </>
        )}
        <Link to={'/about'} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${isActive('/about') ? 'border-gray-700 bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>About</Link>
      </div>

      {/* Mobile menu button */}
      <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-500 hover:text-slate-700">
        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-200 shadow-lg md:hidden">
          <div className="flex flex-col p-4 space-y-2">
            <Link to={'/'} onClick={() => setMobileMenuOpen(false)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${isActive('/') ? ' bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>Home</Link>
            {user ? (
              <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-100 transition-all">
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/login/student" onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-emerald-700 border border-emerald-200 shadow-md shadow-emerald-100 transition-all
                  ${isActive('/login/student') ? ' bg-emerald-500 border-2 border-gray-700 text-white' : 'hover:bg-emerald-50 hover:border-emerald-400'}`}>
                  <GraduationCap className="w-4 h-4" /> Student Login
                </Link>
                <Link to="/login/admin" onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border border-indigo-300 shadow-md shadow-indigo-200 transition-all hover:-translate-y-0.5
                   ${isActive('/login/admin') ? 'border-gray-700 bg-indigo-600 text-white' : 'text-slate-500 hover:bg-indigo-100 '}`}>
                  <Key className="w-4 h-4" /> Admin Login
                </Link>
              </>
            )}
            <Link to={'/about'} onClick={() => setMobileMenuOpen(false)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${isActive('/about') ? 'border-gray-700 bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>About</Link>
          </div>
        </div>
      )}
    </nav>
  )
}
