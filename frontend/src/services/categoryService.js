import apiClient from './apiClient'

const CATEGORY_API_URL = 'api/v1/categories'

export const categoryService = {
  /**
   * Get all categories
   */
  async getAllCategories() {
    try {
      const response = await apiClient.get(CATEGORY_API_URL)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  /**
   * Get a single category by ID
   */
  async getCategoryById(id) {
    try {
      const response = await apiClient.get(`${CATEGORY_API_URL}/${id}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  /**
   * Create a new category
   */
  async createCategory(data) {
    try {
      const response = await apiClient.post(CATEGORY_API_URL, {
        name: data.name,
        description: data.description,
        status: data.status || 'active',
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  /**
   * Update an existing category
   */
  async updateCategory(id, data) {
    try {
      const response = await apiClient.patch(`${CATEGORY_API_URL}/${id}`, {
        name: data.name,
        description: data.description,
        status: data.status,
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  /**
   * Delete a category
   */
  async deleteCategory(id) {
    try {
      const response = await apiClient.delete(`${CATEGORY_API_URL}/${id}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  /**
   * Handle API errors
   */
  handleError(error) {
    const message = error.response?.data?.message || error.message || 'An error occurred'
    const errors = error.response?.data?.errors
    return new Error(errors ? JSON.stringify(errors) : message)
  },
}

export default categoryService
