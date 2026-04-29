import { Link } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'

export default function BlogCard({ blog }) {
  const liked = blog.likes?.length ?? 0

  return (
    <article className="card group flex flex-col overflow-hidden">
      {/* Image */}
      {blog.image ? (
        <div className="h-44 overflow-hidden bg-parchment">
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="h-44 bg-gradient-to-br from-ink-100 to-parchment flex items-center justify-center">
          <span className="text-4xl opacity-30 select-none font-display text-ink-400">
            {blog.title?.[0] ?? '?'}
          </span>
        </div>
      )}

      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Category + date */}
        <div className="flex items-center justify-between">
          <span className="badge">{blog.category}</span>
          <time className="text-xs text-ink-400 font-mono">
            {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
          </time>
        </div>

        {/* Title */}
        <Link to={`/blogs/${blog._id}`}>
          <h2 className="font-display text-lg font-semibold text-ink-900 leading-snug
                         group-hover:text-ink-600 transition-colors line-clamp-2">
            {blog.title}
          </h2>
        </Link>

        {/* Excerpt */}
        <p className="text-sm text-ink-500 line-clamp-2 leading-relaxed flex-1">
          {blog.excerpt || blog.content?.substring(0, 150)}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-ink-100">
          <Link
            to={`/blogs/${blog._id}`}
            className="flex items-center gap-2"
          >
            <div className="w-6 h-6 rounded-full bg-ink-200 flex items-center justify-center text-xs font-medium text-ink-700">
              {blog.author?.username?.[0]?.toUpperCase()}
            </div>
            <span className="text-xs text-ink-500 font-body">{blog.author?.username}</span>
          </Link>

          <div className="flex items-center gap-3 text-xs text-ink-400 font-mono">
            <span title="Likes">♥ {liked}</span>
            <span title="Comments">💬 {blog.commentCount ?? 0}</span>
          </div>
        </div>
      </div>
    </article>
  )
}
