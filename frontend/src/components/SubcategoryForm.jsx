import { useState, useEffect } from 'react'
import subcategoryService from '../services/subcategoryService'
import categoryService from '../services/categoryService'
import '../styles/forms.css'

export function SubcategoryForm({ onSuccess, onCancel, initialData = null }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    status: initialData?.status || 'active',
    categoryId: initialData?.categoryId || '',
  })

  const [categories, setCategories] = useState([])
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [loading, setLoading] = useState(false)
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [message, setMessage] = useState(null)

  // Load categories on mount
  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAllCategories()
      setCategories(data || [])
    } catch (error) {
      console.error('Failed to load categories:', error)
      setMessage({
        type: 'error',
        text: 'Failed to load categories',
      })
    } finally {
      setCategoriesLoading(false)
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Subcategory name is required'
    } else if (formData.name.length > 100) {
      newErrors.name = 'Subcategory name must not exceed 100 characters'
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
      const submitData = {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
      }

      if (initialData) {
        // Update existing subcategory
        await subcategoryService.updateSubcategory(initialData.id, submitData)
        setMessage({
          type: 'success',
          text: 'Subcategory updated successfully!',
        })
      } else {
        // Create new subcategory
        await subcategoryService.createSubcategory(submitData)
        setMessage({
          type: 'success',
          text: 'Subcategory created successfully!',
        })
        // Reset form
        setFormData({
          name: '',
          description: '',
          status: 'active',
          categoryId: '',
        })
        setTouched({})
      }

      setTimeout(() => onSuccess?.(), 1500)
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to save subcategory',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="form-group">
        <label className="form-label" htmlFor="name">
          Subcategory Name <span className="required">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter subcategory name"
          className={`form-input ${errors.name ? 'error' : ''}`}
          disabled={loading}
          maxLength={100}
        />
        {touched.name && errors.name && <span className="form-error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="categoryId">
          Category <span className="optional">(optional)</span>
        </label>
        {categoriesLoading ? (
          <select className="form-input" disabled>
            <option>Loading categories...</option>
          </select>
        ) : (
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="form-input"
            disabled={loading}
          >
            <option value="">-- Select a category --</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        )}
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
          placeholder="Enter subcategory description"
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
          disabled={loading || categoriesLoading}
        >
          {loading ? 'Saving...' : initialData ? 'Update Subcategory' : 'Create Subcategory'}
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

export default SubcategoryForm
