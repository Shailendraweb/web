import { useState } from 'react'
import SubcategoryForm from '../components/SubcategoryForm'
import SubcategoryList from '../components/SubcategoryList'
import '../styles/forms.css'

export function SubcategoryPage() {
  const [editingSubcategory, setEditingSubcategory] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleAdd = () => {
    setEditingSubcategory(null)
    setShowForm(true)
  }

  const handleEdit = (subcategory) => {
    setEditingSubcategory(subcategory)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingSubcategory(null)
    setRefreshTrigger((prev) => prev + 1)
  }

  const handleFormCancel = () => {
    setShowForm(false)
    setEditingSubcategory(null)
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>Subcategories</h1>
        <p>Manage product subcategories</p>
      </div>

      <div className="page-content">
        <div className="content-grid">
          {/* List Section */}
          <div className="list-section">
            <div className="section-header">
              <h2>All Subcategories</h2>
              {!showForm && (
                <button className="btn-primary" onClick={handleAdd}>
                  + Add Subcategory
                </button>
              )}
            </div>
            <SubcategoryList onEdit={handleEdit} refreshTrigger={refreshTrigger} />
          </div>

          {/* Form Section */}
          {showForm && (
            <div className="form-section">
              <div className="section-header">
                <h2>{editingSubcategory ? 'Edit Subcategory' : 'Add New Subcategory'}</h2>
              </div>
              <SubcategoryForm
                initialData={editingSubcategory}
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

export default SubcategoryPage
