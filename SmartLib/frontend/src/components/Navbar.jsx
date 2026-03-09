import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user } = useAuth()
  const { pathname } = useLocation()

  // Hide navbar completely when logged in — dashboard has its own layout
  if (user) return null

  const isActive = (to) => pathname === to

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 px-8 flex items-center justify-between h-16 sticky top-0 z-50 shadow-sm">

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

      {/* Nav links */}
      <div className="flex items-center lg:gap-7 lg:px-10">
        <Link to={'/'} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${isActive('/') ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>Home</Link>
        {/* Login buttons */}
      
        <Link to="/login/student"
          className={`flex items-center gap-1.5 text-sm font-semibold text-emerald-700 border border-emerald-200 shadow-md shadow-emerald-100 px-4 py-2 rounded-lg transition-all
          ${isActive('/login/student') ? 'bg-emerald-300': 'hover:bg-emerald-50 hover:border-emerald-400' }`}>
          <span className="text-base">🎓</span> Student
        </Link>
        <Link to="/login/admin"
          className={`flex border border-indigo-300 items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-all shadow-md shadow-indigo-200 hover:-translate-y-0.5
           ${isActive('/login/admin') ? 'bg-indigo-600 text-white': 'text-slate-500 hover:bg-indigo-100  hover:border-indigo-700 ' }`}>
          <span className="text-base">🔑</span> Admin
        </Link>
        <Link to={'/about'} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${isActive('/about') ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}>About</Link>
      </div>
    </nav>
  )
}
