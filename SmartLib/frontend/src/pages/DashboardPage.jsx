import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import DashboardLayout from '../components/DashboardLayout'
import StatsRow from '../components/StatsRow'
import BooksTable from '../components/BooksTable'
import CatalogTable from '../components/CatalogTable'
import IssueForm from '../components/IssueForm'
import AdminStudents from '../components/AdminStudents'
import AdminOverdue from '../components/AdminOverdue'
import AdminReservations from '../components/AdminReservations'
import StudentHistory from '../components/StudentHistory'
import StudentFines from '../components/StudentFines'
import SettingsPage from '../components/SettingsPlaceholder'
import { GraduationCap, AlertTriangle, Settings, Clock, DollarSign, ClipboardList, Search, Smartphone, Phone, Mail, MapPin } from 'lucide-react'

function ComingSoon({ icon: Icon, title }) {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-center">
      <Icon className="w-16 h-16 mb-4 text-slate-300" />
      <h2 className="text-xl font-bold text-slate-700 mb-2">{title}</h2>
      <p className="text-slate-400 text-sm">This section is coming soon.</p>
    </div>
  )
}

function ProfileTab({ user }) {
  return (
    <div className="max-w-xl">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-5 mb-8">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold
            ${user.role === 'admin' ? 'bg-indigo-600' : 'bg-emerald-600'}`}>
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">{user.name}</h2>
            <span className={`text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full
              ${user.role === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-700'}`}>
              {user.role}
            </span>
          </div>
        </div>
        <div className="space-y-4">
          {[
            [user.role === 'admin' ? 'Admin ID' : 'Student ID', user.studentId || user.adminId],
            ['Name',       user.name],
            ['Email',      user.email],
            ['Mobile',     user.mobile],
            ...(user.role === 'student' ? [
              ['Branch',   user.branch],
              ['Year',     user.year],
            ] : []),
            ['Role',       user.role],
          ].map(([label, val]) => (
            <div key={label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-none">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</span>
              <span className="text-sm font-semibold text-slate-700">{val || 'N/A'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SupportTab() {
  return (
    <div className="max-w-xl space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-extrabold text-slate-800 mb-4">Help & Support</h2>
        {[
          [Phone, 'Library Contact',   'Visit the library desk or call extension 101'],
          [Mail, 'Email Support',     'library@jntugv.edu.in'],
          [Clock, 'Library Hours',     'Mon–Sat: 9:00 AM – 6:00 PM'],
          [MapPin, 'Location',          'Ground Floor, Main Academic Block, JNTUGV Campus'],
        ].map(([Icon, title, desc]) => (
          <div key={title} className="flex items-start gap-4 py-3 border-b border-slate-100 last:border-none">
            <Icon className="w-5 h-5 mt-0.5 text-slate-500" />
            <div>
              <div className="text-sm font-bold text-slate-700">{title}</div>
              <div className="text-xs text-slate-400 mt-0.5">{desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 text-sm text-indigo-700">
        <strong>Fine Policy:</strong> ₹2 per day after due date. Maximum fine per book: ₹100.
        Renewals are free — max 2 per book (+7 days each).
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [tab, setTab]               = useState('dashboard')
  const [search, setSearch]         = useState('')
  const [refreshKey, setRefreshKey] = useState(0)
  const [catalogPage, setCatalogPage] = useState(1)

  function handleIssued() { setRefreshKey(k => k + 1); setTab('books') }

  // Reset catalog page when search changes
  useEffect(() => {
    setCatalogPage(1)
  }, [search])

  function renderContent() {
    // ── ADMIN tabs ──
    if (user.role === 'admin') {
      if (tab === 'dashboard') return (
        <>
          <StatsRow refreshKey={refreshKey} />
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-sm transition-all placeholder:text-slate-400"
              placeholder="Search by Roll No, Book ID, Student Name..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <BooksTable search={search} refreshKey={refreshKey} onAction={() => setRefreshKey(k => k + 1)} />
        </>
      )
      if (tab === 'books')    return <BooksTable search={search} refreshKey={refreshKey} />
      if (tab === 'issue')    return <IssueForm onIssued={handleIssued} />
      if (tab === 'reservations') return <AdminReservations search={search} />
      if (tab === 'overdue')  return <AdminOverdue />
      if (tab === 'catalog')  return (
        <>
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-sm transition-all placeholder:text-slate-400"
              placeholder="Search by Book ID, Title, Author..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <CatalogTable search={search} page={catalogPage} onPageChange={setCatalogPage} user={user} />
        </>
      )
      if (tab === 'students') return <AdminStudents search={search} />
      if (tab === 'profile')  return <ProfileTab user={user} />
      if (tab === 'support')  return <SupportTab />
      if (tab === 'settings') return <SettingsPage />
    }

    // ── STUDENT tabs ──
    if (tab === 'dashboard') return (
      <>
        <div className="mb-6 bg-emerald-50 border border-emerald-100 rounded-2xl px-6 py-4 flex items-center gap-4">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-extrabold text-lg">
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800">Welcome back, {user.name}!</div>
            <div className="text-xs text-slate-500">ID: {user.studentId} · <Smartphone className="w-3 h-3 inline" /> {user.mobile}</div>
          </div>
        </div>
        <BooksTable search="" refreshKey={refreshKey} onAction={() => setRefreshKey(k => k + 1)} />
      </>
    )
    if (tab === 'mybooks')  return <BooksTable search="" refreshKey={refreshKey} onAction={() => setRefreshKey(k => k + 1)} />
    if (tab === 'catalog')  return (
      <>
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 shadow-sm transition-all placeholder:text-slate-400"
            placeholder="Search by Book ID, Title, Author..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <CatalogTable search={search} page={catalogPage} onPageChange={setCatalogPage} user={user} />
      </>
    )
    if (tab === 'history')  return <StudentHistory />
    if (tab === 'fines')    return <StudentFines />
    if (tab === 'profile')  return <ProfileTab user={user} />
    if (tab === 'support')  return <SupportTab />
    if (tab === 'settings') return <SettingsPage />
  }

  return (
    <DashboardLayout activeTab={tab} onTabChange={setTab}>
      {renderContent()}
    </DashboardLayout>
  )
}