import { useAuth } from '../context/AuthContext'
import { useBooks } from '../hooks/useBooks'
import BookRow from './BookRow'
import { BookOpen, AlertTriangle } from 'lucide-react'

export default function BooksTable({ search, refreshKey, onAction, limit }) {
  const { user } = useAuth()
  const { books, loading, error, reload } = useBooks({
    role: user.role, studentId: user.id, search, _key: refreshKey,
  })

  function handleRefresh() {
    reload()
    if (onAction) onAction()
  }

  const overdueCount = books.filter(b => b.status === 'overdue').length
  const title = user.role === 'admin'
    ? (overdueCount > 0 ? <><AlertTriangle className="w-4 h-4 inline" /> {overdueCount} Overdue · </> : '') + 'All Issued Books'
    : (limit ? 'Recent Borrowed Books' : 'My Borrowed Books')

  const displayBooks = limit ? books.slice(0, limit) : books

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-7 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1">{title}</span>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{books.length} Total</span>
      </div>

      {loading && <div className="text-center py-16 text-slate-400 text-sm">Loading...</div>}
      {error   && <div className="text-center py-10 text-red-500 text-sm">{error}</div>}

      {!loading && !error && books.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <BookOpen className="w-12 h-12 mb-3 mx-auto text-slate-300" />
          <div className="text-sm">No books found</div>
        </div>
      )}

      {!loading && !error && books.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Book', 'Borrower', 'Due Date', 'Actions'].map(h => (
                  <th key={h} className="px-7 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayBooks.map(book => <BookRow key={book.id} book={book} onRefresh={handleRefresh} />)}
            </tbody>
          </table>
          {limit && books.length > limit && (
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-500">Showing latest {limit} books. Check "My Books" for full history.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
