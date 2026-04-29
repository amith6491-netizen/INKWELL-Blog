import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { formatDistanceToNow, format } from 'date-fns'
import { blogAPI } from '../api'
import { useAuth } from '../context/AuthContext'
import CommentSection from '../components/CommentSection'
import Spinner from '../components/Spinner'
import toast from 'react-hot-toast'

export default function BlogDetailPage() {
  const { id }              = useParams()
  const navigate            = useNavigate()
  const { isAuth, user, isAdmin } = useAuth()

  const [blog, setBlog]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [liking, setLiking] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const { data } = await blogAPI.getById(id)
        setBlog(data.data)
      } catch {
        toast.error('Blog not found')
        navigate('/blogs')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id]) // eslint-disable-line

  const isAuthor = isAuth && user && blog && blog.author?._id === user._id
  const hasLiked = isAuth && user && blog?.likes?.some(
    (l) => (typeof l === 'string' ? l : l._id?.toString()) === user._id?.toString()
  )

  const handleLike = async () => {
    if (!isAuth) return toast.error('Sign in to like this article')
    if (liking) return
    setLiking(true)
    try {
      const { data } = await blogAPI.like(blog._id)
      setBlog((prev) => ({
        ...prev,
        likes: data.liked
          ? [...(prev.likes || []), user._id]
          : (prev.likes || []).filter((l) => {
              const lid = typeof l === 'string' ? l : l._id?.toString()
              return lid !== user._id?.toString()
            }),
      }))
    } catch {
      toast.error('Failed to update like')
    } finally {
      setLiking(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Delete this blog post permanently?')) return
    setDeleting(true)
    try {
      await blogAPI.delete(blog._id)
      toast.success('Blog deleted')
      navigate('/blogs')
    } catch {
      toast.error('Failed to delete')
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!blog) return null

  return (
    <div className="page-enter">
      {/* Hero banner */}
      {blog.image && (
        <div className="w-full h-64 sm:h-96 overflow-hidden bg-parchment">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Meta top */}
        <div className="flex items-center gap-3 mb-6">
          <span className="badge">{blog.category}</span>
          <span className="text-ink-300">·</span>
          <time className="text-xs text-ink-400 font-mono">
            {format(new Date(blog.createdAt), 'MMMM d, yyyy')}
          </time>
          <span className="text-ink-300">·</span>
          <span className="text-xs text-ink-400 font-mono">{blog.views} views</span>
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-ink-900 leading-tight mb-6">
          {blog.title}
        </h1>

        {/* Author strip */}
        <div className="flex items-center justify-between flex-wrap gap-4 py-4 border-y border-ink-100 mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-ink-200 flex items-center justify-center text-sm font-semibold text-ink-700">
              {blog.author?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-medium text-ink-800">{blog.author?.username}</p>
              <p className="text-xs text-ink-400 font-mono">
                {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {(isAuthor || isAdmin) && (
              <>
                {isAuthor && (
                  <Link to={`/blogs/${blog._id}/edit`} className="btn-ghost text-xs px-3 py-1.5">
                    ✏️ Edit
                  </Link>
                )}
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="btn-danger text-xs px-3 py-1.5"
                >
                  {deleting ? <Spinner size="sm" /> : '🗑 Delete'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <article className="blog-content mb-10 whitespace-pre-wrap">
          {blog.content}
        </article>

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 pt-6 border-t border-ink-100">
            {blog.tags.map((tag) => (
              <Link
                key={tag}
                to={`/blogs?tag=${tag}`}
                className="text-xs font-mono text-ink-500 border border-ink-200 px-2.5 py-1 hover:border-ink-500 hover:text-ink-700 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Like button */}
        <div className="flex items-center gap-4 py-6 border-y border-ink-100 mb-10">
          <button
            onClick={handleLike}
            disabled={liking}
            className={`flex items-center gap-2 px-5 py-2.5 border transition-all duration-200 text-sm font-body ${
              hasLiked
                ? 'bg-red-50 border-red-300 text-red-600'
                : 'border-ink-200 text-ink-500 hover:border-red-300 hover:text-red-500'
            }`}
          >
            <span className="text-base">{hasLiked ? '♥' : '♡'}</span>
            <span>{blog.likes?.length ?? 0} {blog.likes?.length === 1 ? 'Like' : 'Likes'}</span>
          </button>
          <span className="text-xs text-ink-400 font-mono">
            💬 {blog.commentCount ?? 0} comments
          </span>
        </div>

        {/* Comments */}
        <CommentSection blogId={blog._id} />
      </div>
    </div>
  )
}
