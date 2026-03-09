import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

function Toast({ msg, type }) {
  const bg = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-red-600' : 'bg-indigo-600'
  return (
    <div className={`${bg} text-white px-5 py-3 rounded-xl text-sm font-medium shadow-lg min-w-[220px] animate-slide-up`}>
      {msg}
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const toast = useCallback((msg, type = 'success') => {
    const id = Date.now()
    setToasts(p => [...p, { id, msg, type }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000)
  }, [])
  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-6 right-6 flex flex-col gap-2 z-[9999]">
        {toasts.map(t => <Toast key={t.id} msg={t.msg} type={t.type} />)}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() { return useContext(ToastContext) }
