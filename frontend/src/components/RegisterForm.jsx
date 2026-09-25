import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { validateForm } from '../utils/validation'
import { getErrorMessage, storeToken, storeUser } from '../utils/authUtils'
import '../styles/forms.css'

export function RegisterForm() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [generalError, setGeneralError] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    validateField(name)
  }

  const validateField = (fieldName) => {
    const fieldsToValidate = [
      'firstName',
      'lastName',
      'email',
      'password',
      'confirmPassword',
    ]
    const newErrors = validateForm(formData, fieldsToValidate)

    if (newErrors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: newErrors[fieldName],
      }))
    } else {
      setErrors((prev) => {
        const updated = { ...prev }
        delete updated[fieldName]
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
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirmPassword: true,
    })

    // Validate all fields
    const fieldsToValidate = [
      'firstName',
      'lastName',
      'email',
      'password',
      'confirmPassword',
    ]
    const newErrors = validateForm(formData, fieldsToValidate)

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)

    try {
      // Call register API
      const response = await authService.register(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password
      )

      // Now login the user
      const loginResponse = await authService.login(
        formData.email,
        formData.password
      )

      setSuccessMessage('Registration successful! Redirecting...')
      // Redirect to dashboard or home page after successful registration and login
      setTimeout(() => {
        navigate('/shop')
      }, 1500)
    } catch (error) {
      const errorMessage = getErrorMessage(error)
      setGeneralError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-form auth-card auth-card-register">
      <div className="auth-card-heading">
        <span className="auth-kicker">START SOMETHING NEW</span>
        <h2>Create your account</h2>
        <p>Join NovaCommerce for a more thoughtful way to shop.</p>
      </div>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {generalError && <div className="alert alert-error">{generalError}</div>}

      <form onSubmit={handleSubmit}>
        {/* First Name Field */}
        <div className="auth-field-row">
        <div className="form-group auth-field">
          <label className="form-label" htmlFor="firstName">
            First Name *
          </label>
          <input
            id="firstName"
            type="text"
            name="firstName"
            className={`form-input ${errors.firstName ? 'error' : ''}`}
            value={formData.firstName}
            onChange={handleInputChange}
            onBlur={handleFieldBlur}
            disabled={loading}
            placeholder="Enter your first name"
            required
          />
          {touched.firstName && errors.firstName && (
            <span className="form-error">{errors.firstName}</span>
          )}
        </div>

        {/* Last Name Field */}
        <div className="form-group auth-field">
          <label className="form-label" htmlFor="lastName">
            Last Name *
          </label>
          <input
            id="lastName"
            type="text"
            name="lastName"
            className={`form-input ${errors.lastName ? 'error' : ''}`}
            value={formData.lastName}
            onChange={handleInputChange}
            onBlur={handleFieldBlur}
            disabled={loading}
            placeholder="Enter your last name"
            required
          />
          {touched.lastName && errors.lastName && (
            <span className="form-error">{errors.lastName}</span>
          )}
        </div>
        </div>

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
          <div className="password-requirements">
            <strong>Password Requirements:</strong>
            <div className={`password-requirement ${formData.password.length >= 8 ? 'met' : ''}`}>
              At least 8 characters
            </div>
            <div
              className={`password-requirement ${
                /[A-Z]/.test(formData.password) ? 'met' : ''
              }`}
            >
              At least one uppercase letter
            </div>
            <div
              className={`password-requirement ${
                /[a-z]/.test(formData.password) ? 'met' : ''
              }`}
            >
              At least one lowercase letter
            </div>
            <div
              className={`password-requirement ${/\d/.test(formData.password) ? 'met' : ''}`}
            >
              At least one number
            </div>
            <div
              className={`password-requirement ${
                /[@$!%*?&]/.test(formData.password) ? 'met' : ''
              }`}
            >
              At least one special character (@$!%*?&)
            </div>
          </div>
        </div>

        {/* Confirm Password Field */}
        <div className="form-group auth-field">
          <label className="form-label" htmlFor="confirmPassword">
            Confirm Password *
          </label>
          <div className="password-input-wrap">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
            value={formData.confirmPassword}
            onChange={handleInputChange}
            onBlur={handleFieldBlur}
            disabled={loading}
            placeholder="Confirm your password"
            required
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirmPassword((visible) => !visible)}
              disabled={loading}
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          {touched.confirmPassword && errors.confirmPassword && (
            <span className="form-error">{errors.confirmPassword}</span>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="form-button auth-submit" disabled={loading}>
          {loading ? (
            <>
              <span className="loading-spinner"></span> Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className="form-link auth-secondary-link">
        Already have an account? <a href="/login">Sign in here</a>
      </div>
    </div>
  )
}
