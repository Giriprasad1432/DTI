import { useState, useEffect, useCallback } from 'react'
import { fetchBorrowHistory } from '../api/books'

export function useHistory(studentId) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    if (!studentId) {
      setLoading(false)
      return
    }
    try {
      const data = await fetchBorrowHistory(studentId)
      setHistory(data)
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Connection failed. Please check if the server is running.')
    } finally {
      setLoading(false)
    }
  }, [studentId])

  useEffect(() => { load() }, [load])

  return { history, loading, error, reload: load }
}
