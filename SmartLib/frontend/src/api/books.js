import axios from 'axios'

// All requests proxy through Vite → Flask at localhost:5000
const api = axios.create({ baseURL: '/api' })

// ── Interceptor: attach token if stored (for future JWT auth) ──
api.interceptors.request.use(cfg => {
  const token = sessionStorage.getItem('sl_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// ════════════════════════════════════════════
//  AUTH
// ════════════════════════════════════════════

// POST /api/auth/student/login  { roll_no, password }
export async function loginStudent({ rollNo, password }) {
  const res = await api.post('/auth/student/login', { roll_no: rollNo, password })
  return res.data   // expects { success, token, user: { id, name, branch, year, role } }
}

// POST /api/auth/admin/login  { admin_id, password }
export async function loginAdmin({ adminId, password }) {
  const res = await api.post('/auth/admin/login', { admin_id: adminId, password })
  return res.data   // expects { success, token, user: { id, name, role } }
}

// POST /api/auth/logout
export async function logoutUser() {
  const res = await api.post('/auth/logout')
  sessionStorage.removeItem('sl_token')
  return res.data
}

// ════════════════════════════════════════════
//  BOOKS — shared
// ════════════════════════════════════════════

// GET /api/books?role=&student_id=&search=
export async function fetchBooks({ role, studentId, search = '' }) {
  const res = await api.get('/books', {
    params: { role, student_id: studentId, search }
  })
  return res.data   // [ { id, book_id, title, student, student_id, branch, year, due_date, days_left, status, renewed_count, mobile } ]
}

// GET /api/stats
export async function fetchStats() {
  const res = await api.get('/stats')
  return res.data   // { total, active, due_soon, overdue }
}

// POST /api/issue  { book_no, book_name, student_no, student_name, mobile, branch, year }
export async function issueBook(payload) {
  const res = await api.post('/issue', payload)
  return res.data   // { success, id } or { error }
}

// POST /api/renew  { id }
export async function renewBook(id) {
  const res = await api.post('/renew', { id })
  return res.data   // { success, new_due_date } or { error }
}

// POST /api/return  { id }
export async function returnBook(id) {
  const res = await api.post('/return', { id })
  return res.data   // { success } or { error }
}

// GET /api/fine?id=
export async function fetchFine(id) {
  const res = await api.get('/fine', { params: { id } })
  return res.data   // { fine: 0 }
}

// ════════════════════════════════════════════
//  STUDENT — specific
// ════════════════════════════════════════════

// GET /api/books/my?student_id=
export async function fetchMyBooks(studentId) {
  const res = await api.get('/books/my', { params: { student_id: studentId } })
  return res.data
}

// GET /api/fines/my?student_id=
export async function fetchMyFines(studentId) {
  const res = await api.get('/fines/my', { params: { student_id: studentId } })
  return res.data   // { total_fine, books: [ { id, title, fine } ] }
}

// GET /api/history?student_id=
export async function fetchBorrowHistory(studentId) {
  const res = await api.get('/history', { params: { student_id: studentId } })
  return res.data   // [ { title, issued_on, returned_on } ]
}

// ════════════════════════════════════════════
//  ADMIN — specific
// ════════════════════════════════════════════

// GET /api/admin/students?search=
export async function fetchAllStudents({ search = '' } = {}) {
  const res = await api.get('/admin/students', { params: { search } })
  return res.data
}

// GET /api/admin/overdue
export async function fetchOverdueBooks() {
  const res = await api.get('/admin/overdue')
  return res.data
}

// GET /api/catalog?search=&page=
export async function fetchCatalog({ search = '', page = 1 } = {}) {
  const res = await api.get('/catalog', { params: { search, page } })
  return res.data
}

// POST /api/catalog  { book_id, title, author, category, total_copies }
export async function addBookToCatalog(payload) {
  const res = await api.post('/catalog', payload)
  return res.data
}

// DELETE /api/catalog/:id
export async function deleteFromCatalog(id) {
  const res = await api.delete(`/catalog/${id}`)
  return res.data
}
