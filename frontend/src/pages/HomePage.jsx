import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { blogAPI } from '../api'
import BlogCard from '../components/BlogCard'
import Spinner from '../components/Spinner'

export default function HomePage() {
  const [featured, setFeatured] = useState([])
  const [recent, setRecent]     = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const [f, r] = await Promise.all([
          blogAPI.getAll({ limit: 1, sort: '-views' }),
          blogAPI.getAll({ limit: 6, sort: '-createdAt' }),
        ])
        setFeatured(f.data.data)
        setRecent(r.data.data)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-ink-100">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M30 0 L60 30 L30 60 L0 30Z%22 fill=%22none%22 stroke=%22%23e8e2d5%22 stroke-width=%221%22/%3E%3C/svg%3E')] opacity-60" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-32 text-center">
          <span className="badge mb-6 inline-block">A Place for Ideas</span>
          <h1 className="font-display text-4xl sm:text-6xl font-bold text-ink-900 leading-tight mb-6">
            Stories that <em className="italic font-normal text-ink-500">matter</em>,<br />
            ideas that endure.
          </h1>
          <p className="text-lg text-ink-500 font-body max-w-xl mx-auto mb-10 leading-relaxed">
            Inkwell is a home for thoughtful writing — explore articles on technology,
            design, culture and beyond. Or share your own.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/blogs"    className="btn-primary px-8 py-3">Explore Articles</Link>
            <Link to="/register" className="btn-outline px-8 py-3">Start Writing</Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
        {loading ? (
          <div className="flex justify-center py-20"><Spinner /></div>
        ) : (
          <>
            {/* Featured */}
            {featured[0] && (
              <section className="mb-16">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-display text-2xl font-semibold text-ink-900">Featured</h2>
                  <div className="flex-1 border-t border-ink-100" />
                </div>
                <Link to={`/blogs/${featured[0]._id}`} className="group grid md:grid-cols-2 gap-0 card overflow-hidden">
                  <div className="h-64 md:h-auto overflow-hidden bg-parchment">
                    {featured[0].image ? (
                      <img
                        src={featured[0].image}
                        alt={featured[0].title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl font-display text-ink-300">{featured[0].title?.[0]}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <span className="badge mb-4">{featured[0].category}</span>
                    <h3 className="font-display text-2xl font-bold text-ink-900 leading-tight mb-4 group-hover:text-ink-600 transition-colors">
                      {featured[0].title}
                    </h3>
                    <p className="text-ink-500 text-sm leading-relaxed mb-6 line-clamp-3">
                      {featured[0].excerpt}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-ink-200 flex items-center justify-center text-xs font-medium">
                        {featured[0].author?.username?.[0]?.toUpperCase()}
                      </div>
                      <span className="text-sm text-ink-600">{featured[0].author?.username}</span>
                    </div>
                  </div>
                </Link>
              </section>
            )}

            {/* Recent */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-semibold text-ink-900">Latest</h2>
                <Link to="/blogs" className="text-sm text-ink-500 hover:text-ink-800 transition-colors font-mono">
                  View all →
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recent.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
