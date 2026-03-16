import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react';

const STUDENT_MENU = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'mybooks',   icon: '📚', label: 'My Books' },
  { id: 'history',   icon: '🕐', label: 'Borrow History' },
  { id: 'fines',     icon: '💰', label: 'My Fines' },
  { id: 'profile',   icon: '👤', label: 'Profile' },
  { id: 'support',   icon: '🎧', label: 'Support' },
]

const ADMIN_MENU = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'books',     icon: '📚', label: 'Issued Books' },
  { id: 'issue',     icon: '➕', label: 'Issue Book' },
  { id: 'reservations', icon: '📋', label: 'Reservations' },
  { id: 'overdue',   icon: '⚠️',  label: 'Overdue' },
  { id: 'catalog',   icon: '🗂️',  label: 'Catalog' },
  { id: 'students',  icon: '🎓', label: 'Students' },
  { id: 'profile',   icon: '👤', label: 'Profile' },
  { id: 'support',   icon: '🎧', label: 'Support' },
]

export default function DashboardLayout({ activeTab, onTabChange, children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const menu = user?.role === 'admin' ? ADMIN_MENU : STUDENT_MENU
  const accentColor = user?.role === 'admin' ? 'indigo' : 'emerald'

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* ── SIDEBAR ── */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} flex-shrink-0 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 overflow-hidden`}>

        {/* Logo */}
        <div className="h-16 flex items-center gap-3 px-4 border-b border-slate-100 flex-shrink-0">
          <img src="/jntugv-logo.jpg" alt="JNTUGV"
            className="w-8 h-8 object-contain rounded-full flex-shrink-0"
            onError={e => e.target.style.display = 'none'} />
          {sidebarOpen && (
            <div className="flex flex-col leading-tight overflow-hidden">
              <span className={`text-sm font-extrabold tracking-tight text-${accentColor}-600`}>SmartLib</span>
              <span className="text-[9px] text-slate-400 truncate">JNTUGV Portal</span>
            </div>
          )}
        </div>

        {/* Menu items */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {menu.map(item => (
            <button key={item.id} onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all
                ${activeTab === item.id
                  ? `bg-${accentColor}-50 text-${accentColor}-700 border-r-2 border-${accentColor}-600`
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
              <span className="text-lg flex-shrink-0">{item.icon}</span>
              {sidebarOpen && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-5 text-sm text-red-500 hover:bg-red-100 transition-all">
                    <LogOut/> Logout
        </button>
      </aside>

      {/* ── MAIN AREA ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── TOP BAR ── */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 flex-shrink-0">

          {/* Left — hamburger + page title */}
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(o => !o)}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
            <div>
              <h1 className="text-base font-bold text-slate-800 capitalize">
                {menu.find(m => m.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide">
                {user?.role === 'admin' ? 'Admin Portal' : 'Student Portal'}
              </p>
            </div>
          </div>

          {/* Right — user info + logout */}
          <div className="flex items-center gap-3 relative">

            {/* Notification bell */}
            <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* User chip */}
            <button onClick={() => setShowUserMenu(o => !o)}
              className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 hover:border-slate-300 transition-all">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0
                ${user?.role === 'admin' ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="hidden sm:flex flex-col items-start leading-tight">
                <span className="text-xs font-semibold text-slate-700">{user?.name}</span>
                <span className="text-[9px] text-slate-400 uppercase tracking-wide">
                  {user?.role === 'admin' ? 'Librarian' : `${user?.branch} · ${user?.year}`}
                </span>
              </div>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {/* Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 top-12 bg-white border border-slate-200 rounded-2xl shadow-xl w-52 z-50 overflow-hidden">
                <div className={`px-4 py-3 border-b border-slate-100 bg-${accentColor}-50`}>
                  <div className="text-sm font-bold text-slate-800">{user?.name}</div>
                  <div className="text-xs text-slate-500">
                    {user?.role === 'admin' ? 'System Librarian' : `${user?.branch} · ${user?.year}`}
                  </div>
                </div>
                {[
                  { icon:'👤', label:'Profile',  id:'profile' },
                  { icon:'⚙️', label:'Settings', id:'settings' },
                  { icon:'🎧', label:'Support',  id:'support' },
                ].map(item => (
                  <button key={item.id}
                    onClick={() => { onTabChange(item.id); setShowUserMenu(false) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-all">
                    <span>{item.icon}</span> {item.label}
                  </button>
                ))}
                <div className="border-t border-slate-100">
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-all">
                    <span>🚪</span> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* ── PAGE CONTENT ── */}
        <main className="flex-1 overflow-y-auto p-6" onClick={() => setShowUserMenu(false)}>
          {children}
        </main>
      </div>
    </div>
  )
}
