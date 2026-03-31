import { useState } from 'react'
import { Settings, User, Lock, CheckCircle, AlertTriangle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { updateProfile, changePassword } from '../api/books'

export default function SettingsPage() {
  const { user, login } = useAuth()

  // Profile form
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [mobile, setMobile] = useState(user?.mobile || '')
  const [branch, setBranch] = useState(user?.branch || 'CSE')
  const [year, setYear] = useState(user?.year || '1st Year')
  const [profileMsg, setProfileMsg] = useState(null)
  const [profileLoading, setProfileLoading] = useState(false)

  // Password form
  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [pwdMsg, setPwdMsg] = useState(null)
  const [pwdLoading, setPwdLoading] = useState(false)

  const inp = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-slate-400"

  const userId = user?.id

  async function handleProfileSave(e) {
    e.preventDefault()
    setProfileLoading(true)
    setProfileMsg(null)
    try {
      const res = await updateProfile({ role: user.role, userId, name, email, mobile, branch, year })
      if (res.success) {
        // Update the local auth context so the UI reflects changes immediately
        login({ ...user, name, email, mobile, branch, year })
        setProfileMsg({ type: 'success', text: `${user.role === 'admin' ? 'Admin' : 'Student'} profile updated successfully!` })
      }
    } catch (err) {
      setProfileMsg({ type: 'error', text: err.response?.data?.error || 'Failed to update profile' })
    }
    setProfileLoading(false)
  }

  async function handlePasswordChange(e) {
    e.preventDefault()
    setPwdMsg(null)

    if (newPwd.length < 4) {
      setPwdMsg({ type: 'error', text: 'New password must be at least 4 characters.' })
      return
    }
    if (newPwd !== confirmPwd) {
      setPwdMsg({ type: 'error', text: 'New passwords do not match.' })
      return
    }

    setPwdLoading(true)
    try {
      const res = await changePassword({ role: user.role, userId, currentPassword: currentPwd, newPassword: newPwd })
      if (res.success) {
        setPwdMsg({ type: 'success', text: 'Password changed successfully!' })
        setCurrentPwd('')
        setNewPwd('')
        setConfirmPwd('')
      }
    } catch (err) {
      setPwdMsg({ type: 'error', text: err.response?.data?.error || 'Failed to change password' })
    }
    setPwdLoading(false)
  }

  return (
    <div className="max-w-2xl space-y-6 pb-20 md:pb-0">

      {/* ── Profile Information ── */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 md:px-7 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
          <User className="w-4 h-4 text-emerald-500" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-balance">Profile Information</span>
        </div>

        <form onSubmit={handleProfileSave} className="p-5 md:p-7 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">{user?.role === 'admin' ? 'Admin ID' : 'Roll Number'}</label>
              <input className={inp + " bg-slate-100 cursor-not-allowed"} value={userId} disabled />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Role Type</label>
              <input className={inp + " bg-slate-100 cursor-not-allowed"} value={user?.role} disabled />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Full Name</label>
              <input className={inp} value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Email Address</label>
              <input className={inp} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your.email@jntugv.edu.in" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Mobile Number</label>
              <input className={inp} value={mobile} onChange={e => setMobile(e.target.value)} placeholder="10-digit mobile" />
            </div>
            {user?.role === 'student' && (
              <>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Department</label>
                  <select className={inp} value={branch} onChange={e => setBranch(e.target.value)}>
                    {['CSE','ECE','EEE','IT','CIVIL','METALLURGY','MECH'].map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Academic Year</label>
                  <select className={inp} value={year} onChange={e => setYear(e.target.value)}>
                    {['1st Year','2nd Year','3rd Year','4th Year'].map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
              </>
            )}
          </div>

          {profileMsg && (
            <div className={`flex items-start gap-3 px-4 py-3 rounded-xl text-sm font-medium ${profileMsg.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-600'}`}>
              {profileMsg.type === 'success' ? <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <button type="submit" disabled={profileLoading}
            className="w-full sm:w-auto px-10 py-3.5 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-100 disabled:opacity-50">
            {profileLoading ? 'Saving Info...' : 'Save Profile Details'}
          </button>
        </form>
      </div>

      {/* ── Change Password ── */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 md:px-7 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
          <Lock className="w-4 h-4 text-amber-500" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Update Password</span>
        </div>

        <form onSubmit={handlePasswordChange} className="p-5 md:p-7 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Current Password</label>
              <input className={inp} type="password" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">New Password</label>
              <input className={inp} type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-2">Confirm New Password</label>
              <input className={inp} type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} placeholder="••••••••" />
            </div>
          </div>

          {pwdMsg && (
            <div className={`flex items-start gap-3 px-4 py-3 rounded-xl text-sm font-medium ${pwdMsg.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-600'}`}>
              {pwdMsg.type === 'success' ? <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />}
              <span>{pwdMsg.text}</span>
            </div>
          )}

          <button type="submit" disabled={pwdLoading}
            className="w-full sm:w-auto px-10 py-3.5 bg-amber-500 text-white text-sm font-bold rounded-xl hover:bg-amber-600 transition-all active:scale-95 shadow-lg shadow-amber-100 disabled:opacity-50">
            {pwdLoading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  )
}
