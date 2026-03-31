import { useState, useEffect, useCallback } from 'react'
import { fetchNotifications, markNotificationRead } from '../api/books'

export function useNotifications(studentId) {
  const [data, setData] = useState({ notifications: [], unreadCount: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    if (!studentId) return
    try {
      setLoading(true)
      const res = await fetchNotifications(studentId)
      setData(res)
      setError(null)
    } catch (e) {
      setError('Cannot reach server to fetch notifications.')
    } finally {
      setLoading(false)
    }
  }, [studentId])

  useEffect(() => { load() }, [load])

  const markAsRead = async (id) => {
    try {
      await markNotificationRead(id)
      // Update local state optimizing for speed
      setData(prev => ({
        notifications: prev.notifications.map(n => n._id === id ? { ...n, isRead: true } : n),
        unreadCount: Math.max(0, prev.unreadCount - 1)
      }))
    } catch (e) {
      console.error('Failed to mark read', e)
    }
  }

  return { ...data, loading, error, reload: load, markAsRead }
}
