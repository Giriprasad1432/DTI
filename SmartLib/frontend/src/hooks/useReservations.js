import { useState, useEffect, useCallback } from 'react'
import { fetchReservations } from '../api/books'

export function useReservations({ role, studentId, search }) {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchReservations({ role, studentId, search })
      setReservations(data)
    } catch (e) {
      setError('Cannot reach server to fetch reservations.')
    } finally {
      setLoading(false)
    }
  }, [role, studentId, search])

  useEffect(() => { load() }, [load])

  return { reservations, loading, error, reload: load }
}
