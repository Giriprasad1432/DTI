import { AlertTriangle } from 'lucide-react'
import { useOverdue } from '../hooks/useOverdue'

export default function AdminOverdue() {
  const { overdue, loading, error } = useOverdue()

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-7 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Overdue Books Priority List</span>
        </div>
        <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">{overdue.length} Overdue</span>
      </div>

      {loading && <div className="text-center py-16 text-slate-400 text-sm">Loading overdue books...</div>}
      {error && <div className="text-center py-10 text-red-500 text-sm">{error}</div>}

      {!loading && !error && overdue.length === 0 && (
        <div className="text-center py-16 text-emerald-500 font-medium text-sm">
          Great! There are no overdue books.
        </div>
      )}

      {!loading && !error && overdue.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Book Title', 'Student Name', 'Student ID', 'Due Date', 'Days Overdue'].map(h => (
                  <th key={h} className="px-7 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {overdue.map(book => (
                <tr key={book.id} className="border-b border-slate-100 last:border-none hover:bg-slate-50/60 transition-colors">
                  <td className="px-7 py-4 font-medium text-slate-700 text-sm">{book.title}</td>
                  <td className="px-7 py-4 font-medium text-indigo-600 text-sm">{book.student}</td>
                  <td className="px-7 py-4 text-slate-500 text-sm">{book.student_id}</td>
                  <td className="px-7 py-4 text-slate-500 text-sm">{book.due_date}</td>
                  <td className="px-7 py-4 text-red-600 font-bold text-sm">{book.days_overdue} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
