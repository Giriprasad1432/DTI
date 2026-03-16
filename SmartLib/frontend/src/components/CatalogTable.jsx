import { useState } from 'react'
import { useCatalog } from '../hooks/useCatalog'

export default function CatalogTable({ search, page = 1, onPageChange }) {
  const { catalog, loading, error, total, totalPages, reload } = useCatalog({ search, page })

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
          <div className="text-4xl mb-3">📚</div>
          <div className="text-sm">No books found in catalog</div>
        </div>
      )}

      {!loading && !error && catalog.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {['Book ID', 'Title', 'Author', 'Category', 'Available', 'Total'].map(h => (
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