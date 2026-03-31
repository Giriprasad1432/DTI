import { useState } from 'react'
import { useCatalog } from '../hooks/useCatalog'
import { BookOpen } from 'lucide-react'
import { reserveBook } from '../api/books'

export default function CatalogTable({ search, page = 1, onPageChange, user }) {
  const { catalog, loading, error, total, totalPages, reload } = useCatalog({ search, page })

  const handleReserve = async (book) => {
    if (!window.confirm(`Reserve "${book.title}"?`)) return
    try {
      await reserveBook({
        book_no: book.bookId,
        book_name: book.title,
        student_no: user.id,
        student_name: user.name,
        mobile: user.mobile,
        branch: user.branch,
        year: user.year
      })
      alert(`Successfully reserved ${book.title}! Admin will be notified to fulfill it.`)
      reload()
    } catch (err) {
      alert('Failed to reserve book: ' + (err.response?.data?.error || err.message))
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      <div className="px-7 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Book Catalog</span>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{total} Books Available</span>
      </div>

      {loading && <div className="text-center py-16 text-slate-400 text-sm">Loading catalog...</div>}
      {error && <div className="text-center py-10 text-red-500 text-sm">{error}</div>}

      {!loading && !error && catalog.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <BookOpen className="w-12 h-12 mb-3 mx-auto text-slate-300" />
          <div className="text-sm">No books found in catalog</div>
        </div>
      )}

      {!loading && !error && catalog.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Book ID', 'Title', 'Author', 'Category', 'Available', 'Total', ...(user?.role === 'student' ? ['Action'] : [])].map(h => (
                    <th key={h} className="px-7 py-3 text-left text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {catalog.map(book => (
                  <tr key={book._id} className="border-b border-slate-100 last:border-none hover:bg-slate-50/60 transition-colors">
                    <td className="px-7 py-4">
                      <div className="font-semibold text-slate-800 text-sm">{book.bookId}</div>
                    </td>
                    <td className="px-7 py-4">
                      <div className="font-medium text-slate-700 text-sm">{book.title}</div>
                    </td>
                    <td className="px-7 py-4">
                      <div className="text-sm text-slate-600">{book.author}</div>
                    </td>
                    <td className="px-7 py-4">
                      <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-7 py-4">
                      <span className={`text-sm font-bold ${book.availableCopies > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {book.availableCopies}
                      </span>
                    </td>
                    <td className="px-7 py-4">
                      <span className="text-sm font-medium text-slate-700">{book.totalCopies}</span>
                    </td>
                    {user?.role === 'student' && (
                      <td className="px-7 py-4">
                        {book.availableCopies > 0 ? (
                          <span className="px-3 py-1.5 text-[11px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg inline-flex items-center gap-1">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                            Available
                          </span>
                        ) : (
                          <button
                            onClick={() => handleReserve(book)}
                            className="px-3 py-1.5 text-[11px] font-bold bg-amber-50 border border-amber-200 text-amber-700 rounded-lg hover:bg-amber-600 hover:text-white transition-all"
                          >
                            Reserve
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-7 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Page {page} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onPageChange(page - 1)}
                  disabled={page <= 1}
                  className="px-3 py-1 text-xs bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => onPageChange(page + 1)}
                  disabled={page >= totalPages}
                  className="px-3 py-1 text-xs bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}