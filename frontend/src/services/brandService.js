import apiClient from './apiClient'

const BRAND_API_URL = 'api/v1/brands'

export const brandService = {
  /**
   * Get all brands
   */
  async getAllBrands() {
    try {
      const response = await apiClient.get(BRAND_API_URL)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  /**
   * Get a single brand by ID
   */
  async getBrandById(id) {
    try {
      const response = await apiClient.get(`${BRAND_API_URL}/${id}`)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  },

  /**
   * Create a new brand
   */
  async createBrand(data) {
    try {
      const response = await apiClient.post(BRAND_API_URL, {
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
   * Update an existing brand
   */
  async updateBrand(id, data) {
    try {
      const response = await apiClient.patch(`${BRAND_API_URL}/${id}`, {
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
   * Delete a brand
   */
  async deleteBrand(id) {
    try {
      const response = await apiClient.delete(`${BRAND_API_URL}/${id}`)
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

export default brandService
