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
    <div className="min-h-screen w-full overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="min-h-screen bg-[#0f0f23] relative flex items-center px-6 md:px-16 py-20 gap-16">

        {/* Library background image (Optimized WebP) */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'url(./lib.webp)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.6,
          }} />

        {/* Mouse-follow orbs */}
        <div ref={orbRef} className="absolute w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full pointer-events-none -top-12 -left-12 md:-top-24 md:-left-24 transition-transform duration-100"
          style={{ background: 'radial-gradient(circle,rgba(79,70,229,0.2) 0%,transparent 70%)' }} />
        <div className="absolute w-48 md:w-96 h-48 md:h-96 rounded-full pointer-events-none -bottom-12 right-24 md:right-48 orb-pulse"
          style={{ background: 'radial-gradient(circle,rgba(99,102,241,0.1) 0%,transparent 70%)' }} />

        {/* ── Hero Content ── */}
        <div className="w-full flex flex-col items-center relative z-10 animate-slide-up">

          {/* New Badge - Responsive handling */}
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 px-4 py-2 rounded-full text-[10px] sm:text-xs font-semibold mb-8 text-center lg:self-start lg:text-left max-w-sm sm:max-w-none">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0 animate-pulse" />
            Jawaharlal Nehru Technological University Gurajada Vizianagaram
          </div>

          {/* Heading - Stacked for mobile */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight tracking-tighter mb-6 text-center">
            Smart Library
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 mt-2">
              <span style={{
                background: 'linear-gradient(135deg,#818cf8,#a78bfa,#60a5fa)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                display: 'inline-block',
                paddingBottom: '0.1em',
              }}>
                Management
              </span>
              <span>System</span>
            </div>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed max-w-3xl text-center mb-10 bg-white/5 backdrop-blur-md border border-white/10 p-5 sm:p-7 rounded-2xl shadow-2xl">
            A next-generation digital library portal designed for JNTUGV campus — effortless book tracking, automated dues management, and instant notifications.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16">
            <Link to="/login/student"
              className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-8 py-4 rounded-xl text-base font-bold hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/20 active:scale-95">
              Student Login →
            </Link>
            <Link to="/login/admin"
              className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-xl text-base font-bold hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-900/20 active:scale-95">
              Admin Login →
            </Link>
          </div>

          {/* Stats - Responsive grid/flex */}
          <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center gap-4 sm:gap-10 md:gap-16 w-full max-w-4xl">
            {[
              [BookOpen, '2,400+', 'Assets'],
              [GraduationCap, '1,200+', 'Active Users'],
              [CheckCircle, '98%', 'Accuracy'],
              [Clock, '24/7', 'Uptime'],
            ].map(([Icon, val, label]) => (
              <div key={label} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 text-center transition-all hover:bg-white/10 hover:border-white/20">
                <Icon className="w-5 h-5 mb-1 mx-auto text-indigo-400" />
                <div className="text-lg md:text-2xl font-black text-white">{val}</div>
                <div className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-20 px-6 md:px-16 bg-white">
        <div className="text-center mb-16">
          <span className="inline-block bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4">Core Ecosystem</span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4">Everything in one place</h2>
          <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto">Designed specifically for the JNTUGV academic community with high-precision tools.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <FeatureCard icon={BookOpen} title="Asset Tracking" desc="Real-time visibility into your borrowed books, upcoming due dates, and renewal history." />
          <FeatureCard icon={Bell} title="Smart Reminders" desc="Automated systems notify you before books are due, helping you avoid unnecessary fines." />
          <FeatureCard icon={RefreshCw} title="Instant Renewals" desc="Extend your borrowing period in one click directly from your personal dashboard." />
          <FeatureCard icon={DollarSign} title="Fine Ledger" desc="Transparent fine calculation and history so you always stay accountable and informed." />
          <FeatureCard icon={Search} title="Global Discovery" desc="Browse the entire library catalog with advanced filters for title, author, or book ID." />
          <FeatureCard icon={BarChart3} title="Analytics Hub" desc="For admins: Real-time insights into library circulation and student engagement metrics." />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6 md:px-16" style={{ background: 'linear-gradient(135deg,#0a0a1a 0%,#1e1b4b 100%)' }}>
        <div className="text-center mb-16">
          <span className="inline-block bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-indigo-500/20 mb-4">Workflow</span>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">The Modern Way to Library</h2>
        </div>
        <div className="flex flex-col md:flex-row max-w-5xl mx-auto gap-12 md:gap-4 items-start">
          {[
            ['01', 'Authenticate', 'Secure login using your University credentials for students or staff.'],
            ['02', 'Monitor Assets', 'Access your live dashboard to view active borrows and upcoming deadlines.'],
            ['03', 'Seamless Action', 'Renew books online or visit the desk for returns — all synced in real-time.'],
          ].map(([n, title, desc], i) => (
            <div key={i} className="flex-1 text-center md:text-left px-4 md:px-8 relative">
              <div className="text-6xl font-black text-indigo-500/10 tracking-tighter mb-4">{n}</div>
              <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              {i < 2 && <span className="hidden lg:block absolute -right-4 top-10 text-2xl text-indigo-500/20">→</span>}
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 md:px-16 bg-white border-t border-slate-100">
        <div className="bg-slate-900 rounded-3xl p-8 md:p-16 text-center max-w-4xl mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">Ready to start?</h2>
            <p className="text-slate-400 mb-10 max-w-md mx-auto text-sm md:text-base">Join over 1,200+ students already utilizing the SmartLib portal for their academic success.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login/student"
                className="bg-emerald-600 text-white px-8 py-4 rounded-2xl text-sm font-bold hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/20">
                Student Access
              </Link>
              <Link to="/login/admin"
                className="bg-white/10 text-white border border-white/10 px-8 py-4 rounded-2xl text-sm font-bold hover:bg-white/20 transition-all backdrop-blur-md">
                Admin Console
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#0a0a1a] border-t border-white/5 px-6 md:px-16 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-6xl mx-auto">
          <div className="flex items-center gap-3 text-white font-black text-lg tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            SmartLib
          </div>
          <p className="text-[10px] sm:text-xs text-slate-500 text-center md:text-right leading-relaxed font-medium uppercase tracking-widest">
            © 2025 JNTUGV Vizianagaram<br />
            Design Thinking & Innovation Lab Project
          </p>
        </div>
      </footer>
    </div>
  )
}
