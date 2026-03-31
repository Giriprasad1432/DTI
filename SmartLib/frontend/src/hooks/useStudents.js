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
    } catch (e) {
      setError('Cannot reach server to fetch students.')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => { load() }, [load])

  return { students, loading, error, reload: load }
}
