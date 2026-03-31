import { useState, useEffect, useCallback } from 'react'
import { fetchBorrowHistory } from '../api/books'

export function useHistory(studentId) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!studentId) return
    setLoading(true)
    setError(null)
    try {
      const data = await fetchBorrowHistory(studentId)
      setHistory(data)
    } catch (e) {
      setError('Cannot reach server to fetch borrow history.')
    } finally {
      setLoading(false)
    }
  }, [studentId])

  useEffect(() => { load() }, [load])

  return { history, loading, error, reload: load }
}
