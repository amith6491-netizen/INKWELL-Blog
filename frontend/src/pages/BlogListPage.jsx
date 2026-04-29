import { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { blogAPI } from '../api'
import BlogCard  from '../components/BlogCard'
import SearchBar from '../components/SearchBar'
import Spinner   from '../components/Spinner'

export default function BlogListPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [blogs, setBlogs]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [pagination, setPagination] = useState({})
  const [search, setSearch]       = useState(searchParams.get('search') || '')
  const [category, setCategory]   = useState(searchParams.get('category') || 'All')
  const [page, setPage]           = useState(Number(searchParams.get('page')) || 1)

  const fetchBlogs = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, limit: 9, sort: '-createdAt' }
      if (search)             params.search   = search
      if (category !== 'All') params.category = category

      const { data } = await blogAPI.getAll(params)
      setBlogs(data.data)
      setPagination(data.pagination)
    } catch {
      setBlogs([])
    } finally {
      setLoading(false)
    }
  }, [page, search, category])

  useEffect(() => { fetchBlogs() }, [fetchBlogs])

  useEffect(() => {
    const p = {}
    if (search)             p.search   = search
    if (category !== 'All') p.category = category
    if (page > 1)           p.page     = page
    setSearchParams(p)
  }, [search, category, page, setSearchParams])

  const handleSearch   = (q)   => { setSearch(q);   setPage(1) }
  const handleCategory = (cat) => { setCategory(cat); setPage(1) }

  return (
    <div className="page-enter max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-10">
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-ink-900 mb-2">Explore</h1>
        <p className="text-ink-500 font-body">
          {pagination.total ?? '…'} article{pagination.total !== 1 ? 's' : ''} published
        </p>
      </div>

      <div className="mb-8">
        <SearchBar
          onSearch={handleSearch}
          onCategory={handleCategory}
          activeCategory={category}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-display text-2xl text-ink-300 mb-2">No articles found</p>
          <p className="text-sm text-ink-400 font-body">Try a different search or category.</p>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {blogs.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="btn-outline text-xs px-4 py-2 disabled:opacity-40"
              >
                ← Prev
              </button>
              <div className="flex gap-1">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 text-xs font-mono border transition-all ${
                      p === page
                        ? 'bg-ink-800 text-cream border-ink-800'
                        : 'border-ink-200 text-ink-500 hover:border-ink-500'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <button
                disabled={page === pagination.pages}
                onClick={() => setPage(p => p + 1)}
                className="btn-outline text-xs px-4 py-2 disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
