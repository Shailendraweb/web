import { useNavigate } from 'react-router-dom'
import { getFullName, getStoredUser, isAdmin, isUserAuthenticated } from '../utils/authUtils'
import '../styles/forms.css'

export function HomePage() {
  const navigate = useNavigate()
  const isAuthenticated = isUserAuthenticated()
  const user = getStoredUser()

  return (
    <div className="page-container">
      <div className="header">
        <h1>Welcome to Our Application</h1>
        {isAuthenticated && user ? (
          <p>Hello, {getFullName(user)}! 👋</p>
        ) : (
          <p>Please sign in or create an account to get started</p>
        )}
      </div>

      <div className="auth-form">
        <h2>Get Started</h2>
        <p>
          {isAuthenticated
            ? 'You are logged in. Explore your dashboard for more options.'
            : 'Sign in to your account or create a new one to access all features.'}
        </p>

        <div style={{ display: 'flex', gap: '1rem' }}>
          {isAuthenticated ? (
            <button
              type="button"
              className="form-button"
              onClick={() => navigate(isAdmin() ? '/admin' : '/shop')}
            >
              Open portal
            </button>
          ) : (
            <>
              <button
                type="button"
                className="form-button"
                onClick={() => navigate('/login')}
              >
                Sign In
              </button>
              <button
                type="button"
                className="form-button"
                onClick={() => navigate('/register')}
                style={{ backgroundColor: '#27ae60' }}
              >
                Create Account
              </button>
            </>
          )}
        </div>
      </div>

      <div className="auth-form">
        <h3>Features</h3>
        <ul>
          <li>✅ User Registration</li>
          <li>✅ Secure Login</li>
          <li>✅ Profile Management</li>
          <li>✅ Password Validation</li>
          <li>✅ Error Handling</li>
          <li>✅ Session Management</li>
        </ul>
      </div>
    </div>
  )
}
