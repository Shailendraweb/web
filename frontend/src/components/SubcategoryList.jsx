import { useState, useEffect } from 'react'
import subcategoryService from '../services/subcategoryService'
import '../styles/forms.css'

export function SubcategoryList({ onEdit, refreshTrigger }) {
  const [subcategories, setSubcategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  // Load subcategories
  useEffect(() => {
    loadSubcategories()
  }, [refreshTrigger])

  const loadSubcategories = async () => {
    setLoading(true)
    try {
      const data = await subcategoryService.getAllSubcategories()
      setSubcategories(data || [])
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to load subcategories',
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this subcategory?')) {
      return
    }

    setDeletingId(id)
    try {
      await subcategoryService.deleteSubcategory(id)
      setMessage({
        type: 'success',
        text: 'Subcategory deleted successfully!',
      })
      await loadSubcategories()
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to delete subcategory',
      })
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading subcategories...</p>
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

      {subcategories.length === 0 ? (
        <div className="empty-state">
          <p>No subcategories found.</p>
          <p className="empty-state-hint">Create one to get started!</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {subcategories.map((subcategory) => (
                <tr key={subcategory.id}>
                  <td className="cell-name">{subcategory.name}</td>
                  <td className="cell-category">
                    {subcategory.category?.name || '-'}
                  </td>
                  <td className="cell-description">
                    {subcategory.description ? subcategory.description.substring(0, 50) + '...' : '-'}
                  </td>
                  <td className="cell-status">
                    <span className={`badge badge-${subcategory.status}`}>
                      {subcategory.status}
                    </span>
                  </td>
                  <td className="cell-actions">
                    <button
                      className="btn-icon edit"
                      onClick={() => onEdit(subcategory)}
                      title="Edit"
                      disabled={deletingId !== null}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(subcategory.id)}
                      title="Delete"
                      disabled={deletingId === subcategory.id}
                    >
                      {deletingId === subcategory.id ? 'Deleting...' : 'Delete'}
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

export default SubcategoryList
