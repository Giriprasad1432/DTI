import { ClipboardList, CheckCircle } from 'lucide-react'
import { useReservations } from '../hooks/useReservations'
import { fulfillReservation } from '../api/books'

export default function AdminReservations({ search }) {
  const { reservations, loading, error, reload } = useReservations({ role: 'admin', search })

  const handleFulfill = async (id) => {
    try {
      if (confirm('Are you sure you want to fulfill this reservation and issue the book?')) {
        await fulfillReservation(id)
        alert('Reservation fulfilled! The book has been officially issued.')
        reload()
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to fulfill reservation')
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-7 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ClipboardList className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Book Reservations</span>
        </div>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{reservations.length} Tracked</span>
      </div>

      {loading && <div className="text-center py-16 text-slate-400 text-sm">Loading reservations...</div>}
      {error && <div className="text-center py-10 text-red-500 text-sm">{error}</div>}

      {!loading && !error && reservations.length === 0 && (
        <div className="text-center py-16 text-slate-400 text-sm">
          No reservations found matching your criteria.
        </div>
      )}

      {!loading && !error && reservations.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Book Title', 'Student', 'Reserved On', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-7 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reservations.map(res => (
                <tr key={res.id} className="border-b border-slate-100 last:border-none hover:bg-slate-50/60 transition-colors">
                  <td className="px-7 py-4 font-medium text-slate-700 text-sm">{res.title}</td>
                  <td className="px-7 py-4 font-medium text-slate-600 text-sm">{res.student} <span className="text-xs font-normal text-slate-400 block">{res.student_id}</span></td>
                  <td className="px-7 py-4 text-slate-500 text-sm">{res.reservation_date}</td>
                  <td className="px-7 py-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                      res.status === 'active' ? 'bg-amber-100 text-amber-700' :
                      res.status === 'notified' ? 'bg-blue-100 text-blue-700' :
                      res.status === 'fulfilled' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {res.status === 'notified' ? 'Awaiting Pickup' : res.status}
                    </span>
                  </td>
                  <td className="px-7 py-4">
                    {(res.status === 'active' || res.status === 'notified') && (
                      <button 
                        onClick={() => handleFulfill(res.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 rounded-lg text-xs font-bold transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Fulfill
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
  )
}
