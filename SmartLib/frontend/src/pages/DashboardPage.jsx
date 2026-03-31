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
    <div className="max-w-2xl">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 mb-8">
          <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white text-3xl font-extrabold shadow-lg
            ${user.role === 'admin' ? 'bg-indigo-600 shadow-indigo-100' : 'bg-emerald-600 shadow-emerald-100'}`}>
            {user.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 mb-1">{user.name}</h2>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg
                ${user.role === 'admin' ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                {user.role}
              </span>
              {user.branch && (
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                  {user.branch}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-1">
          {[
            [user.role === 'admin' ? 'Admin ID' : 'Roll Number', user.id],
            ['Full Name',  user.name],
            ['Email Address', user.email],
            ['Phone Number',  user.mobile],
            ...(user.role === 'student' ? [
              ['Department',  user.branch],
              ['Academic Year', user.year],
            ] : []),
          ].map(([label, val]) => (
            <div key={label} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b border-slate-50 last:border-none gap-1 sm:gap-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</span>
              <span className="text-sm font-semibold text-slate-700 break-all">{val || 'Not provided'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SupportTab() {
  return (
    <div className="max-w-2xl space-y-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-5 md:p-6 shadow-sm">
        <h2 className="text-lg font-extrabold text-slate-800 mb-5">Help & Support</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            [Phone, 'Library Desk',   'Ext. 101 / 102'],
            [Mail, 'Email',           'library@jntugv.edu.in'],
            [Clock, 'Working Hours',  'Mon–Sat: 9AM–6PM'],
            [MapPin, 'Location',      'Ground Floor, Main Block'],
          ].map(([Icon, title, desc]) => (
            <div key={title} className="flex items-start gap-3 p-3 rounded-xl border border-slate-50 bg-slate-50/50">
              <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center flex-shrink-0 text-slate-400">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-700 truncate">{title}</div>
                <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-indigo-600 rounded-2xl p-6 text-white shadow-lg shadow-indigo-100 relative overflow-hidden">
         <div className="relative z-10">
           <div className="flex items-center gap-2 mb-2">
             <AlertTriangle className="w-4 h-4 text-indigo-200" />
             <span className="text-xs font-bold uppercase tracking-wider text-indigo-100">Quick Policy</span>
           </div>
           <p className="text-sm leading-relaxed font-medium">Fines are calculated at ₹2/day for overdue books. You can renew items up to 2 times via the portal.</p>
         </div>
         <div className="absolute -right-4 -bottom-4 opacity-10">
           <GraduationCap className="w-32 h-32" />
         </div>
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
            <div className="text-xs text-slate-500">ID: {user.id} · <Smartphone className="w-3 h-3 inline" /> {user.mobile}</div>
          </div>
        </div>
        <BooksTable search="" limit={5} refreshKey={refreshKey} onAction={() => setRefreshKey(k => k + 1)} />
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