import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { blogAPI } from '../api'
import { useAuth } from '../context/AuthContext'
import BlogForm from '../components/BlogForm'
import Spinner from '../components/Spinner'
import toast from 'react-hot-toast'

export default function EditBlogPage() {
  const { id }            = useParams()
  const navigate          = useNavigate()
  const { user, isAdmin } = useAuth()

  const [blog, setBlog]         = useState(null)
  const [fetching, setFetching] = useState(true)
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await blogAPI.getById(id)
        const b = data.data

        // Auth guard client-side
        const isAuthor = b.author?._id === user?._id || b.author === user?._id
        if (!isAuthor && !isAdmin) {
          toast.error('Not authorized to edit this blog')
          return navigate(`/blogs/${id}`)
        }

        setBlog(b)
      } catch {
        toast.error('Blog not found')
        navigate('/blogs')
      } finally {
        setFetching(false)
      }
    }
    fetch()
  }, [id]) // eslint-disable-line

  const handleSubmit = async (form) => {
    setLoading(true)
    try {
      await blogAPI.update(id, form)
      toast.success('Blog updated!')
      navigate(`/blogs/${id}`)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to update')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="page-enter max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink-900 mb-1">Edit Article</h1>
        <p className="text-sm text-ink-400 font-body">Update your post and republish.</p>
      </div>
      {blog && (
        <BlogForm
          initialData={blog}
          onSubmit={handleSubmit}
          loading={loading}
        />
      )}
    </div>
  )
}
