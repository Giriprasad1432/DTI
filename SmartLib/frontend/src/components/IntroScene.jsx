import { useEffect, useRef, useState } from 'react'

export default function IntroScene({ onComplete }) {
  const videoRef = useRef(null)
  const [phase, setPhase] = useState('video')

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    function handleEnded() {
      setPhase('flash')
      setTimeout(() => {
        sessionStorage.setItem('sl_intro_done', '1')
        onComplete()
      }, 300)
    }

    video.addEventListener('ended', handleEnded)
    return () => video.removeEventListener('ended', handleEnded)
  }, [])

  function skip() {
    setPhase('flash')
    setTimeout(() => {
      sessionStorage.setItem('sl_intro_done', '1')
      onComplete()
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black" onClick={skip} style={{ cursor: 'pointer' }}>

      {/* Full screen video — pure playback */}
      <video
        ref={videoRef}
        src="/intro-video.mp4"
        autoPlay muted playsInline
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* White flash — only on video end */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'white',
        opacity: phase === 'flash' ? 1 : 0,
        transition: phase === 'flash' ? 'opacity 0.3s ease' : 'none',
        pointerEvents: 'none',
      }} />

      {/* Skip hint */}
      <div style={{ position: 'absolute', bottom: 24, right: 24, color: 'rgba(255,255,255,0.35)', fontSize: 11, pointerEvents: 'none' }}>
        tap to skip
      </div>
    </div>
  )
}