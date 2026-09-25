/**
 * Auth utilities for managing authentication state
 */

const USER_STORAGE_KEY = 'user'
const TOKEN_STORAGE_KEY = 'accessToken'

/**
 * Store user data in localStorage
 */
export const storeUser = (user) => {
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
}

/**
 * Get user data from localStorage
 */
export const getStoredUser = () => {
  const user = localStorage.getItem(USER_STORAGE_KEY)
  return user ? JSON.parse(user) : null
}

/**
 * Clear user data from localStorage
 */
export const clearStoredUser = () => {
  localStorage.removeItem(USER_STORAGE_KEY)
}

/**
 * Store access token in localStorage
 */
export const storeToken = (token) => {
  localStorage.setItem(TOKEN_STORAGE_KEY, token)
}

/**
 * Get access token from localStorage
 */
export const getStoredToken = () => {
  return localStorage.getItem(TOKEN_STORAGE_KEY)
}

/**
 * Clear access token from localStorage
 */
export const clearStoredToken = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

/**
 * Check if user is authenticated
 */
export const isUserAuthenticated = () => {
  return !!getStoredToken()
}

export const getUserRole = () => {
  const user = getStoredUser()
  return user?.role || user?.roles?.[0] || 'customer'
}

export const isAdmin = () => getUserRole().toLowerCase() === 'admin'

/**
 * Clear all authentication data
 */
export const clearAuthData = () => {
  clearStoredUser()
  clearStoredToken()
}

/**
 * Get full name from user object
 */
export const getFullName = (user) => {
  if (!user) return ''
  return `${user.firstName} ${user.lastName}`.trim()
}

/**
 * Format error message from API response
 */
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message
  }
  if (error.response?.data?.error) {
    return error.response.data.error
  }
  if (error.message) {
    return error.message
  }
  return 'An error occurred'
}
