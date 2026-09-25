import { useState, useEffect } from 'react'
import categoryService from '../services/categoryService'
import '../styles/forms.css'

export function CategoryList({ onEdit, refreshTrigger }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  // Load categories
  useEffect(() => {
    loadCategories()
  }, [refreshTrigger])

  const loadCategories = async () => {
    setLoading(true)
    try {
      const data = await categoryService.getAllCategories()
      setCategories(data || [])
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to load categories',
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return
    }

    setDeletingId(id)
    try {
      await categoryService.deleteCategory(id)
      setMessage({
        type: 'success',
        text: 'Category deleted successfully!',
      })
      await loadCategories()
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to delete category',
      })
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading categories...</p>
      </div>
    )
  }

  return (
    <div className="list-container">
      {message && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
          <button
            className="alert-close"
            onClick={() => setMessage(null)}
          >
            ×
          </button>
        </div>
      )}

      {categories.length === 0 ? (
        <div className="empty-state">
          <p>No categories found.</p>
          <p className="empty-state-hint">Create one to get started!</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="cell-name">{category.name}</td>
                  <td className="cell-description">
                    {category.description ? category.description.substring(0, 50) + '...' : '-'}
                  </td>
                  <td className="cell-status">
                    <span className={`badge badge-${category.status}`}>
                      {category.status}
                    </span>
                  </td>
                  <td className="cell-actions">
                    <button
                      className="btn-icon edit"
                      onClick={() => onEdit(category)}
                      title="Edit"
                      disabled={deletingId !== null}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(category.id)}
                      title="Delete"
                      disabled={deletingId === category.id}
                    >
                      {deletingId === category.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default CategoryList
