import { Link } from 'react-router-dom'

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20 text-center">
      <div className="text-5xl mb-5">📚</div>
      <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight mb-4">About SmartLib</h1>
      <p className="text-base text-slate-500 leading-relaxed mb-10">
        SmartLib is a Design Thinking &amp; Innovation Lab prototype built for
        <strong className="text-slate-700"> JNTUGV (Jawaharlal Nehru Technological University Gurajada Vizianagaram)</strong>.
        It digitizes the library book-tracking process — solving the real student pain point of losing track
        of due dates, incurring unexpected fines, and lack of timely reminders.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left">
        {[
          ['🎯','Problem','Students forget return dates, accumulate fines, and librarians spend hours on manual tracking.'],
          ['💡','Solution','A centralized portal with due date tracking, one-click renewals, and WhatsApp reminders.'],
          ['🛠','Tech Stack','React + Vite (frontend), Node.js + Express + MongoDB (backend).'],
          ['👥','Users','B.Tech students across all branches and years, plus library admin staff.'],
        ].map(([icon,title,desc]) => (
          <div key={title} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all">
            <div className="text-3xl mb-3">{icon}</div>
            <div className="font-bold text-slate-800 mb-2">{title}</div>
            <div className="text-sm text-slate-500 leading-relaxed">{desc}</div>
          </div>
        ))}
      </div>
      <Link to="/"
        className="inline-block bg-indigo-600 text-white px-7 py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all">
        ← Back to Home
      </Link>
    </div>
  )
}
