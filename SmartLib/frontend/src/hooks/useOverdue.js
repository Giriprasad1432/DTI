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
    } catch (e) {
      setError('Cannot reach server to fetch overdue books.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return { overdue, loading, error, reload: load }
}
