import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Bell, RefreshCw, DollarSign, Search, BarChart3, CheckCircle, Clock, GraduationCap } from 'lucide-react'


function FeatureCard({ icon: Icon, title, desc }) {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 hover:-translate-y-2 hover:shadow-xl hover:border-indigo-300 hover:bg-white transition-all duration-300">
      <Icon className="w-10 h-10 mb-4 text-indigo-600" />
      <h3 className="text-base font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  )
}

export default function HomePage() {
  const orbRef = useRef(null)

  useEffect(() => {
    function handleMouse(e) {
      if (!orbRef.current) return
      const x = (e.clientX / window.innerWidth - 0.5) * 30
      const y = (e.clientY / window.innerHeight - 0.5) * 30
      orbRef.current.style.transform = `translate(${x}px,${y}px)`
    }
    window.addEventListener('mousemove', handleMouse)
    return () => window.removeEventListener('mousemove', handleMouse)
  }, [])

  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="min-h-screen bg-[#0f0f23] relative flex items-center px-16 gap-16 overflow-hidden">

        {/* Library background image — place your photo at public/lib.png */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'url(./lib.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.8,
          }} />

        {/* Mouse-follow orb */}
        <div ref={orbRef} className="absolute w-[600px] h-[600px] rounded-full pointer-events-none -top-24 -left-24 transition-transform duration-100"
          style={{ background: 'radial-gradient(circle,rgba(79,70,229,0.25) 0%,transparent 70%)' }} />
        <div className="absolute w-96 h-96 rounded-full pointer-events-none -bottom-12 right-48 orb-pulse"
          style={{ background: 'radial-gradient(circle,rgba(99,102,241,0.15) 0%,transparent 70%)' }} />

        {/* ── Hero Content ── */}
        <div className="flex-1 relative z-10 animate-slide-up">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 px-4 py-1.5 rounded-full text-xs font-medium mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 blink-dot" />
            Jawaharlal Nehru Technological University Gurajada Vizianagaram
          </div>

          {/* Heading — your layout preserved */}
          <div className='flex w-screen justify-center items-center'>
          <h1 className="text-6xl xl:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mb-5 text-center">
            Smart Library
            <div className="flex flex-row gap-10">
              <span style={{
                background: 'linear-gradient(135deg,#6366f1,#a78bfa,#60a5fa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'inline-block',
                paddingBottom: '0.2em',
              }}>
                Management
              </span>
              <span>System</span>
            </div>
          </h1>
          </div>

          <div className='flex flex-col items-center justify-center gap-2'>

           <p className="text-lg text-white leading-relaxed lg:w-[900px] text-center mb-9 mt-5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 p-6 rounded-2xl shadow-lg">
            A modern digital library portal for JNTUGV students and faculty — track books, manage due dates, and get instant WhatsApp reminders.
          </p>

          {/* CTA buttons — updated to separate login pages */}
          <div className="flex gap-4 flex-wrap mb-12">
            <Link to="/login/student"
              className="flex items-center gap-2 bg-emerald-600 text-white px-7 py-3.5 rounded-xl text-base font-semibold hover:bg-emerald-500 hover:-translate-y-0.5 transition-all shadow-[0_0_30px_rgba(5,150,105,0.4)]">
              Student Portal →
            </Link>
            <Link to="/login/admin"
              className="flex items-center gap-2 bg-indigo-600 text-white px-7 py-3.5 rounded-xl text-base font-semibold hover:bg-indigo-500 hover:-translate-y-0.5 transition-all shadow-[0_0_30px_rgba(99,102,241,0.4)]">
              Admin Portal →
            </Link>
            <Link to="/about"
              className="bg-transparent text-slate-400 border border-white/10 px-7 py-3.5 rounded-xl text-base font-medium hover:border-white/30 hover:text-white transition-all">
              Learn More
            </Link>
          </div>

          {/* Stats */}
           <div className="flex flex-wrap gap-20 animate-slide-up delay-1100">
            {[
              [BookOpen, '2,400+', 'Books Available'],
              [GraduationCap, '1,200+', 'Active Students'],
              [CheckCircle, '98%',    'On-time Returns'],
              [Clock, '24/7',   'Portal Access'],
            ].map(([Icon, val, label]) => (
              <div key={label} className="bg-white/[0.15] backdrop-blur-md border border-white/[0.2] rounded-2xl px-5 py-4 text-center min-w-[110px] hover:-translate-y-1 hover:bg-white/[0.25] hover:border-indigo-400/50 transition-all shadow-lg shadow-black/20">
                <Icon className="w-6 h-6 mb-1 mx-auto text-indigo-300" />
                <div className="text-xl font-extrabold text-white tracking-tight">{val}</div>
                <div className="text-[10px] text-slate-300 uppercase tracking-wide mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
        </div>

      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-16 bg-white">
        <div className="text-center mb-16">
          <span className="inline-block bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">Features</span>
          <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-3">Everything you need in one place</h2>
          <p className="text-slate-400 text-base">Designed for JNTUGV students, faculty, and library staff</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <FeatureCard icon={BookOpen} title="Book Tracking"   desc="Know exactly which books you have, when they're due, and how many renewals you have left." />
          <FeatureCard icon={Bell} title="WhatsApp Alerts" desc="Librarians send instant WhatsApp reminders to students with overdue books — no manual effort." />
          <FeatureCard icon={RefreshCw} title="Easy Renewals"   desc="Renew books in one click. Up to 2 renewals per book, each adding 7 more days." />
          <FeatureCard icon={DollarSign} title="Fine Calculator" desc="Auto-calculates overdue fines at ₹2/day so students always know what they owe." />
          <FeatureCard icon={Search} title="Smart Search"    desc="Admins can search by student name, roll number, or book ID to find any record instantly." />
          <FeatureCard icon={BarChart3} title="Live Dashboard"  desc="Real-time stats showing total issued, active, due-soon, and overdue counts at a glance." />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-16" style={{ background: 'linear-gradient(135deg,#0f0f23 0%,#1e1b4b 100%)' }}>
        <div className="text-center mb-16">
          <span className="inline-block bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full border border-indigo-500/20 mb-4">How It Works</span>
          <h2 className="text-4xl font-extrabold text-white tracking-tight">Simple for students, powerful for admins</h2>
        </div>
        <div className="flex flex-col md:flex-row max-w-4xl mx-auto items-start">
          {[
            ['01', 'Login with Roll No',  'Students log in with their roll number. Admins use their library credentials.'],
            ['02', 'View Your Books',      'See all borrowed books, due dates, and status at a glance on your dashboard.'],
            ['03', 'Renew or Return',      'Renew books before the due date or visit the library to return them.'],
          ].map(([n, title, desc], i) => (
            <div key={i} className="flex-1 text-center px-8 relative">
              <div className="text-5xl font-extrabold text-indigo-500/20 tracking-tighter mb-4">{n}</div>
              <h3 className="text-base font-bold text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              {i < 2 && <span className="hidden md:block absolute right-0 top-3 text-2xl text-indigo-500/40 arrow-pulse">→</span>}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-16 bg-white border-t border-slate-100">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-3">Ready to get started?</h2>
          <p className="text-slate-400 mb-8">Log in with your JNTUGV credentials to access the portal.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/login/student"
              className="inline-block bg-emerald-600 text-white px-8 py-4 rounded-2xl text-base font-bold hover:bg-emerald-700 hover:-translate-y-0.5 transition-all shadow-xl shadow-emerald-200">
              Student Login →
            </Link>
            <Link to="/login/admin"
              className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-2xl text-base font-bold hover:bg-indigo-700 hover:-translate-y-0.5 transition-all shadow-xl shadow-indigo-200">
              Admin Login →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0f0f23] border-t border-white/5 px-16 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-2.5 text-white font-bold text-sm">
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
              <rect width="36" height="36" rx="10" fill="#4f46e5" />
              <path d="M9 27V12l9-5 9 5v15" stroke="white" strokeWidth="2" strokeLinejoin="round" />
              <rect x="14.5" y="18" width="7" height="9" rx="1" fill="white" />
              <rect x="10.5" y="14" width="5" height="3.5" rx="0.6" fill="white" opacity="0.75" />
              <rect x="20.5" y="14" width="5" height="3.5" rx="0.6" fill="white" opacity="0.75" />
            </svg>
            SmartLib — JNTUGV
          </div>
          <p className="text-xs text-slate-600 text-center leading-relaxed">
            © 2025 Jawaharlal Nehru Technological University Gurajada Vizianagaram.<br />
            Built for Design Thinking &amp; Innovation Lab.
          </p>
        </div>
      </footer>
    </div>
  )
}
