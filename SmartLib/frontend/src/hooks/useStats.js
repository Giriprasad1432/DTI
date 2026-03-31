import { useState, useEffect } from 'react'
import { fetchStats } from '../api/books'

export function useStats(refreshKey) {
  const [stats, setStats] = useState({ total: 0, overdue: 0, due_soon: 0, active: 0 })

  useEffect(() => {
    fetchStats().then(setStats).catch(err => console.error('Stats fetch failed:', err))
  }, [refreshKey])

  return stats
}
