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
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Connection failed. Please check if the server is running.')
    } finally {
      setLoading(false)
    }
  }, [role, studentId, search])

  useEffect(() => { load() }, [load])

  return { books, loading, error, reload: load }
}
