import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../api'
import Spinner from '../components/Spinner'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()

  const [profileForm, setProfileForm] = useState({
    username: user?.username || '',
    bio:      user?.bio      || '',
    avatar:   user?.avatar   || '',
  })
  const [pwForm, setPwForm] = useState({
    currentPassword: '',
    newPassword:     '',
    confirm:         '',
  })
  const [savingProfile, setSavingProfile] = useState(false)
  const [savingPw,      setSavingPw]      = useState(false)
  const [tab, setTab] = useState('profile') // 'profile' | 'password'

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setSavingProfile(true)
    try {
      const { data } = await authAPI.updateProfile(profileForm)
      updateUser(data.user)
      toast.success('Profile updated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed')
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePwSubmit = async (e) => {
    e.preventDefault()
    if (pwForm.newPassword !== pwForm.confirm) {
      return toast.error('Passwords do not match')
    }
    if (pwForm.newPassword.length < 6) {
      return toast.error('New password must be at least 6 characters')
    }
    setSavingPw(true)
    try {
      await authAPI.changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword:     pwForm.newPassword,
      })
      toast.success('Password changed — please sign in again')
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' })
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password')
    } finally {
      setSavingPw(false)
    }
  }

  const setP = (field) => (e) => setProfileForm((f) => ({ ...f, [field]: e.target.value }))
  const setPw = (field) => (e) => setPwForm((f) => ({ ...f, [field]: e.target.value }))

  return (
    <div className="page-enter max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 rounded-full bg-ink-200 flex items-center justify-center text-2xl font-semibold text-ink-700">
          {user?.username?.[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">{user?.username}</h1>
          <p className="text-sm text-ink-400 font-mono">
            Member since {user?.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy') : ''}
            {user?.role === 'admin' && (
              <span className="ml-2 badge-accent">Admin</span>
            )}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-ink-100 mb-8">
        {['profile', 'password'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-body capitalize transition-colors border-b-2 -mb-px ${
              tab === t
                ? 'border-ink-800 text-ink-900 font-medium'
                : 'border-transparent text-ink-400 hover:text-ink-700'
            }`}
          >
            {t === 'profile' ? 'Edit Profile' : 'Change Password'}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {tab === 'profile' && (
        <form onSubmit={handleProfileSubmit} className="space-y-5">
          {/* Avatar */}
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">
              Avatar URL <span className="text-ink-400 font-normal">(optional)</span>
            </label>
            <input
              type="url"
              value={profileForm.avatar}
              onChange={setP('avatar')}
              placeholder="https://example.com/photo.jpg"
              className="input-field"
            />
            {profileForm.avatar && (
              <img
                src={profileForm.avatar}
                alt="Avatar preview"
                className="mt-2 w-12 h-12 rounded-full object-cover border border-ink-200"
                onError={(e) => { e.target.style.display = 'none' }}
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Username</label>
            <input
              type="text"
              value={profileForm.username}
              onChange={setP('username')}
              className="input-field"
              maxLength={30}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Email</label>
            <input
              type="email"
              value={user?.email}
              disabled
              className="input-field opacity-50 cursor-not-allowed bg-parchment"
            />
            <p className="text-xs text-ink-400 mt-1">Email cannot be changed.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Bio</label>
            <textarea
              value={profileForm.bio}
              onChange={setP('bio')}
              placeholder="A little about yourself…"
              className="textarea-field min-h-[100px]"
              maxLength={200}
            />
            <p className="text-xs text-ink-400 mt-1 font-mono">{profileForm.bio.length}/200</p>
          </div>

          <button type="submit" disabled={savingProfile} className="btn-primary px-8 py-2.5">
            {savingProfile ? <><Spinner size="sm" /> Saving…</> : 'Save Profile'}
          </button>
        </form>
      )}

      {/* Password tab */}
      {tab === 'password' && (
        <form onSubmit={handlePwSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Current Password</label>
            <input
              type="password"
              value={pwForm.currentPassword}
              onChange={setPw('currentPassword')}
              className="input-field"
              autoComplete="current-password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">New Password</label>
            <input
              type="password"
              value={pwForm.newPassword}
              onChange={setPw('newPassword')}
              className="input-field"
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-700 mb-1.5">Confirm New Password</label>
            <input
              type="password"
              value={pwForm.confirm}
              onChange={setPw('confirm')}
              className="input-field"
              autoComplete="new-password"
            />
          </div>

          <button type="submit" disabled={savingPw} className="btn-primary px-8 py-2.5">
            {savingPw ? <><Spinner size="sm" /> Changing…</> : 'Change Password'}
          </button>
        </form>
      )}
    </div>
  )
}
