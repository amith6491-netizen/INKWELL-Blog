import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-ink-100 bg-white mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <Link to="/" className="font-display text-lg font-bold text-ink-800">Inkwell</Link>
          <p className="text-xs text-ink-400 font-body mt-0.5">Where ideas find their voice.</p>
        </div>
        <div className="flex items-center gap-6 text-xs text-ink-400 font-body">
          <Link to="/blogs" className="hover:text-ink-700 transition-colors">Explore</Link>
          <Link to="/register" className="hover:text-ink-700 transition-colors">Join</Link>
          <span>© {new Date().getFullYear()} Inkwell</span>
        </div>
      </div>
    </footer>
  )
}
