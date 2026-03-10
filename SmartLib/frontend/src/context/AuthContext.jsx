import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('sl_user')
    return stored ? JSON.parse(stored) : null
  })

  function login(userData) {
    setUser(userData)
    localStorage.setItem('sl_user', JSON.stringify(userData))
  }

  function logout() {
    setUser(null)
    localStorage.removeItem('sl_user')
    sessionStorage.removeItem('sl_token')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() { return useContext(AuthContext) }