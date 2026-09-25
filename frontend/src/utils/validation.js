/**
 * Validation utilities for form inputs
 * These rules mirror the backend validation in DTOs
 */

// Password pattern: must include uppercase, lowercase, number, and special character
// 8-20 characters
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/

export const validationRules = {
  // First name validation
  firstName: {
    minLength: 2,
    maxLength: 50,
    validate: (value) => {
      if (!value) return 'First name is required'
      if (value.length < 2) return 'First name must be at least 2 characters'
      if (value.length > 50) return 'First name must not exceed 50 characters'
      return ''
    },
  },

  // Last name validation
  lastName: {
    minLength: 2,
    maxLength: 50,
    validate: (value) => {
      if (!value) return 'Last name is required'
      if (value.length < 2) return 'Last name must be at least 2 characters'
      if (value.length > 50) return 'Last name must not exceed 50 characters'
      return ''
    },
  },

  // Email validation
  email: {
    validate: (value) => {
      if (!value) return 'Email is required'
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailPattern.test(value)) return 'Please enter a valid email address'
      return ''
    },
  },

  // Password validation
  password: {
    minLength: 8,
    maxLength: 20,
    validate: (value) => {
      if (!value) return 'Password is required'
      if (value.length < 8) return 'Password must be at least 8 characters'
      if (value.length > 20) return 'Password must not exceed 20 characters'
      if (!PASSWORD_PATTERN.test(value)) {
        return 'Password must contain uppercase, lowercase, number, and special character (@$!%*?&)'
      }
      return ''
    },
  },

  // Confirm password validation
  confirmPassword: {
    validate: (value, password) => {
      if (!value) return 'Please confirm your password'
      if (value !== password) return 'Passwords do not match'
      return ''
    },
  },
}

/**
 * Validate all form fields
 * @param {Object} formData - Object with form field values
 * @param {Array} fields - Array of field names to validate
 * @returns {Object} Object with validation errors
 */
export const validateForm = (formData, fields) => {
  const errors = {}

  fields.forEach((field) => {
    const rule = validationRules[field]
    if (!rule) return

    let error = ''
    if (field === 'confirmPassword') {
      error = rule.validate(formData[field], formData.password)
    } else {
      error = rule.validate(formData[field])
    }

    if (error) {
      errors[field] = error
    }
  })

  return errors
}

/**
 * Validate a single field
 * @param {string} fieldName - Name of the field to validate
 * @param {string} value - Value to validate
 * @param {string} password - Password value (for confirmPassword validation)
 * @returns {string} Error message if validation fails, empty string if valid
 */
export const validateField = (fieldName, value, password = '') => {
  const rule = validationRules[fieldName]
  if (!rule) return ''

  if (fieldName === 'confirmPassword') {
    return rule.validate(value, password)
  }
  return rule.validate(value)
}
