import { DollarSign } from 'lucide-react'
import { useFines } from '../hooks/useFines'
import { useAuth } from '../context/AuthContext'

export default function StudentFines() {
  const { user } = useAuth()
  const { total_fine, books, loading, error } = useFines(user.studentId)

  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-100 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between shadow-sm">
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-red-800 uppercase tracking-wide">Total Outstanding Fines</h2>
            <div className="text-3xl font-extrabold text-red-600">₹{loading ? '...' : total_fine}</div>
          </div>
        </div>
        {!loading && total_fine > 0 && (
          <button className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all">
            Pay Now (Mock)
          </button>
        )}
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-7 py-4 border-b border-slate-100 bg-slate-50">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Fine Details Breakdown</span>
        </div>

        {loading && <div className="text-center py-16 text-slate-400 text-sm">Loading fines...</div>}
        {error && <div className="text-center py-10 text-red-500 text-sm">{error}</div>}

        {!loading && !error && (!books || books.length === 0) && (
          <div className="text-center py-16 text-emerald-500 font-medium text-sm border-t border-slate-100">
            Hooray! You have no fine records. Keep returning your books on time!
          </div>
        )}

        {!loading && !error && books?.length > 0 && (
          <div className="overflow-x-auto border-t border-slate-100">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Book Title', 'Fine Amount'].map(h => (
                    <th key={h} className="px-7 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {books.map(book => (
                  <tr key={book.id} className="border-b border-slate-100 last:border-none hover:bg-slate-50/60 transition-colors">
                    <td className="px-7 py-4 font-medium text-slate-700 text-sm">{book.title}</td>
                    <td className="px-7 py-4 font-bold text-red-600 text-sm">₹{book.fine}</td>
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
