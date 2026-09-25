import { useState } from 'react'
import CategoryForm from '../components/CategoryForm'
import CategoryList from '../components/CategoryList'
import '../styles/forms.css'

export function CategoryPage() {
  const [editingCategory, setEditingCategory] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleAdd = () => {
    setEditingCategory(null)
    setShowForm(true)
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingCategory(null)
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingCategory(null)
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Categories</h1>
        <p>Manage product categories</p>
      </div>

      <div className="page-content">
        <div className="content-grid">
          {/* List Section */}
          <div className="list-section">
            <div className="section-header">
              <h2>All Categories</h2>
              {!showForm && (
                <button className="btn-primary" onClick={handleAdd}>
                  + Add Category
                </button>
              )}
            </div>
            <CategoryList onEdit={handleEdit} refreshTrigger={refreshTrigger} />
          </div>

          {/* Form Section */}
          {showForm && (
            <div className="form-section">
              <div className="section-header">
                <h2>{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
              </div>
              <CategoryForm
                initialData={editingCategory}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CategoryPage
