import { useState, useEffect, useCallback } from 'react'
import { fetchMyFines } from '../api/books'

export function useFines(studentId) {
  const [data, setData] = useState({ total_fine: 0, books: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!studentId) return
    setLoading(true)
    setError(null)
    try {
      const response = await fetchMyFines(studentId)
      setData(response)
    } catch (e) {
      setError('Cannot reach server to fetch fines.')
    } finally {
      setLoading(false)
    }
  }, [studentId])

  useEffect(() => { load() }, [load])

  return { ...data, loading, error, reload: load }
}
