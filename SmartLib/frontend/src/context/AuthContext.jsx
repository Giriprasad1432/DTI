import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

// Demo users — replace login() body with real API call when backend is ready
const DEMO_USERS = {
  'admin_lib':  { pass: 'admin789', role: 'admin',   id: 'ADM001', name: 'System Librarian', branch: null,  year: null },
  'student001': { pass: 'pass123',  role: 'student', id: 'STU101', name: 'Rahul Varma',      branch: 'CSE', year: '3rd Year' },
  'student002': { pass: 'pass456',  role: 'student', id: 'STU202', name: 'Priya Sharma',     branch: 'ECE', year: '2nd Year' },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  function login(username, password) {
    // ── Swap this block with a real API call later ──
    // e.g. const data = await loginStudent({ rollNo: username, password })
    //      if (data.success) { setUser(data.user); return { success: true, role: data.user.role } }
    const found = DEMO_USERS[username]
    if (found && found.pass === password) {
      const u = { username, ...found }
      setUser(u)
      return { success: true, role: found.role }
    }
    return { success: false, error: 'Invalid credentials' }
  }

  function logout() {
    setUser(null)
    sessionStorage.removeItem('sl_token')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() { return useContext(AuthContext) }
