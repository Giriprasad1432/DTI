import { useState } from 'react'
import { issueBook, reserveBook, getBookById, getStudentById } from '../api/books'
import { useToast } from '../context/ToastContext'

const INITIAL = {
  book_no: '', book_name: '', student_no: '', student_name: '',
  mobile: '', branch: 'CSE', year: '1st Year'
}

export default function IssueForm({ onIssued }) {
  const [form, setForm] = useState(INITIAL)
  const [loading, setLoading] = useState(false)
  const [autoFillLoading, setAutoFillLoading] = useState({ book: false, student: false })
  const [reserveMode, setReserveMode] = useState(false)
  const toast = useToast()
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const inputCls = "w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"

  async function autoFillBook() {
    if (!form.book_no.trim()) return
    setAutoFillLoading(prev => ({ ...prev, book: true }))
    try {
      const data = await getBookById(form.book_no.trim())
      if (data && data.title) {
        set('book_name', data.title)
        toast('Book details auto-filled', 'success')
      } else {
        toast('Book not found', 'error')
      }
    } catch (error) {
      toast('Error fetching book details', 'error')
    } finally {
      setAutoFillLoading(prev => ({ ...prev, book: false }))
    }
  }

  async function autoFillStudent() {
    if (!form.student_no.trim()) return
    setAutoFillLoading(prev => ({ ...prev, student: true }))
    try {
      const data = await getStudentById(form.student_no.trim())
      if (data && data.name) {
        set('student_name', data.name)
        set('mobile', data.mobile || '')
        toast('Student details auto-filled', 'success')
      } else {
        toast('Student not found', 'error')
      }
    } catch (error) {
      toast('Error fetching student details', 'error')
    } finally {
      setAutoFillLoading(prev => ({ ...prev, student: false }))
    }
  }

  async function submit() {
    if (!form.book_no || !form.book_name || !form.student_no || !form.student_name) {
      toast('Fill all required fields (*)', 'error'); return
    }
    setLoading(true)
    try {
      const data = reserveMode
        ? await reserveBook(form)
        : await issueBook(form)
      if (data.success) {
        toast(reserveMode ? 'Book reserved!' : 'Book issued!', 'success')
        setForm(INITIAL)
        setReserveMode(false)
        onIssued()
      } else {
        toast(data.error || 'Failed', 'error')
      }
    } catch { toast('Server error. Is the backend server running?', 'error') }
    finally { setLoading(false) }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-7 mb-6 shadow-sm">
      <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-5">Register New Book Issue</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        <div className="relative">
          <input
            className={inputCls}
            placeholder="Book ID *"
            value={form.book_no}
            onChange={e => set('book_no', e.target.value)}
            onBlur={autoFillBook}
            disabled={autoFillLoading.book}
          />
          {autoFillLoading.book && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
            </div>
          )}
        </div>
        <input className={`${inputCls} md:col-span-2`} placeholder="Book Title *" value={form.book_name} onChange={e => set('book_name', e.target.value)} />
        <div className="relative">
          <input
            className={inputCls}
            placeholder="Roll No *"
            value={form.student_no}
            onChange={e => set('student_no', e.target.value)}
            onBlur={autoFillStudent}
            disabled={autoFillLoading.student}
          />
          {autoFillLoading.student && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-500"></div>
            </div>
          )}
        </div>
        <input className={inputCls} placeholder="Student Name *" value={form.student_name} onChange={e => set('student_name', e.target.value)} />
        <input className={inputCls} placeholder="WhatsApp No"    value={form.mobile}       onChange={e => set('mobile', e.target.value)} />
        <select className={inputCls} value={form.branch} onChange={e => set('branch', e.target.value)}>
          {['CSE','ECE','EEE','IT','CIVIL','METALLURGY','MECH'].map(b => <option key={b}>{b}</option>)}
        </select>
        <select className={inputCls} value={form.year} onChange={e => set('year', e.target.value)}>
          {['1st Year','2nd Year','3rd Year','4th Year'].map(y => <option key={y}>{y}</option>)}
        </select>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={reserveMode}
              onChange={e => setReserveMode(e.target.checked)}
              className="w-4 h-4 text-indigo-600 bg-slate-100 border-slate-300 rounded focus:ring-indigo-500"
            />
            Reserve if unavailable
          </label>
        </div>
        <button
          onClick={submit} disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all hover:-translate-y-0.5 shadow-md shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          {loading ? (reserveMode ? 'Reserving...' : 'Issuing...') : (reserveMode ? 'Reserve Book →' : 'Issue Book →')}
        </button>
      </div>
    </div>
  )
}
