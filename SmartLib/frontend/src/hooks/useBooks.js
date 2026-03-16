import { useState, useEffect, useCallback } from 'react'
import { fetchBooks } from '../api/books'

export function useBooks({ role, studentId, search }) {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchBooks({ role, studentId, search })
      setBooks(data)
    } catch (e) {
      setError('Cannot reach server. Is the backend server running on port 5000?')
    } finally {
      setLoading(false)
    }
  }, [role, studentId, search])

  useEffect(() => { load() }, [load])

  return { books, loading, error, reload: load }
}
