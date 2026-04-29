import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { blogAPI } from '../api'
import BlogForm from '../components/BlogForm'
import toast from 'react-hot-toast'

export default function CreateBlogPage() {
  const navigate      = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (form) => {
    setLoading(true)
    try {
      const { data } = await blogAPI.create(form)
      toast.success('Blog published!')
      navigate(`/blogs/${data.data._id}`)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to publish')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-enter max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink-900 mb-1">Write a New Article</h1>
        <p className="text-sm text-ink-400 font-body">Share your story with the world.</p>
      </div>
      <BlogForm onSubmit={handleSubmit} loading={loading} />
    </div>
  )
}
