import apiClient from './apiClient'

const AUTH_API_URL = 'api/v1/auth'
const USER_API_URL = 'user'

export const authService = {
  // Register a new user
  async register(firstName, lastName, email, password) {
    try {
      const response = await apiClient.post(`${AUTH_API_URL}/register`, {
        firstName,
        lastName,
        email,
        password,
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  // Login user
  async login(email, password) {
    try {
      const response = await apiClient.post(`${AUTH_API_URL}/login`, {
        email,
        password,
      })
      const { accessToken, user } = response.data

      // Store token and user data
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('user', JSON.stringify(user))

      return { accessToken, user }
    } catch (error) {
      throw this.handleError(error)
    }
  },

  // Get current user profile
  async getProfile() {
    try {
      const response = await apiClient.get(`${AUTH_API_URL}/profile`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  // Logout user
  async logout() {
    try {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      await apiClient.post(`${AUTH_API_URL}/logout`)
      return { message: 'Logout successful' }
    } catch (error) {
      // Still clear local storage even if request fails
      localStorage.removeItem('accessToken')
      localStorage.removeItem('user')
      throw this.handleError(error)
    }
  },

  // Forgot password
  async forgotPassword(email) {
    try {
      const response = await apiClient.post(`${AUTH_API_URL}/forgot-password`, {
        email,
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  // Reset password
  async resetPassword(token, password) {
    try {
      const response = await apiClient.post(`${AUTH_API_URL}/reset-password`, {
        token,
        password,
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  // Get stored token
  getToken() {
    return localStorage.getItem('accessToken')
  },

  // Get stored user
  getUser() {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getToken()
  },

  // Handle errors
  handleError(error) {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message)
    }
    if (error.response?.status === 409) {
      return new Error('Email already exists')
    }
    if (error.response?.status === 401) {
      return new Error('Invalid credentials')
    }
    if (error.response?.data?.error) {
      return new Error(error.response.data.error)
    }
    return error
  },
}

export const userService = {
  // Create user (alternative endpoint)
  async createUser(firstName, lastName, email, password) {
    try {
      const response = await apiClient.post(USER_API_URL, {
        firstName,
        lastName,
        email,
        password,
      })
      return response.data
    } catch (error) {
      throw userService.handleError(error)
    }
  },

  // Get all users (admin only)
  async getAllUsers() {
    try {
      const response = await apiClient.get(USER_API_URL)
      return response.data
    } catch (error) {
      throw userService.handleError(error)
    }
  },

  // Get user by ID
  async getUserById(id) {
    try {
      const response = await apiClient.get(`${USER_API_URL}/${id}`)
      return response.data
    } catch (error) {
      throw userService.handleError(error)
    }
  },

  // Update user
  async updateUser(id, userData) {
    try {
      const response = await apiClient.patch(`${USER_API_URL}/${id}`, userData)
      return response.data
    } catch (error) {
      throw userService.handleError(error)
    }
  },

  // Delete user
  async deleteUser(id) {
    try {
      const response = await apiClient.delete(`${USER_API_URL}/${id}`)
      return response.data
    } catch (error) {
      throw userService.handleError(error)
    }
  },

  // Handle errors
  handleError(error) {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message)
    }
    if (error.response?.status === 409) {
      return new Error('Email already exists')
    }
    if (error.response?.status === 404) {
      return new Error('User not found')
    }
    if (error.response?.data?.error) {
      return new Error(error.response.data.error)
    }
    return error
  },
}
