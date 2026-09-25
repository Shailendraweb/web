import { useState, useEffect } from 'react'
import brandService from '../services/brandService'
import '../styles/forms.css'

export function BrandForm({ onSuccess, onCancel, initialData = null }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    status: initialData?.status || 'active',
  })

  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Brand name is required'
    } else if (formData.name.length > 100) {
      newErrors.name = 'Brand name must not exceed 100 characters'
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must not exceed 500 characters'
    }

    return newErrors
  }

  // Handle field change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  // Handle blur
  const handleBlur = (e) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      if (initialData) {
        // Update existing brand
        await brandService.updateBrand(initialData.id, formData)
        setMessage({
          type: 'success',
          text: 'Brand updated successfully!',
        })
      } else {
        // Create new brand
        await brandService.createBrand(formData)
        setMessage({
          type: 'success',
          text: 'Brand created successfully!',
        })
        // Reset form
        setFormData({
          name: '',
          description: '',
          status: 'active',
        })
        setTouched({})
      }

      setTimeout(() => onSuccess?.(), 1500)
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to save brand',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label className="form-label" htmlFor="name">
          Brand Name <span className="required">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter brand name"
          className={`form-input ${errors.name ? 'error' : ''}`}
          disabled={loading}
          maxLength={100}
        />
        {touched.name && errors.name && <span className="form-error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="description">
          Description <span className="optional">(optional)</span>
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter brand description"
          className={`form-input ${errors.description ? 'error' : ''}`}
          disabled={loading}
          rows={4}
          maxLength={500}
        />
        <small className="char-count">
          {formData.description.length}/500
        </small>
        {touched.description && errors.description && (
          <span className="form-error">{errors.description}</span>
        )}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="status">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="form-input"
          disabled={loading}
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="form-actions">
        <button
          type="submit"
          className="form-button"
          disabled={loading}
        >
          {loading ? 'Saving...' : initialData ? 'Update Brand' : 'Create Brand'}
        </button>
        {onCancel && (
          <button
            type="button"
            className="form-button secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default BrandForm
