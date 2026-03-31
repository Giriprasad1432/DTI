import { Clock } from 'lucide-react'
import { useHistory } from '../hooks/useHistory'
import { useAuth } from '../context/AuthContext'

export default function StudentHistory() {
  const { user } = useAuth()
  const { history, loading, error } = useHistory(user.id)

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-7 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
        <Clock className="w-4 h-4 text-indigo-500" />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Complete Borrow History</span>
      </div>

      {loading && <div className="text-center py-16 text-slate-400 text-sm">Loading history...</div>}
      {error && <div className="text-center py-10 text-red-500 text-sm">{error}</div>}

      {!loading && !error && history.length === 0 && (
        <div className="text-center py-16 text-slate-400 text-sm">
          No past borrow records found.
        </div>
      )}

      {!loading && !error && history.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Book Title', 'Issued On', 'Returned On'].map(h => (
                  <th key={h} className="px-7 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {history.map((record, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-none hover:bg-slate-50/60 transition-colors">
                  <td className="px-7 py-4 font-medium text-slate-700 text-sm">{record.title}</td>
                  <td className="px-7 py-4 text-slate-500 text-sm">{record.issued_on}</td>
                  <td className="px-7 py-4 text-emerald-600 font-medium text-sm">{record.returned_on}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
