import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function StudentLoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [rollNo, setRollNo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchLogin = async (studentId, password) => {
    try {
      const res = await fetch("http://localhost:3000/api/login/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, password })
      });
      let data = {};
      try {
        data = await res.json(); // try parsing JSON
      } catch {
        data = {}; // fallback if no JSON returned
      }
      return { status: res.status, data };

    } catch (err) {
      console.log(err);
      return 500;
    }
  }

  async function handleSubmit(e) {

    e.preventDefault()
    setLoading(true);
    setError('');
    const res = await fetchLogin(rollNo, password);
    console.log(res.status)
    if (res.status == 200) {
      login({
        studentId: rollNo,
        role: 'student',
        ...res.data
      })
      navigate('/dashboard')
    } else if (res.status == 401) {
      setError('Invalid Roll No or Password.')
    } else if (res.status == 404) {
      setError('Student not Found.')
    } else {
      setError(res.data.message || 'Something went wrong');
    }
    setLoading(false)
  }

  const inp = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all placeholder:text-slate-400"

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(5,150,105,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(16,185,129,0.05) 0%, transparent 60%), #f8fafc' }}>

      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-10 shadow-2xl shadow-slate-200/60">

          {/* Back */}
          <Link to="/" className="inline-flex items-center gap-1.5 text-slate-400 text-xs hover:text-slate-600 transition-colors mb-7">
            ← Back to Home
          </Link>

          {/* Logo + title */}
          <div className="flex items-center gap-3 mb-7">
            <img src="/jntugv-logo.jpg" alt="JNTUGV"
              className="w-11 h-11 object-contain rounded-full border border-slate-200"
              onError={e => e.target.style.display = 'none'} />
            <div>
              <div className="text-sm font-extrabold text-emerald-700 leading-tight">JNTUGV SmartLib</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest">Student Login</div>
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mb-1">Welcome, Student!</h1>
          <p className="text-slate-400 text-sm mb-7">Sign in with your Roll Number to access your library account.</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Roll Number</label>
              <input className={inp} value={rollNo}
                onChange={e => { setRollNo(e.target.value); setError('') }}
                placeholder="e.g. 22A91A0501" autoFocus />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Password</label>
              <input className={inp} type="password" value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder="••••••••" />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl flex items-start gap-2">
                ⚠ {error}
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-emerald-600 text-white py-3.5 rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all hover:-translate-y-0.5 shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:translate-y-0">
              {loading ? 'Signing in...' : 'Access My Library →'}
            </button>
          </form>

          {/* Switch */}
          <div className="mt-5 text-center text-sm text-slate-400">
            Librarian?{' '}
            <Link to="/login/admin" className="text-indigo-600 font-bold hover:underline">Admin Login →</Link>
          </div>

          {/* Demo */}
          <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-400 leading-relaxed">
            <div className="font-bold text-slate-600 mb-1.5">Demo Accounts</div>
            <div className="flex flex-col gap-1">
              <div><code className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-mono">student001</code> / <code className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-mono">pass123</code></div>
              <div><code className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-mono">student002</code> / <code className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-mono">pass456</code></div>
            </div>
          </div>
        </div>

        {/* Info panel — below the card */}
        <div className="mt-5 bg-emerald-600 rounded-2xl p-6 text-white">
          <div className="text-sm font-bold mb-3 text-emerald-100 uppercase tracking-widest">What you can do</div>
          <div className="grid grid-cols-2 gap-3">
            {[['📚', 'View borrowed books'], ['🔄', 'Renew before due date'], ['💰', 'Check your fines'], ['🔔', 'Get reminders']].map(([icon, label]) => (
              <div key={label} className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2.5">
                <span className="text-lg">{icon}</span>
                <span className="text-xs font-medium text-emerald-100">{label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
