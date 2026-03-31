import { useState, useEffect, useCallback } from 'react'
import { fetchCatalog } from '../api/books'

export function useCatalog({ search, page }) {
  const [catalog, setCatalog] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchCatalog({ search, page })
      setCatalog(data.books || [])
      setTotal(data.total || 0)
      setTotalPages(data.pages || 0)
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Connection failed. Please check if the server is running.')
    } finally {
      setLoading(false)
    }
  }, [search, page])

  useEffect(() => { load() }, [load])

  return { catalog, loading, error, total, totalPages, reload: load }
}