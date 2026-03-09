import { useStats } from '../hooks/useStats'

export default function StatsRow({ refreshKey }) {
  const stats = useStats(refreshKey)
  const cards = [
    { label: 'Total Issued', value: stats.total,    color: 'before:bg-slate-800', val: '' },
    { label: 'Active',       value: stats.active,   color: 'before:bg-emerald-500', val: 'text-emerald-600' },
    { label: 'Due Soon',     value: stats.due_soon, color: 'before:bg-amber-500',   val: 'text-amber-600' },
    { label: 'Overdue',      value: stats.overdue,  color: 'before:bg-red-500',      val: 'text-red-600' },
  ]
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
      {cards.map(c => (
        <div key={c.label} className={`bg-white border border-slate-200 rounded-2xl p-5 relative overflow-hidden shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all before:absolute before:top-0 before:left-0 before:right-0 before:h-[3px] ${c.color}`}>
          <div className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold mb-2">{c.label}</div>
          <div className={`text-4xl font-extrabold tracking-tight leading-none ${c.val || 'text-slate-800'}`}>{c.value}</div>
        </div>
      ))}
    </div>
  )
}
