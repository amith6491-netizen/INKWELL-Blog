import { useState } from 'react'

const CATEGORIES = [
  'All', 'Technology', 'Programming', 'Design',
  'Science', 'Health', 'Business', 'Travel', 'Food', 'Lifestyle', 'Other',
]

export default function SearchBar({ onSearch, onCategory, activeCategory }) {
  const [q, setQ] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(q.trim())
  }

  return (
    <div className="space-y-4">
      {/* Search input */}
      <form onSubmit={handleSubmit} className="flex gap-0">
        <input
          type="text"
          value={q}
          onChange={(e) => {
            setQ(e.target.value)
            if (!e.target.value) onSearch('')
          }}
          placeholder="Search articles…"
          className="input-field flex-1"
        />
        <button type="submit" className="btn-primary px-5 py-2.5 shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategory(cat)}
            className={`px-3 py-1 text-xs font-mono uppercase tracking-wider border transition-all duration-150 ${
              activeCategory === cat
                ? 'bg-ink-800 text-cream border-ink-800'
                : 'bg-transparent text-ink-500 border-ink-200 hover:border-ink-500 hover:text-ink-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}
