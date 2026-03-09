import { useEffect, useState } from 'react'

// ── CSS-only cinematic intro ──────────────────────────────────
// Replace the <BookVisual /> section below with your own R3F 3D canvas later.
// Everything else (phases, flash, skip, timing) stays the same.

export default function IntroScene({ onComplete }) {
  const [phase, setPhase] = useState('dark') // dark → spotlight → text → flash → done

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('spotlight'), 400)
    const t2 = setTimeout(() => setPhase('text'),      1000)
    const t3 = setTimeout(() => setPhase('flash'),     2300)
    const t4 = setTimeout(() => finish(),              2900)
    return () => [t1, t2, t3, t4].forEach(clearTimeout)
  }, [])

  function finish() {
    sessionStorage.setItem('sl_intro_done', '1')
    onComplete()
  }

  const visible = phase !== 'dark' && phase !== 'flash'

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ background: '#050510', cursor: 'pointer' }}
      onClick={finish}
    >
      {/* Radial spotlight */}
      <div className="absolute inset-0 pointer-events-none" style={{
        opacity: phase === 'dark' ? 0 : phase === 'flash' ? 0 : 0.9,
        transition: 'opacity 1s ease',
        background: 'radial-gradient(ellipse 55% 45% at 50% 52%, rgba(79,70,229,0.3) 0%, rgba(99,102,241,0.08) 50%, transparent 75%)',
      }} />

      {/* Table surface */}
      <div className="absolute bottom-0 left-0 right-0 h-2/5 pointer-events-none" style={{
        background: 'linear-gradient(to top, rgba(10,8,30,0.98) 0%, rgba(10,8,30,0.5) 50%, transparent 100%)',
        opacity: phase === 'dark' ? 0 : 1,
        transition: 'opacity 1s ease 0.3s',
      }} />

      {/* ── BOOK VISUAL — swap this block with R3F canvas later ── */}
      <div style={{
        opacity:    visible ? 1 : 0,
        transform:  phase === 'dark'
                      ? 'scale(0.82) translateY(35px)'
                      : phase === 'flash'
                        ? 'scale(1.08) translateY(-8px)'
                        : 'scale(1) translateY(0)',
        transition: 'all 1s cubic-bezier(0.34,1.4,0.64,1)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        {/* CSS 3D Book */}
        <div style={{ perspective: 900 }}>
          <div style={{
            width: 150, height: 200,
            transformStyle: 'preserve-3d',
            transform: 'rotateX(12deg) rotateY(-28deg)',
            position: 'relative',
            filter: 'drop-shadow(0 30px 60px rgba(0,0,0,0.9))',
          }}>
            {/* Front cover */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(160deg, #1e1b4b 0%, #312e81 45%, #1e1b4b 100%)',
              borderRadius: '2px 10px 10px 2px',
              border: '1px solid rgba(99,102,241,0.35)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: 'inset -3px 0 12px rgba(0,0,0,0.4)',
            }}>
              {/* Glow ring behind logo */}
              <div style={{
                width: 76, height: 76, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, transparent 70%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '1px solid rgba(99,102,241,0.2)',
              }}>
                <img src="/jntugv-logo.jpg" alt="JNTUGV"
                  style={{ width: 60, height: 60, objectFit: 'contain', borderRadius: '50%',
                    filter: 'drop-shadow(0 0 10px rgba(165,180,252,0.7)) brightness(1.1)' }}
                  onError={e => { e.target.style.display = 'none' }} />
              </div>
              {/* Title */}
              <div style={{ color: '#c7d2fe', fontSize: 10, fontWeight: 800,
                letterSpacing: 2.5, textTransform: 'uppercase', textAlign: 'center', padding: '0 14px' }}>
                JNTUGV
              </div>
              <div style={{ color: '#818cf8', fontSize: 8, letterSpacing: 1.5,
                textTransform: 'uppercase', textAlign: 'center' }}>
                SmartLib Portal
              </div>
              {/* Decorative lines */}
              <div style={{ position: 'absolute', bottom: 18, left: 14, right: 14,
                height: 1, background: 'rgba(99,102,241,0.25)' }} />
              <div style={{ position: 'absolute', bottom: 24, left: 14, right: 14,
                height: 1, background: 'rgba(99,102,241,0.12)' }} />
              <div style={{ position: 'absolute', top: 14, left: 14, right: 14,
                height: 1, background: 'rgba(99,102,241,0.12)' }} />
            </div>
            {/* Spine */}
            <div style={{
              position: 'absolute', left: -16, top: 2, bottom: 2, width: 16,
              background: 'linear-gradient(to right, #050410, #1e1b4b)',
              borderRadius: '3px 0 0 3px',
              boxShadow: '-5px 5px 25px rgba(0,0,0,0.7)',
            }} />
            {/* Pages edge (right) */}
            <div style={{
              position: 'absolute', right: -7, top: 4, bottom: 4, width: 7,
              background: 'repeating-linear-gradient(to bottom,#f1f5f9 0px,#f1f5f9 1.5px,#cbd5e1 1.5px,#cbd5e1 2.5px)',
              borderRadius: '0 2px 2px 0',
            }} />
          </div>
        </div>

        {/* Book shadow on table */}
        <div style={{
          width: 200, height: 14, marginTop: 10,
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.75) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
      </div>
      {/* ── END BOOK VISUAL ── */}

      {/* University name */}
      <div className="absolute bottom-14 left-0 right-0 text-center pointer-events-none" style={{
        opacity:    phase === 'text' ? 1 : 0,
        transform:  phase === 'text' ? 'translateY(0)' : 'translateY(10px)',
        transition: 'all 0.7s ease 0.3s',
      }}>
        <div style={{ color: '#6366f1', fontSize: 11, fontWeight: 700, letterSpacing: 3.5,
          textTransform: 'uppercase', marginBottom: 5 }}>
          JNTUGV
        </div>
        <div style={{ color: '#334155', fontSize: 11, letterSpacing: 0.5 }}>
          Jawaharlal Nehru Technological University Gurajada Vizianagaram
        </div>
        <div style={{ color: '#1e3a5f', fontSize: 10, marginTop: 4, letterSpacing: 1 }}>
          Library Management System
        </div>
      </div>

      {/* White flash overlay */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'white',
        opacity:    phase === 'flash' ? 1 : 0,
        transition: phase === 'flash' ? 'opacity 0.25s ease' : 'opacity 0.55s ease',
      }} />

      {/* Skip hint */}
      <div className="absolute top-5 right-6 text-slate-600 text-xs pointer-events-none" style={{
        opacity:    phase === 'text' ? 0.7 : 0,
        transition: 'opacity 0.5s ease',
      }}>
        tap to skip
      </div>
    </div>
  )
}
