import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Attach JWT on every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Handle 401 globally
API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

// ── Auth ──────────────────────────────────────
export const authAPI = {
  register:       (data) => API.post('/auth/register', data),
  login:          (data) => API.post('/auth/login', data),
  getMe:          ()     => API.get('/auth/me'),
  updateProfile:  (data) => API.put('/auth/profile', data),
  changePassword: (data) => API.put('/auth/change-password', data),
}

// ── Blogs ─────────────────────────────────────
export const blogAPI = {
  getAll:    (params) => API.get('/blogs', { params }),
  getById:   (id)     => API.get(`/blogs/${id}`),
  create:    (data)   => API.post('/blogs', data),
  update:    (id, data) => API.put(`/blogs/${id}`, data),
  delete:    (id)     => API.delete(`/blogs/${id}`),
  like:      (id)     => API.put(`/blogs/${id}/like`),
  getMyBlogs: ()      => API.get('/blogs/my-blogs'),
}

// ── Comments ──────────────────────────────────
export const commentAPI = {
  getByBlog: (blogId)        => API.get(`/comments/${blogId}`),
  add:       (blogId, data)  => API.post(`/comments/${blogId}`, data),
  update:    (id, data)      => API.put(`/comments/${id}`, data),
  delete:    (id)            => API.delete(`/comments/${id}`),
  like:      (id)            => API.put(`/comments/${id}/like`),
}

// ── Admin ─────────────────────────────────────
export const adminAPI = {
  getStats:         ()   => API.get('/admin/stats'),
  getUsers:         (p)  => API.get('/admin/users', { params: p }),
  toggleUserStatus: (id) => API.put(`/admin/users/${id}/toggle-status`),
  promoteUser:      (id) => API.put(`/admin/users/${id}/promote`),
  getAllBlogs:       (p)  => API.get('/admin/blogs', { params: p }),
  deleteBlog:       (id) => API.delete(`/admin/blogs/${id}`),
}

export default API
