import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { getStoredUser, getFullName, getErrorMessage } from '../utils/authUtils'
import '../styles/forms.css'

export function DashboardPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const storedUser = getStoredUser()
    if (!storedUser) {
      navigate('/login')
    } else {
      setUser(storedUser)
    }
  }, [navigate])

  const handleLogout = async () => {
    setLoading(true)
    try {
      await authService.logout()
      setMessage('Logged out successfully. Redirecting...')
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      setMessage(`Logout error: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="page-container">
        <div className="alert alert-info">Loading...</div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="header">
        <h1>Dashboard</h1>
        <p>Welcome back, {getFullName(user)}!</p>
      </div>

      {message && (
        <div
          className={`alert ${message.includes('error') ? 'alert-error' : 'alert-success'}`}
        >
          {message}
        </div>
      )}

      <div className="auth-form">
        <h2>Your Profile</h2>

        <div className="form-group">
          <label className="form-label">First Name</label>
          <div style={{ padding: '0.75rem', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
            {user.firstName}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Last Name</label>
          <div style={{ padding: '0.75rem', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
            {user.lastName}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Email</label>
          <div style={{ padding: '0.75rem', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
            {user.email}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Status</label>
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: '#f0f0f0',
              borderRadius: '4px',
              textTransform: 'capitalize',
            }}
          >
            {user.status || 'active'}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Member Since</label>
          <div style={{ padding: '0.75rem', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : 'Just now'}
          </div>
        </div>

        <button
          type="button"
          className="form-button"
          onClick={handleLogout}
          disabled={loading}
          style={{ backgroundColor: '#e74c3c' }}
        >
          {loading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  )
}
