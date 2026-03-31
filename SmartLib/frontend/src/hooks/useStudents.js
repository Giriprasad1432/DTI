import { useState, useEffect, useCallback } from 'react'
import { fetchAllStudents } from '../api/books'

export function useStudents(search = '') {
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchAllStudents({ search })
      setStudents(data)
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Connection failed. Please check if the server is running.')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => { load() }, [load])

  return { students, loading, error, reload: load }
}
