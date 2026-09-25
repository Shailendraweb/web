import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { validateField } from '../utils/validation'
import { getErrorMessage, isAdmin } from '../utils/authUtils'
import '../styles/forms.css'

export function LoginForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [generalError, setGeneralError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }

    // Clear general error when user starts typing
    if (generalError) {
      setGeneralError('')
    }
  }

  const handleFieldBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))

    // Validate field on blur
    const error = validateField(name, formData[name])
    if (error) {
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }))
    } else {
      setErrors((prev) => {
        const updated = { ...prev }
        delete updated[name]
        return updated
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setGeneralError('')
    setSuccessMessage('')

    // Mark all fields as touched
    setTouched({
      email: true,
      password: true,
    })

    // Validate fields
    let newErrors = {}
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else {
      const emailError = validateField('email', formData.email)
      if (emailError) {
        newErrors.email = emailError
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    try {
      // Call login API
      await authService.login(formData.email, formData.password)

      setSuccessMessage('Login successful! Redirecting...')
      // Redirect to dashboard after successful login
      setTimeout(() => {
        navigate(isAdmin() ? '/admin' : '/shop')
      }, 1500)
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      setGeneralError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-form auth-card">
      <div className="auth-card-heading">
        <span className="auth-kicker">WELCOME BACK</span>
        <h2>Sign in to continue</h2>
        <p>Pick up where you left off with NovaCommerce.</p>
      </div>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {generalError && <div className="alert alert-error">{generalError}</div>}

      <form onSubmit={handleSubmit}>
        {/* Email Field */}
        <div className="form-group auth-field">
          <label className="form-label" htmlFor="email">
            Email Address *
          </label>
          <input
            id="email"
            type="email"
            name="email"
            className={`form-input ${errors.email ? 'error' : ''}`}
            value={formData.email}
            onChange={handleInputChange}
            onBlur={handleFieldBlur}
            disabled={loading}
            placeholder="Enter your email"
            required
          />
          {touched.email && errors.email && (
            <span className="form-error">{errors.email}</span>
          )}
        </div>

        {/* Password Field */}
        <div className="form-group auth-field">
          <label className="form-label" htmlFor="password">
            Password *
          </label>
          <div className="password-input-wrap">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
            name="password"
            className={`form-input ${errors.password ? 'error' : ''}`}
            value={formData.password}
            onChange={handleInputChange}
            onBlur={handleFieldBlur}
            disabled={loading}
            placeholder="Enter your password"
            required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((visible) => !visible)}
              disabled={loading}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {touched.password && errors.password && (
            <span className="form-error">{errors.password}</span>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="form-button auth-submit" disabled={loading}>
          {loading ? (
            <>
              <span className="loading-spinner"></span> Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="form-link auth-secondary-link">
        <a href="/forgot-password">Forgot your password?</a>
      </div>

      <div className="form-divider">or</div>

      <div className="form-link">
        Don&apos;t have an account? <a href="/register">Create one here</a>
      </div>
    </div>
  )
}
