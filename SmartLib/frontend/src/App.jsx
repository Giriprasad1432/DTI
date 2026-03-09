import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import Navbar from './components/Navbar'
import IntroScene from './components/IntroScene'
import HomePage from './pages/HomePage'
import StudentLoginPage from './pages/StudentLoginPage'
import AdminLoginPage from './pages/AdminLoginPage'
import DashboardPage from './pages/DashboardPage'
import AboutPage from './pages/AboutPage'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login/student" replace />
}

function Layout() {
  const { user } = useAuth()
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"              element={<HomePage />} />
        <Route path="/about"         element={<AboutPage />} />
        <Route path="/login/student" element={user ? <Navigate to="/dashboard" replace /> : <StudentLoginPage />} />
        <Route path="/login/admin"   element={user ? <Navigate to="/dashboard" replace /> : <AdminLoginPage />} />
        {/* legacy /login → student login */}
        <Route path="/login"         element={<Navigate to="/login/student" replace />} />
        <Route path="/dashboard"     element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="*"              element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  const [introPlayed, setIntroPlayed] = useState(
    () => !!sessionStorage.getItem('sl_intro_done')
  )
  function handleIntroComplete() {
    sessionStorage.setItem('sl_intro_done', '1')
    setIntroPlayed(true)
  }
  return (
    <AuthProvider>
      <ToastProvider>
        {!introPlayed
          ? <IntroScene onComplete={handleIntroComplete} />
          : <Layout />
        }
      </ToastProvider>
    </AuthProvider>
  )
}
