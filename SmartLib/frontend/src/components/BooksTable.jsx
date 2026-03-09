import { useAuth } from '../context/AuthContext'
import { useBooks } from '../hooks/useBooks'
import BookRow from './BookRow'

export default function BooksTable({ search, refreshKey }) {
  const { user } = useAuth()
  const { books, loading, error, reload } = useBooks({
    role: user.role, studentId: user.id, search, _key: refreshKey,
  })
  const overdueCount = books.filter(b => b.status === 'overdue').length
  const title = user.role === 'admin'
    ? (overdueCount > 0 ? `⚠ ${overdueCount} Overdue · ` : '') + 'All Issued Books'
    : 'My Borrowed Books'

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-7 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{title}</span>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{books.length} Records</span>
      </div>

      {loading && <div className="text-center py-16 text-slate-400 text-sm">Loading...</div>}
      {error   && <div className="text-center py-10 text-red-500 text-sm">{error}</div>}

      {!loading && !error && books.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <div className="text-4xl mb-3">📚</div>
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
              {books.map(book => <BookRow key={book.id} book={book} onRefresh={reload} />)}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
