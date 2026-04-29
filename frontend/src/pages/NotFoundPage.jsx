import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="page-enter min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <p className="font-display text-8xl font-bold text-ink-100 select-none mb-4">404</p>
      <h1 className="font-display text-2xl font-semibold text-ink-800 mb-2">Page not found</h1>
      <p className="text-ink-500 font-body mb-8 max-w-sm">
        The page you're looking for seems to have wandered off into the margins.
      </p>
      <Link to="/" className="btn-primary px-8 py-3">← Back to Home</Link>
    </div>
  )
}
