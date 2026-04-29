import { useState } from 'react'
import Spinner from './Spinner'

const CATEGORIES = [
  'Technology', 'Programming', 'Design', 'Science',
  'Health', 'Business', 'Travel', 'Food', 'Lifestyle', 'Other',
]

export default function BlogForm({ initialData = {}, onSubmit, loading }) {
  const [form, setForm] = useState({
    title:    initialData.title    ?? '',
    content:  initialData.content  ?? '',
    category: initialData.category ?? 'Technology',
    image:    initialData.image    ?? '',
    tags:     Array.isArray(initialData.tags) ? initialData.tags.join(', ') : (initialData.tags ?? ''),
    excerpt:  initialData.excerpt  ?? '',
  })

  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.title.trim())   e.title   = 'Title is required'
    if (form.title.length < 5) e.title  = 'Title must be at least 5 characters'
    if (!form.content.trim()) e.content  = 'Content is required'
    if (form.content.length < 20) e.content = 'Content must be at least 20 characters'
    return e
  }

  const handleChange = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }))
    setErrors((er) => ({ ...er, [field]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) return setErrors(errs)
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-ink-700 mb-1.5">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={form.title}
          onChange={handleChange('title')}
          placeholder="Your compelling title…"
          className={`input-field ${errors.title ? 'border-red-400' : ''}`}
          maxLength={150}
        />
        {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        <p className="text-xs text-ink-400 mt-1 font-mono">{form.title.length}/150</p>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-ink-700 mb-1.5">Category</label>
        <select
          value={form.category}
          onChange={handleChange('category')}
          className="input-field"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-sm font-medium text-ink-700 mb-1.5">
          Cover Image URL <span className="text-ink-400 font-normal">(optional)</span>
        </label>
        <input
          type="url"
          value={form.image}
          onChange={handleChange('image')}
          placeholder="https://images.unsplash.com/…"
          className="input-field"
        />
        {form.image && (
          <img
            src={form.image}
            alt="Preview"
            className="mt-2 h-32 w-full object-cover border border-ink-200"
            onError={(e) => { e.target.style.display = 'none' }}
          />
        )}
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-ink-700 mb-1.5">
          Excerpt <span className="text-ink-400 font-normal">(optional — auto-generated if blank)</span>
        </label>
        <textarea
          value={form.excerpt}
          onChange={handleChange('excerpt')}
          placeholder="A short teaser for your article…"
          className="textarea-field min-h-[80px]"
          maxLength={300}
        />
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-ink-700 mb-1.5">
          Content <span className="text-red-500">*</span>
        </label>
        <textarea
          value={form.content}
          onChange={handleChange('content')}
          placeholder="Write your story here… Markdown-style formatting is supported in rendering."
          className={`textarea-field min-h-[360px] ${errors.content ? 'border-red-400' : ''}`}
        />
        {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content}</p>}
        <p className="text-xs text-ink-400 mt-1 font-mono">{form.content.length} characters</p>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-ink-700 mb-1.5">
          Tags <span className="text-ink-400 font-normal">(comma-separated)</span>
        </label>
        <input
          type="text"
          value={form.tags}
          onChange={handleChange('tags')}
          placeholder="react, javascript, tutorial"
          className="input-field"
        />
      </div>

      {/* Submit */}
      <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm">
        {loading ? <><Spinner size="sm" /> Saving…</> : 'Publish Article'}
      </button>
    </form>
  )
}
