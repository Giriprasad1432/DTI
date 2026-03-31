import { useState } from 'react'
import { renewBook, returnBook, fetchFine } from '../api/books'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'

export default function BookRow({ book, onRefresh }) {
  const { user } = useAuth()
  const toast = useToast()
  const [fine, setFine] = useState(null)

  async function handleRenew() {
    const data = await renewBook(book.id)
    if (data.success) { toast('Renewed for 7 days!', 'success'); onRefresh() }
    else toast(data.error || 'Renewal failed', 'error')
  }

  async function handleReturn() {
    if (!window.confirm(`Return "${book.title}"?`)) return
    const data = await returnBook(book.id)
    if (data.success) { toast('Book returned!', 'success'); onRefresh() }
    else toast(data.error || 'Return failed', 'error')
  }

  async function handleFine() {
    try {
      const data = await fetchFine(book.id)
      setFine(data.fine)
      const label = book.status === 'returned' ? 'Fine Calculated' : 'Current Fine Check';
      toast(`${label}: ₹${data.fine}`, 'info')
    } catch (err) {
      toast('Failed to fetch fine', 'error')
    }
  }

  const statusCls =
    book.status === 'overdue'  ? 'bg-red-100 text-red-700' :
    book.status === 'due_soon' ? 'bg-amber-100 text-amber-700' :
    book.status === 'returned' ? 'bg-slate-100 text-slate-700' :
                                  'bg-emerald-100 text-emerald-700'

  const statusLabel =
    book.status === 'overdue'  ? `${Math.abs(book.days_left)}d overdue` :
    book.status === 'due_soon' ? `${book.days_left}d left` :
    book.status === 'returned' ? 'Returned' : `${book.days_left}d left`

  return (
    <tr className="border-b border-slate-100 last:border-none hover:bg-slate-50/60 transition-colors">
      {/* Book */}
      <td className="px-7 py-4">
        <div className="font-semibold text-slate-800 text-sm">{book.title}</div>
        <div className="text-xs text-slate-400 mt-0.5">UID: {book.book_id}</div>
      </td>

      {/* Borrower */}
      <td className="px-7 py-4">
        <div className="font-medium text-slate-700 text-sm">{book.student}</div>
        <div className="text-xs text-slate-400 mt-0.5">{book.branch} · {book.year}</div>
        {user.role === 'admin' && <div className="text-xs text-slate-400">Roll: {book.student_id}</div>}
      </td>

      {/* Due Date */}
      <td className="px-7 py-4">
        <div className="font-medium text-slate-700 text-sm mb-1">
          {book.status === 'returned' ? book.returned_date : book.due_date}
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${statusCls}`}>
          {statusLabel}
        </span>
        {(book.fine > 0 || fine > 0) && (
          <div className="text-xs font-bold text-red-600 mt-1">
            {book.status === 'returned' ? 'Fine Calculated' : 'Current Fine'}: ₹{fine > 0 ? fine : book.fine}
          </div>
        )}
      </td>

      {/* Actions */}
      <td className="px-7 py-4">
        {/* Renewal dots */}
        <div className="flex items-center gap-1 mb-2">
          <span className="text-[10px] text-slate-400 mr-1">Renewals:</span>
          {[0, 1].map(i => (
            <span key={i} className={`w-2 h-2 rounded-full inline-block ${i < book.renewed_count ? 'bg-indigo-500' : 'bg-slate-200'}`} />
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {user.role === 'student' && (
            <button
              onClick={handleRenew}
              disabled={book.renewed_count >= 2 || book.status === 'returned'}
              className="text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {book.renewed_count >= 2 ? 'Max Renewed' : book.status === 'returned' ? 'Returned' : 'Renew +7d'}
            </button>
          )}
          {user.role === 'admin' && (
            <>
              <button onClick={handleRenew}
                disabled={book.renewed_count >= 2 || book.status === 'returned'}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                {book.renewed_count >= 2 ? 'Max Renewed' : book.status === 'returned' ? 'Returned' : 'Renew'}
              </button>
              <button onClick={handleReturn}
                disabled={book.status === 'returned'}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                {book.status === 'returned' ? 'Returned' : 'Return'}
              </button>
              <button onClick={handleFine}
                className="text-[11px] font-semibold px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-500 hover:text-white hover:border-amber-500 transition-all">
                Fine
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}
