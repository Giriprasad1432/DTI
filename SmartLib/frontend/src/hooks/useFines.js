import { useState, useEffect, useCallback } from 'react'
import { fetchMyFines } from '../api/books'

export function useFines(studentId) {
  const [data, setData] = useState({ total_fine: 0, books: [] })
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
      const response = await fetchMyFines(studentId)
      setData(response)
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Connection failed. Please check if the server is running.')
    } finally {
      setLoading(false)
    }
  }, [studentId])

  useEffect(() => { load() }, [load])

  return { ...data, loading, error, reload: load }
}
