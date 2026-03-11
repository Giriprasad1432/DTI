import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminLoginPage() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [adminId, setAdminId]   = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)



    const fetchLogin = async (adminId, password) => {
    try {
      const res = await fetch("http://localhost:3000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId, password })
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
    const res = await fetchLogin(adminId, password);
    console.log(res.status)
    if (res.status == 200) {
      login({
        adminId: adminId,
        role: 'admin',
        ...res.data
      })
      navigate('/dashboard')
    } else if (res.status == 401) {
      setError('Invalid Roll No or Password.')
    } else if (res.status == 404) {
      setError('admin not Found.')
    } else {
      setError(res.data.message || 'Something went wrong');
    }
    setLoading(false)
  }



  // function handleSubmit(e) {
  //   e.preventDefault()
  //   setLoading(true); setError('')
  //   const result = login(adminId, password)
  //   if (result.success && result.role === 'admin') {
  //     navigate('/dashboard')
  //   } else if (result.success && result.role === 'admin') {
  //     setError('This is a admin account. Please use admin Login.')
  //   } else {
  //     setError('Invalid Admin ID or Password.')
  //   }
  //   setLoading(false)
  // }

  const inp = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"

  return (
    <div className="min-h-screen flex items-center justify-center p-6"
      style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(79,70,229,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(99,102,241,0.05) 0%, transparent 60%), #f8fafc' }}>

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
              onError={e => e.target.style.display='none'} />
            <div>
              <div className="text-sm font-extrabold text-indigo-600 leading-tight">JNTUGV SmartLib</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-widest">Admin Login</div>
            </div>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight mb-1">Librarian Access</h1>
          <p className="text-slate-400 text-sm mb-7">Sign in with your admin credentials to manage the library.</p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Admin ID</label>
              <input className={inp} value={adminId}
                onChange={e => { setAdminId(e.target.value); setError('') }}
                placeholder="e.g. admin_lib" autoFocus />
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
              className="w-full bg-indigo-600 text-white py-3.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all hover:-translate-y-0.5 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:translate-y-0">
              {loading ? 'Signing in...' : 'Sign In as Admin →'}
            </button>
          </form>

          {/* Switch */}
          <div className="mt-5 text-center text-sm text-slate-400">
            admin?{' '}
            <Link to="/login/admin" className="text-emerald-600 font-bold hover:underline">admin Login →</Link>
          </div>

          {/* Demo */}
          <div className="mt-5 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-400 leading-relaxed">
            <div className="font-bold text-slate-600 mb-1.5">Demo Account</div>
            <div><code className="bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-mono">admin_lib</code> / <code className="bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-mono">admin789</code></div>
          </div>
        </div>

        {/* Info panel — below the card */}
        <div className="mt-5 bg-indigo-600 rounded-2xl p-6 text-white">
          <div className="text-sm font-bold mb-3 text-indigo-100 uppercase tracking-widest">Admin capabilities</div>
          <div className="grid grid-cols-2 gap-3">
            {[['📊','Live dashboard'],['📋','Issue books'],['🔍','Search records'],['📱','WhatsApp alerts'],['💰','Fine calculator'],['🔄','Renew & return']].map(([icon, label]) => (
              <div key={label} className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2.5">
                <span className="text-lg">{icon}</span>
                <span className="text-xs font-medium text-indigo-100">{label}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
