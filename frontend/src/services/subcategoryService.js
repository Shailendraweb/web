import apiClient from './apiClient'

const SUBCATEGORY_API_URL = 'api/v1/subcategories'

export const subcategoryService = {
  /**
   * Get all subcategories
   */
  async getAllSubcategories() {
    try {
      const response = await apiClient.get(SUBCATEGORY_API_URL)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  /**
   * Get a single subcategory by ID
   */
  async getSubcategoryById(id) {
    try {
      const response = await apiClient.get(`${SUBCATEGORY_API_URL}/${id}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  /**
   * Create a new subcategory
   */
  async createSubcategory(data) {
    try {
      const response = await apiClient.post(SUBCATEGORY_API_URL, {
        name: data.name,
        description: data.description,
        status: data.status || 'active',
        categoryId: data.categoryId,
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  /**
   * Update an existing subcategory
   */
  async updateSubcategory(id, data) {
    try {
      const response = await apiClient.patch(`${SUBCATEGORY_API_URL}/${id}`, {
        name: data.name,
        description: data.description,
        status: data.status,
        categoryId: data.categoryId,
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  /**
   * Delete a subcategory
   */
  async deleteSubcategory(id) {
    try {
      const response = await apiClient.delete(`${SUBCATEGORY_API_URL}/${id}`)
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

export default subcategoryService
