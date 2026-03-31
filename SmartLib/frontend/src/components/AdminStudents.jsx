import { useState } from 'react'
import { GraduationCap, MessageSquare, UserPlus, X } from 'lucide-react'
import { useStudents } from '../hooks/useStudents'
import { sendAdminMessage } from '../api/books'
import axios from 'axios'
import { useToast } from '../context/ToastContext'

export default function AdminStudents({ search }) {
  const { students, loading, error, reload } = useStudents(search)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ studentId: '', name: '', email: '', mobile: '', branch: 'CSE', year: '1st Year' })
  const [addLoading, setAddLoading] = useState(false)
  const toast = useToast()

  const handleMessage = async (studentId, studentName) => {
    const msg = window.prompt(`Enter message to send to ${studentName} (${studentId}):`)
    if (!msg) return
    try {
      await sendAdminMessage(studentId, msg)
      toast('Message delivered!', 'success')
    } catch (err) {
      toast('Failed to send message', 'error')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setAddLoading(true)
    try {
      await axios.post('/api/student', form)
      toast('Student registered successfully!', 'success')
      setShowAdd(false)
      setForm({ studentId: '', name: '', email: '', mobile: '', branch: 'CSE', year: '1st Year' })
      reload()
    } catch (err) {
      toast(err.response?.data?.error || 'Registration failed', 'error')
    } finally {
      setAddLoading(false)
    }
  }

  const inp = "w-full px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:border-indigo-500 transition-all placeholder:text-slate-400"

  return (
    <div className="space-y-6">
      {/* Registration Form (Collapsible) */}
      {showAdd && (
        <div className="bg-white border border-indigo-100 rounded-2xl p-5 md:p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-indigo-500" /> Register Student
            </h3>
            <button onClick={() => setShowAdd(false)} className="p-1 hover:bg-slate-100 rounded-full text-slate-400">
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleRegister} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <input className={inp} placeholder="Roll ID (e.g. 21A01)" required value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})} />
            <input className={inp} placeholder="Full Name" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            <input className={inp} placeholder="Email" type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            <input className={inp} placeholder="Mobile" required value={form.mobile} onChange={e => setForm({...form, mobile: e.target.value})} />
            <select className={inp} value={form.branch} onChange={e => setForm({...form, branch: e.target.value})}>
              {['CSE','ECE','EEE','IT','CIVIL','METALLURGY','MECH'].map(b => <option key={b}>{b}</option>)}
            </select>
            <select className={inp} value={form.year} onChange={e => setForm({...form, year: e.target.value})}>
              {['1st Year','2nd Year','3rd Year','4th Year'].map(y => <option key={y}>{y}</option>)}
            </select>
            <div className="sm:col-span-2 md:col-span-3 flex justify-end">
              <button type="submit" disabled={addLoading} className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all active:scale-95 shadow-lg shadow-indigo-100">
                {addLoading ? 'Registering...' : 'Register Student'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-5 md:px-7 py-4 border-b border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-4 h-4 text-indigo-500" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Student Directory</span>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {!showAdd && (
              <button onClick={() => setShowAdd(true)} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-indigo-200 text-indigo-600 rounded-lg text-[10px] font-bold hover:bg-indigo-50 transition-all">
                <UserPlus className="w-3.5 h-3.5" /> Add New
              </button>
            )}
            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full whitespace-nowrap">{students.length} Registered</span>
          </div>
        </div>

        {loading && <div className="text-center py-16 text-slate-400 text-xs font-medium">Loading records...</div>}
        {error && <div className="text-center py-10 text-red-500 text-xs">{error}</div>}

        {!loading && !error && students.length === 0 && (
          <div className="text-center py-16 text-slate-400 text-xs italic">
            No students match your current search.
          </div>
        )}

        {!loading && !error && students.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Roll ID', 'Full Name', 'Dept', 'Year', 'Actions'].map(h => (
                    <th key={h} className="px-5 md:px-7 py-3 text-left text-[9px] font-bold text-slate-400 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student._id} className="border-b border-slate-50 last:border-none hover:bg-slate-50/40 transition-colors">
                    <td className="px-5 md:px-7 py-4 font-bold text-slate-700 text-xs">{student.studentId}</td>
                    <td className="px-5 md:px-7 py-4 font-bold text-indigo-600 text-xs">
                      <div className="truncate max-w-[120px] md:max-w-none">{student.name}</div>
                    </td>
                    <td className="px-5 md:px-7 py-4 text-slate-500 text-[11px] font-medium uppercase">{student.branch || 'N/A'}</td>
                    <td className="px-5 md:px-7 py-4 text-slate-500 text-[11px] font-medium">{student.year || 'N/A'}</td>
                    <td className="px-5 md:px-7 py-4">
                      {student.role === 'student' && (
                        <button
                          onClick={() => handleMessage(student.studentId, student.name)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white rounded-lg text-[10px] font-bold transition-all"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> <span className="hidden xs:inline">Message</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
