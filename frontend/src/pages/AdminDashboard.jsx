import { useEffect, useState } from 'react'
import { adminAPI } from '../api'
import { formatDistanceToNow } from 'date-fns'
import Spinner from '../components/Spinner'
import toast from 'react-hot-toast'

const StatCard = ({ label, value, icon }) => (
  <div className="bg-white border border-ink-100 p-6 flex items-center gap-4">
    <span className="text-3xl">{icon}</span>
    <div>
      <p className="text-2xl font-display font-bold text-ink-900">{value}</p>
      <p className="text-xs text-ink-400 font-mono uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  </div>
)

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview')
  const [stats, setStats]   = useState(null)
  const [users, setUsers]   = useState([])
  const [blogs, setBlogs]   = useState([])
  const [loading, setLoading] = useState(true)
  const [userSearch, setUserSearch] = useState('')

  useEffect(() => {
    fetchData()
  }, [tab]) // eslint-disable-line

  const fetchData = async () => {
    setLoading(true)
    try {
      if (tab === 'overview') {
        const { data } = await adminAPI.getStats()
        setStats(data.data)
      } else if (tab === 'users') {
        const { data } = await adminAPI.getUsers({ limit: 50 })
        setUsers(data.data)
      } else if (tab === 'blogs') {
        const { data } = await adminAPI.getAllBlogs({ limit: 50 })
        setBlogs(data.data)
      }
    } catch {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleUser = async (id) => {
    try {
      const { data } = await adminAPI.toggleUserStatus(id)
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isActive: data.data.isActive } : u))
      toast.success(data.message)
    } catch {
      toast.error('Failed to update user')
    }
  }

  const handleDeleteBlog = async (id) => {
    if (!confirm('Delete this blog and all its comments?')) return
    try {
      await adminAPI.deleteBlog(id)
      setBlogs((prev) => prev.filter((b) => b._id !== id))
      toast.success('Blog deleted')
    } catch {
      toast.error('Failed to delete')
    }
  }

  const filteredUsers = users.filter(
    (u) =>
      !userSearch ||
      u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  )

  const TABS = ['overview', 'users', 'blogs']

  return (
    <div className="page-enter max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-ink-900">Admin Dashboard</h1>
        <p className="text-sm text-ink-400 font-mono mt-1">Manage users, content, and platform health.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-ink-100 mb-8 gap-0">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-3 text-sm font-body capitalize border-b-2 -mb-px transition-colors ${
              tab === t
                ? 'border-ink-800 text-ink-900 font-medium'
                : 'border-transparent text-ink-400 hover:text-ink-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : (
        <>
          {/* ── Overview ── */}
          {tab === 'overview' && stats && (
            <div className="space-y-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <StatCard label="Total Users"    value={stats.totalUsers}    icon="👥" />
                <StatCard label="Total Blogs"    value={stats.totalBlogs}    icon="📝" />
                <StatCard label="Total Comments" value={stats.totalComments} icon="💬" />
              </div>

              {/* Category breakdown */}
              {stats.categoryStats?.length > 0 && (
                <div>
                  <h2 className="font-display text-lg font-semibold text-ink-800 mb-4">Posts by Category</h2>
                  <div className="space-y-2">
                    {stats.categoryStats.map(({ _id, count }) => (
                      <div key={_id} className="flex items-center gap-3">
                        <span className="w-28 text-xs text-ink-500 font-mono shrink-0">{_id}</span>
                        <div className="flex-1 bg-parchment h-3 overflow-hidden">
                          <div
                            className="h-full bg-ink-400 transition-all duration-700"
                            style={{ width: `${(count / stats.totalBlogs) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-ink-400 font-mono w-6 text-right">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent posts */}
              {stats.recentBlogs?.length > 0 && (
                <div>
                  <h2 className="font-display text-lg font-semibold text-ink-800 mb-4">Recent Posts</h2>
                  <div className="space-y-2">
                    {stats.recentBlogs.map((b) => (
                      <div key={b._id} className="flex items-center gap-4 p-3 bg-white border border-ink-100">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-ink-800 truncate">{b.title}</p>
                          <p className="text-xs text-ink-400 font-mono">{b.author?.username}</p>
                        </div>
                        <span className="badge py-0">{b.category}</span>
                        <span className="text-xs text-ink-400 font-mono shrink-0">
                          {formatDistanceToNow(new Date(b.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Users ── */}
          {tab === 'users' && (
            <div>
              <div className="mb-4">
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search users…"
                  className="input-field max-w-xs"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-parchment border-b border-ink-100 text-left">
                      {['Username', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
                        <th key={h} className="px-4 py-3 text-xs font-mono uppercase tracking-wider text-ink-500">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr key={u._id} className="border-b border-ink-100 hover:bg-parchment/50 transition-colors">
                        <td className="px-4 py-3 font-medium text-ink-800">{u.username}</td>
                        <td className="px-4 py-3 text-ink-500 font-mono text-xs">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className={`badge py-0 ${u.role === 'admin' ? 'badge-accent' : ''}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-mono ${u.isActive ? 'text-green-600' : 'text-red-500'}`}>
                            {u.isActive ? '● Active' : '○ Banned'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-ink-400 font-mono">
                          {formatDistanceToNow(new Date(u.createdAt), { addSuffix: true })}
                        </td>
                        <td className="px-4 py-3">
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => handleToggleUser(u._id)}
                              className={`text-xs border px-3 py-1 transition-colors ${
                                u.isActive
                                  ? 'border-red-300 text-red-500 hover:bg-red-50'
                                  : 'border-green-300 text-green-600 hover:bg-green-50'
                              }`}
                            >
                              {u.isActive ? 'Ban' : 'Unban'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && (
                  <p className="text-center py-10 text-sm text-ink-400 font-mono">No users found</p>
                )}
              </div>
            </div>
          )}

          {/* ── Blogs ── */}
          {tab === 'blogs' && (
            <div className="space-y-3">
              {blogs.length === 0 && (
                <p className="text-center py-10 text-sm text-ink-400 font-mono">No blogs found</p>
              )}
              {blogs.map((b) => (
                <div key={b._id} className="card flex items-center gap-4 p-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-ink-800 text-sm truncate">{b.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-ink-400 font-mono">
                      <span>{b.author?.username}</span>
                      <span className="badge py-0">{b.category}</span>
                      <span>♥ {b.likes?.length ?? 0}</span>
                      <span>{formatDistanceToNow(new Date(b.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteBlog(b._id)}
                    className="btn-danger text-xs px-3 py-1.5 shrink-0"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
