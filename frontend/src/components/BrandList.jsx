import { useState, useEffect } from 'react'
import brandService from '../services/brandService'
import '../styles/forms.css'

export function BrandList({ onEdit, refreshTrigger }) {
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState(null)
  const [deletingId, setDeletingId] = useState(null)

  // Load brands
  useEffect(() => {
    loadBrands()
  }, [refreshTrigger])

  const loadBrands = async () => {
    setLoading(true)
    try {
      const data = await brandService.getAllBrands()
      setBrands(data || [])
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to load brands',
      })
    } finally {
      setLoading(false)
    }
  }

  // Handle delete
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this brand?')) {
      return
    }

    setDeletingId(id)
    try {
      await brandService.deleteBrand(id)
      setMessage({
        type: 'success',
        text: 'Brand deleted successfully!',
      })
      await loadBrands()
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.message || 'Failed to delete brand',
      })
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading brands...</p>
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

      {brands.length === 0 ? (
        <div className="empty-state">
          <p>No brands found.</p>
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
              {brands.map((brand) => (
                <tr key={brand.id}>
                  <td className="cell-name">{brand.name}</td>
                  <td className="cell-description">
                    {brand.description ? brand.description.substring(0, 50) + '...' : '-'}
                  </td>
                  <td className="cell-status">
                    <span className={`badge badge-${brand.status}`}>
                      {brand.status}
                    </span>
                  </td>
                  <td className="cell-actions">
                    <button
                      className="btn-icon edit"
                      onClick={() => onEdit(brand)}
                      title="Edit"
                      disabled={deletingId !== null}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-icon delete"
                      onClick={() => handleDelete(brand.id)}
                      title="Delete"
                      disabled={deletingId === brand.id}
                    >
                      {deletingId === brand.id ? 'Deleting...' : 'Delete'}
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

export default BrandList
