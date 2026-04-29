import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import Layout       from './components/Layout'
import Spinner      from './components/Spinner'
import HomePage     from './pages/HomePage'
import LoginPage    from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BlogListPage from './pages/BlogListPage'
import BlogDetailPage  from './pages/BlogDetailPage'
import CreateBlogPage  from './pages/CreateBlogPage'
import EditBlogPage    from './pages/EditBlogPage'
import ProfilePage     from './pages/ProfilePage'
import MyBlogsPage     from './pages/MyBlogsPage'
import AdminDashboard  from './pages/AdminDashboard'
import NotFoundPage    from './pages/NotFoundPage'

// Route guards
const PrivateRoute = ({ children }) => {
  const { isAuth, loading } = useAuth()
  if (loading) return <Spinner full />
  return isAuth ? children : <Navigate to="/login" replace />
}

const AdminRoute = ({ children }) => {
  const { isAuth, isAdmin, loading } = useAuth()
  if (loading) return <Spinner full />
  if (!isAuth)  return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}

const GuestRoute = ({ children }) => {
  const { isAuth, loading } = useAuth()
  if (loading) return <Spinner full />
  return !isAuth ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index                  element={<HomePage />} />
        <Route path="blogs"           element={<BlogListPage />} />
        <Route path="blogs/:id"       element={<BlogDetailPage />} />

        {/* Auth */}
        <Route path="login"    element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="register" element={<GuestRoute><RegisterPage /></GuestRoute>} />

        {/* Protected */}
        <Route path="blogs/new"       element={<PrivateRoute><CreateBlogPage /></PrivateRoute>} />
        <Route path="blogs/:id/edit"  element={<PrivateRoute><EditBlogPage /></PrivateRoute>} />
        <Route path="profile"         element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
        <Route path="my-blogs"        element={<PrivateRoute><MyBlogsPage /></PrivateRoute>} />

        {/* Admin */}
        <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
