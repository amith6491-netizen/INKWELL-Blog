import { useState, useEffect } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { commentAPI } from '../api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import Spinner from './Spinner'

function CommentItem({ comment, onDelete, onLike, currentUser, isAdmin }) {
  const [editing, setEditing]   = useState(false)
  const [text, setText]         = useState(comment.content)
  const [saving, setSaving]     = useState(false)

  const isOwner = currentUser && comment.author?._id === currentUser._id

  const handleSave = async () => {
    if (!text.trim()) return
    setSaving(true)
    try {
      await commentAPI.update(comment._id, { content: text })
      setEditing(false)
      toast.success('Comment updated')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex gap-3 py-4 border-b border-ink-100 last:border-0">
      <div className="w-8 h-8 rounded-full bg-ink-200 flex items-center justify-center text-xs font-medium text-ink-700 shrink-0">
        {comment.author?.username?.[0]?.toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-ink-800">{comment.author?.username}</span>
          <time className="text-xs text-ink-400 font-mono">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </time>
        </div>

        {editing ? (
          <div className="flex flex-col gap-2">
            <textarea
              className="textarea-field min-h-[80px] text-sm"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving} className="btn-primary text-xs px-3 py-1.5">
                {saving ? <Spinner size="sm" /> : 'Save'}
              </button>
              <button onClick={() => setEditing(false)} className="btn-ghost text-xs px-3 py-1.5">Cancel</button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-ink-700 leading-relaxed">{comment.content}</p>
        )}

        <div className="flex items-center gap-3 mt-2">
          <button
            onClick={() => onLike(comment._id)}
            className="text-xs text-ink-400 hover:text-red-500 transition-colors font-mono"
          >
            ♥ {comment.likes?.length ?? 0}
          </button>
          {(isOwner || isAdmin) && !editing && (
            <>
              {isOwner && (
                <button onClick={() => setEditing(true)} className="text-xs text-ink-400 hover:text-ink-700 transition-colors">
                  Edit
                </button>
              )}
              <button onClick={() => onDelete(comment._id)} className="text-xs text-red-400 hover:text-red-600 transition-colors">
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function CommentSection({ blogId }) {
  const { isAuth, user, isAdmin } = useAuth()
  const [comments, setComments]   = useState([])
  const [loading, setLoading]     = useState(true)
  const [text, setText]           = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchComments = async () => {
    try {
      const { data } = await commentAPI.getByBlog(blogId)
      setComments(data.data)
    } catch {
      toast.error('Failed to load comments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchComments() }, [blogId]) // eslint-disable-line

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setSubmitting(true)
    try {
      const { data } = await commentAPI.add(blogId, { content: text })
      setComments((prev) => [data.data, ...prev])
      setText('')
      toast.success('Comment posted')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to post')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this comment?')) return
    try {
      await commentAPI.delete(id)
      setComments((prev) => prev.filter((c) => c._id !== id))
      toast.success('Comment deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const handleLike = async (id) => {
    if (!isAuth) return toast.error('Please sign in to like')
    try {
      const { data } = await commentAPI.like(id)
      setComments((prev) =>
        prev.map((c) => {
          if (c._id !== id) return c
          const likes = data.liked
            ? [...(c.likes || []), user._id]
            : (c.likes || []).filter((l) => l !== user._id)
          return { ...c, likes }
        })
      )
    } catch { /* silent */ }
  }

  return (
    <section className="mt-12 pt-8 border-t border-ink-100">
      <h3 className="font-display text-xl font-semibold text-ink-900 mb-6">
        {comments.length} Comment{comments.length !== 1 ? 's' : ''}
      </h3>

      {/* Comment form */}
      {isAuth ? (
        <form onSubmit={handleSubmit} className="mb-8 flex flex-col gap-3">
          <textarea
            className="textarea-field min-h-[100px]"
            placeholder="Share your thoughts…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={500}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-ink-400 font-mono">{text.length}/500</span>
            <button type="submit" disabled={submitting || !text.trim()} className="btn-primary text-xs">
              {submitting ? <Spinner size="sm" /> : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <p className="text-sm text-ink-500 mb-8 p-4 bg-parchment border border-ink-200">
          <a href="/login" className="underline text-ink-700">Sign in</a> to join the conversation.
        </p>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="flex justify-center py-8"><Spinner /></div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-ink-400 text-center py-8 font-mono">No comments yet. Be the first!</p>
      ) : (
        <div>
          {comments.map((c) => (
            <CommentItem
              key={c._id}
              comment={c}
              onDelete={handleDelete}
              onLike={handleLike}
              currentUser={user}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </section>
  )
}
