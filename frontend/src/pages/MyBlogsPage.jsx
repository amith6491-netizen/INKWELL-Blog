import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { blogAPI } from '../api'
import { formatDistanceToNow } from 'date-fns'
import Spinner from '../components/Spinner'
import toast from 'react-hot-toast'

export default function MyBlogsPage() {
  const navigate = useNavigate()
  const [blogs, setBlogs]     = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await blogAPI.getMyBlogs()
        setBlogs(data.data)
      } catch {
        toast.error('Failed to load your blogs')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this blog post?')) return
    setDeleting(id)
    try {
      await blogAPI.delete(id)
      setBlogs((prev) => prev.filter((b) => b._id !== id))
      toast.success('Blog deleted')
    } catch {
      toast.error('Failed to delete')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="page-enter max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink-900">My Articles</h1>
          <p className="text-sm text-ink-400 font-mono mt-1">{blogs.length} posts published</p>
        </div>
        <Link to="/blogs/new" className="btn-primary text-sm">
          + New Article
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-ink-200">
          <p className="font-display text-2xl text-ink-300 mb-3">No articles yet</p>
          <p className="text-sm text-ink-400 mb-6">Your writing journey starts with a single word.</p>
          <Link to="/blogs/new" className="btn-primary">Write Your First Article</Link>
        </div>
      ) : (
        <div className="space-y-3">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="card flex items-center gap-4 p-4 sm:p-5"
            >
              {/* Thumbnail */}
              <div className="w-14 h-14 shrink-0 bg-parchment border border-ink-100 overflow-hidden">
                {blog.image ? (
                  <img src={blog.image} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-display text-xl text-ink-300">
                    {blog.title?.[0]}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <Link
                  to={`/blogs/${blog._id}`}
                  className="font-display text-base font-semibold text-ink-900 hover:text-ink-600 transition-colors line-clamp-1"
                >
                  {blog.title}
                </Link>
                <div className="flex items-center gap-3 mt-1 text-xs text-ink-400 font-mono flex-wrap">
                  <span className="badge py-0">{blog.category}</span>
                  <span>♥ {blog.likes?.length ?? 0}</span>
                  <span>💬 {blog.commentCount ?? 0}</span>
                  <span>{formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={`/blogs/${blog._id}/edit`}
                  className="btn-ghost text-xs px-3 py-1.5"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(blog._id)}
                  disabled={deleting === blog._id}
                  className="btn-danger text-xs px-3 py-1.5"
                >
                  {deleting === blog._id ? <Spinner size="sm" /> : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
