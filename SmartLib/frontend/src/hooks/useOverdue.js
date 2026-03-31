import { useState, useEffect, useCallback } from 'react'
import { fetchOverdueBooks } from '../api/books'

export function useOverdue() {
  const [overdue, setOverdue] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchOverdueBooks()
      setOverdue(data)
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Connection failed. Please check if the server is running.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return { overdue, loading, error, reload: load }
}
