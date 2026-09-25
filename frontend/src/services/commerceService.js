import apiClient from './apiClient'

const request = async (promise) => {
  try {
    const response = await promise
    return response.data
  } catch (error) {
    const message = error.response?.data?.message || error.message || 'Request failed'
    throw new Error(Array.isArray(message) ? message.join(', ') : message)
  }
}

export const toCollection = (value) => {
  if (Array.isArray(value)) return value
  if (Array.isArray(value?.items)) return value.items
  if (Array.isArray(value?.data)) return value.data
  if (Array.isArray(value?.results)) return value.results
  return []
}

export const commerceService = {
  getProducts: (params = {}) => request(apiClient.get('api/v1/products', { params })),
  getProduct: (id) => request(apiClient.get(`api/v1/products/${id}`)),
  getProductImages: (id) => request(apiClient.get(`api/v1/products/${id}/images`)),
  getProductVariants: (id) => request(apiClient.get(`api/v1/products/${id}/variants`)),
  getProductReviews: (id) => request(apiClient.get(`api/v1/products/${id}/reviews`)),
  getCategories: () => request(apiClient.get('api/v1/categories')),
  getSubcategories: () => request(apiClient.get('api/v1/subcategories')),
  getBrands: () => request(apiClient.get('api/v1/brands')),
  getCart: () => request(apiClient.get('api/v1/cart')),
  addToCart: (variantId, quantity = 1) => request(apiClient.post('api/v1/cart/items', { variant_id: variantId, quantity })),
  updateCartItem: (id, quantity) => request(apiClient.patch(`api/v1/cart/items/${id}`, { quantity })),
  removeCartItem: (id) => request(apiClient.delete(`api/v1/cart/items/${id}`)),
  clearCart: () => request(apiClient.delete('api/v1/cart')),
  getWishlist: () => request(apiClient.get('api/v1/wishlist')),
  addToWishlist: (productId) => request(apiClient.post(`api/v1/products/${productId}/wishlist`)),
  removeFromWishlist: (productId) => request(apiClient.delete(`api/v1/products/${productId}/wishlist`)),
  getOrders: (params = {}) => request(apiClient.get('api/v1/orders', { params })),
  getOrder: (id) => request(apiClient.get(`api/v1/orders/${id}`)),
  createOrder: (addressId) => request(apiClient.post('api/v1/orders', { address_id: addressId })),
  getAddresses: () => request(apiClient.get('api/v1/addresses')),
  getInventory: () => request(apiClient.get('api/v1/inventory')),
  getUsers: () => request(apiClient.get('user')),
}

export default commerceService
