import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNotifications } from '../hooks/useNotifications'
import { Link, useNavigate } from 'react-router-dom'
import { LogOut, BarChart3, BookOpen, Clock, DollarSign, User, Headphones, Plus, ClipboardList, AlertTriangle, FolderOpen, GraduationCap, Settings } from 'lucide-react';

const STUDENT_MENU = [
  { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
  { id: 'mybooks', icon: BookOpen, label: 'My Books' },
  { id: 'catalog', icon: FolderOpen, label: 'Browse Catalog' },
  { id: 'history', icon: Clock, label: 'Borrow History' },
  { id: 'fines', icon: DollarSign, label: 'My Fines' },
  { id: 'profile', icon: User, label: 'Profile' },
  { id: 'support', icon: Headphones, label: 'Support' },
]

const ADMIN_MENU = [
  { id: 'dashboard', icon: BarChart3, label: 'Dashboard' },
  { id: 'books', icon: BookOpen, label: 'Issued Books' },
  { id: 'issue', icon: Plus, label: 'Issue Book' },
  { id: 'reservations', icon: ClipboardList, label: 'Reservations' },
  { id: 'overdue', icon: AlertTriangle, label: 'Overdue' },
  { id: 'catalog', icon: FolderOpen, label: 'Catalog' },
  { id: 'students', icon: GraduationCap, label: 'Students' },
  { id: 'profile', icon: User, label: 'Profile' },
  { id: 'support', icon: Headphones, label: 'Support' },
]

export default function DashboardLayout({ activeTab, onTabChange, children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotificationMenu, setShowNotificationMenu] = useState(false)
  const { notifications, unreadCount, markAsRead } = useNotifications(user?.id)

  const menu = user?.role === 'admin' ? ADMIN_MENU : STUDENT_MENU
  const accentColor = user?.role === 'admin' ? 'indigo' : 'emerald'

  function handleLogout() {
    logout()
    navigate('/')
  }

  function handleTabChange(id) {
    onTabChange(id)
    setMobileSidebarOpen(false) // Auto-close on mobile
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden relative">

      {/* ── MOBILE OVERLAY ── */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[60] lg:hidden animate-in fade-in duration-200"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-[70] 
        ${sidebarOpen ? 'w-64' : 'w-20'} 
        ${mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
        flex-shrink-0 bg-white border-r border-slate-200 flex flex-col transition-all duration-300 ease-out overflow-hidden
      `}>

        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <img src="/jntugv-logo.jpg" alt="JNTUGV"
              className="w-8 h-8 object-contain rounded-full flex-shrink-0"
              onError={e => e.target.style.display = 'none'} />
            {(sidebarOpen || mobileSidebarOpen) && (
              <div className="flex flex-col leading-tight overflow-hidden">
                <span className={`text-sm font-extrabold tracking-tight text-${accentColor}-600`}>SmartLib</span>
                <span className="text-[9px] text-slate-400 truncate">JNTUGV Portal</span>
              </div>
            )}
          </div>
          {/* Close button for mobile inside sidebar if needed, or just rely on hamburger */}
        </div>

        {/* Menu items */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {menu.map(item => (
            <button key={item.id} onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all
                ${activeTab === item.id
                  ? `bg-${accentColor}-50 text-${accentColor}-700 border-r-2 border-${accentColor}-600`
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
              <item.icon className={`w-5 h-5 flex-shrink-0 ${activeTab === item.id ? `text-${accentColor}-600` : 'text-slate-400'}`} />
              {(sidebarOpen || mobileSidebarOpen) && <span className="truncate">{item.label}</span>}
            </button>
          ))}
        </nav>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-5 text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {(sidebarOpen || mobileSidebarOpen) && <span>Logout</span>}
        </button>
      </aside>

      {/* ── MAIN AREA ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* ── TOP BAR ── */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 flex-shrink-0">

          {/* Left — hamburger + page title */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Mobile Menu Button */}
            <button onClick={() => setMobileSidebarOpen(o => !o)}
              className="lg:hidden text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            {/* Desktop Collapse Button */}
            <button onClick={() => setSidebarOpen(o => !o)}
              className="hidden lg:block text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transition-transform duraiton-300 ${!sidebarOpen ? 'rotate-180' : ''}`}>
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div>
              <h1 className="text-sm md:text-base font-bold text-slate-800 capitalize truncate max-w-[120px] md:max-w-none">
                {menu.find(m => m.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-wide hidden xs:block">
                {user?.role === 'admin' ? 'Admin Portal' : 'Student Portal'}
              </p>
            </div>
          </div>

          {/* Right — user info + logout */}
          <div className="flex items-center gap-3 relative">

            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => { setShowNotificationMenu(o => !o); setShowUserMenu(false) }}
                className={`relative p-2 rounded-lg transition-all ${showNotificationMenu ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'}`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
              </button>

              {showNotificationMenu && (
                <div className="absolute right-0 top-12 bg-white border border-slate-200 rounded-2xl shadow-xl w-80 z-50 overflow-hidden flex flex-col max-h-[400px]">
                  <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between sticky top-0">
                    <div className="text-sm font-bold text-slate-800">Notifications</div>
                    {unreadCount > 0 && <span className="text-[10px] font-bold bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">{unreadCount} New</span>}
                  </div>
                  <div className="overflow-y-auto flex-1 p-2">
                    {notifications?.length === 0 ? (
                      <div className="text-center py-8 text-slate-400 text-xs text-balance">You're all caught up! No notifications yet.</div>
                    ) : (
                      notifications?.map(n => (
                        <div
                          key={n._id}
                          onClick={() => !n.isRead && markAsRead(n._id)}
                          className={`p-3 rounded-xl mb-1 cursor-pointer transition-colors ${n.isRead ? 'opacity-60 hover:bg-slate-50' : 'bg-indigo-50/50 hover:bg-indigo-50'}`}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className={`text-xs font-bold ${n.type === 'overdue' ? 'text-red-600' : 'text-slate-800'}`}>{n.title}</div>
                            {!n.isRead && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full flex-shrink-0 mt-1"></div>}
                          </div>
                          <div className="text-[11px] text-slate-500 leading-snug">{n.message}</div>
                          <div className="text-[9px] text-slate-400 mt-2 font-medium uppercase">{new Date(n.createdAt).toLocaleDateString()}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User chip */}
            <button onClick={() => { setShowUserMenu(o => !o); setShowNotificationMenu(false) }}
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
                <polyline points="6 9 12 15 18 9" />
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
                  { icon: User, label: 'Profile', id: 'profile' },
                  { icon: Settings, label: 'Settings', id: 'settings' },
                  { icon: Headphones, label: 'Support', id: 'support' },
                ].map(item => (
                  <button key={item.id}
                    onClick={() => { onTabChange(item.id); setShowUserMenu(false) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 transition-all">
                    <item.icon className="w-4 h-4" /> {item.label}
                  </button>
                ))}
                <div className="border-t border-slate-100">
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-all">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* ── PAGE CONTENT ── */}
        <main className="flex-1 overflow-y-auto p-6" onClick={() => { setShowUserMenu(false); setShowNotificationMenu(false); }}>
          {children}
        </main>
      </div>
    </div>
  )
}
